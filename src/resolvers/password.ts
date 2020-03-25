import {
	UserInputError,
	ForbiddenError,
	AuthenticationError
} from 'apollo-server-lambda'
import { AdvitoUser, AccessToken } from '../models'
import {
	sendEmail,
	getDateString,
	checkValidPassword,
	saltPassword
} from '../utils'
import { Context } from '../types'
import moment from 'moment'
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
		},
		resetPassword: async (
			_: null,
			{
				token,
				password,
				confirmPassword
			}: { token: string; password: string; confirmPassword: string }
		): Promise<boolean> => {
			if (password !== confirmPassword) {
				throw new UserInputError('Passwords do not match')
			}
			const errorMessages = checkValidPassword(password)
			if (errorMessages.length)
				throw new UserInputError(errorMessages.join(';'))
			const accessToken = await AccessToken.query()
				.where('token', token)
				.first()
			if (!accessToken) {
				throw new AuthenticationError('Access token is not valid')
			}
			const { isActive, tokenExpiration, advitoUserId } = accessToken
			if (!isActive || moment(tokenExpiration).diff(moment()) < 0) {
				throw new AuthenticationError('Access token has expired')
			}
			const { salt, hashedPassword } = saltPassword(password)
			await AdvitoUser.query().patchAndFetchById(advitoUserId, {
				pwd: hashedPassword,
				userSalt: salt
			})
			return true
		}
	}
}
