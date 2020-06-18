import { ForbiddenError, UserInputError } from 'apollo-server-lambda'
import crypto from 'crypto'
import moment from 'moment'
import { AdvitoUser, AdvitoUserSession } from '../models'
import { User } from '../types'
import { getDateString, saltPassword } from '../utils'

export default {
	Mutation: {
		login: async (
			_: null,
			{ username, password },
			{ applicationId }
		): Promise<User> => {
			const user = await AdvitoUser.query()
				.where('username', username.toLowerCase())
				.withGraphFetched(
					'[advitoUserRoleLink(advitoRoleId), advitoUserSession(sessionToken)]'
				)
				.first()
			if (!user) throw new UserInputError('User not found')
			if (!user.isEnabled) throw new UserInputError('User is not enabled')
			const { pwd, userSalt } = user
			const { hashedPassword } = saltPassword(password, userSalt)
			if (pwd !== hashedPassword) {
				throw new UserInputError('Password is incorrect')
			}
			const userSession = user.advitoUserSession[0]
			let sessionToken = crypto.randomBytes(16).toString('base64')

			if (
				userSession &&
				moment(userSession.sessionExpiration).diff(moment()) >= 0
			) {
				sessionToken = userSession.sessionToken
			}
			if (
				userSession &&
				moment(userSession.sessionExpiration).diff(moment()) <= 0
			) {
				await user
					.$relatedQuery('advitoUserSession')
					.patch({
						sessionEnd: getDateString()
					})
					.where('sessionEnd', null)
			}
			if (
				!userSession ||
				(userSession &&
					moment(userSession.sessionExpiration).diff(moment()) <= 0)
			) {
				await user.$relatedQuery('advitoUserSession').insert({
					sessionToken,
					sessionStart: getDateString(),
					sessionEnd: null,
					sessionDurationSec: 3600,
					sessionType: 'User',
					sessionExpiration: getDateString('session'),
					sessionNote: null,
					created: getDateString(),
					modified: getDateString()
				})
			}
			const roleIds = user.advitoUserRoleLink.map((role) => +role.advitoRoleId)
			if (applicationId === 4) {
				if (!roleIds.includes(12) && !roleIds.includes(13))
					throw new ForbiddenError('User has invalid roles')
			}

			// TODO enable this eventually
			// await user.$relatedQuery('advitoUserLog').insert({
			//   advitoUserId: user.id,
			//   activity: 'User login'
			// })
			return {
				id: user.id,
				displayName: user.fullName(),
				clientId: user.clientId,
				sessionToken,
				roleIds
			}
		},
		logout: async (_: null, { sessionToken }): Promise<boolean> => {
			const session = await AdvitoUserSession.query()
				.where('sessionToken', sessionToken)
				.where('sessionEnd', null)
				.first()
			if (!session) return false
			if (+session.advitoUserId === 882) return true // return if user is the advito session token user
			await AdvitoUserSession.query()
				.patch({
					sessionEnd: getDateString()
				})
				.where('sessionToken', sessionToken)
				.andWhere('sessionEnd', null)
			return true
		}
	}
}
