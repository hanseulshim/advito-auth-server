import { UserInputError } from 'apollo-server-lambda'
import { AdvitoUser } from '../models'
import { saltPassword, getDateString } from '../utils'
import crypto from 'crypto'

export default {
	Mutation: {
		login: async (_, { username, password }, { application }): Promise<{}> => {
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
			if (user.advitoUserSession.length) {
				await user
					.$relatedQuery('advitoUserSession')
					.patch({
						sessionEnd: getDateString()
					})
					.where('sessionEnd', null)
			}
			const sessionToken = crypto.randomBytes(16).toString('base64')
			await user.$relatedQuery('advitoUserSession').insert({
				sessionToken,
				sessionStart: getDateString(),
				sessionEnd: null,
				sessionDurationSec: 3600,
				sessionType: application,
				sessionExpiration: getDateString('session'),
				sessionNote: null,
				created: getDateString(),
				modified: getDateString()
			})
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
				roleIds: user.advitoUserRoleLink.map(role => role.advitoRoleId)
			}
		}
	}
}
