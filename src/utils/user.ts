import { AuthenticationError } from 'apollo-server-lambda'
import { AdvitoUserSession, AdvitoUser } from '../models'
import { User } from '../types'
import moment from 'moment'

export const authenticateUser = async (sessionToken: string): Promise<User> => {
	if (!sessionToken) return null
	const session = await AdvitoUserSession.query()
		.where('sessionToken', sessionToken)
		.andWhere('sessionEnd', null)
		.first()
	if (!session) throw new AuthenticationError('Session is invalid.')

	const { id, sessionExpiration, sessionDurationSec } = session

	if (moment(sessionExpiration).diff(moment()) <= 0) {
		throw new AuthenticationError('Session has expired.')
	}

	const newExpiration = moment().add(sessionDurationSec, 's')
	const timeDifference = newExpiration.diff(sessionExpiration, 'm')

	if (timeDifference > 50) {
		try {
			await AdvitoUserSession.query().patchAndFetchById(id, {
				sessionExpiration: newExpiration.format()
			})
		} catch (err) {
			console.log(err)
		}
	}

	const user = await AdvitoUser.query()
		.findById(session.advitoUserId)
		.withGraphFetched('advitoUserRoleLink(advitoRoleId)')
	if (!user) throw new AuthenticationError('User not found')
	return {
		id: user.id,
		displayName: user.fullName(),
		clientId: user.clientId,
		sessionToken,
		roleIds: user.advitoUserRoleLink.map(role => role.advitoRoleId)
	}
}
