import { UserInputError, ForbiddenError } from 'apollo-server-lambda'
import { AdvitoUser } from '../models'
import { sendEmail, getDateString } from '../utils'
import { Context } from '../types'
import crypto from 'crypto'

export default {
	Mutation: {
		sendResetPasswordEmail: async (
			_: null,
			{ email },
			{ applicationId }: Context
		): Promise<string> => {
			const user = await AdvitoUser.query()
				.where('email', email.toLowerCase())
				.withGraphFetched('accessToken')
				.first()
			if (!user) throw new UserInputError('User not found')
			if (user.accessToken.length) {
				await user
					.$relatedQuery('accessToken')
					.patch({ isActive: false })
					.where('isActive', true)
			}
			const token = `PASS${crypto.randomBytes(16).toString('hex')}`
			await user.$relatedQuery('accessToken').insert({
				tokenType: 'RECOVERY',
				token,
				tokenExpiration: getDateString('recovery')
			})
			try {
				await sendEmail(user.nameFirst, user.email, applicationId, token)
				return `Password has been sent to ${user.email}`
			} catch (err) {
				throw new ForbiddenError(err.message)
			}
		}
	}
}
