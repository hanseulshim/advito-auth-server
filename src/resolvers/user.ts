import { UserInputError } from 'apollo-server-lambda'
import { AdvitoUser } from '../models'
import { validateEmail, checkValidPassword, saltPassword } from '../utils'
import { AdvitoUserType } from '../types'
import isEmpty from 'lodash.isempty'

export default {
	Mutation: {
		createUser: async (
			_: null,
			{
				clientId,
				username,
				nameLast,
				nameFirst,
				isEnabled,
				password,
				confirmPassword,
				roleIds = []
			}
		): Promise<AdvitoUserType> => {
			const errorMessages = checkValidPassword(password)
			if (password !== confirmPassword) {
				throw new UserInputError('Passwords do not match')
			}
			if (errorMessages.length)
				throw new UserInputError(errorMessages.join(','))
			const checkEmail = validateEmail(username)
			if (!checkEmail) throw new UserInputError('Username is invalid')
			if (!nameLast || !nameFirst) {
				throw new UserInputError('Name cannot be blank')
			}
			if (!roleIds.length) throw new UserInputError('User needs a role')
			const email = username.toLowerCase()
			const checkUser = await AdvitoUser.query()
				.where('username', email)
				.first()
			if (checkUser) throw new UserInputError('User already exists')
			const { salt: userSalt, hashedPassword: pwd } = saltPassword(password)
			const user = await AdvitoUser.query().insert({
				clientId,
				username: email,
				pwd,
				nameLast,
				nameFirst,
				isEnabled,
				isVerified: false,
				mustChangePwd: false,
				userSalt,
				email,
				defaultTimezone: 'EST',
				defaultLanguage: 'English'
			})
			const roleIdsInsert = roleIds.map(advitoRoleId => ({
				advitoRoleId
			}))
			await user.$relatedQuery('advitoUserRoleLink').insert(roleIdsInsert)
			return {
				...user,
				roleIds
			}
		},
		updateUser: async (
			_: null,
			{ id, roleIds = [], ...rest }
		): Promise<AdvitoUserType> => {
			const checkUser = await AdvitoUser.query()
				.findById(id)
				.withGraphFetched('advitoUserRoleLink(advitoRoleId)')
				.first()
			if (!checkUser) throw new UserInputError('User not found')
			if (checkUser.email && +checkUser.id !== id) {
				throw new UserInputError('User email already exists')
			}
			const patchObject = {}
			for (const [key, value] of Object.entries(rest)) {
				if (value) {
					patchObject[key] = value
				}
			}
			const user = isEmpty(patchObject)
				? checkUser
				: await AdvitoUser.query()
						.skipUndefined()
						.patchAndFetchById(id, patchObject)
						.withGraphFetched('advitoUserRoleLink(advitoRoleId)')
			if (roleIds.length) {
				console.log(roleIds.length)
				await user.$relatedQuery('advitoUserRoleLink').delete()
				await user.$relatedQuery('advitoUserRoleLink').insert(
					roleIds.map(advitoRoleId => ({
						advitoRoleId
					}))
				)
			}
			return {
				...user,
				roleIds: user.advitoUserRoleLink.map(role => role.advitoRoleId)
			}
		}
		// updateUserPassword: async (_, { id, password, confirmPassword }) => {
		// 	const user = await AdvitoUser.query()
		// 		.findById(id)
		// 		.first()
		// 	if (!user) throw new UserInputError('User not found')
		// 	if (password !== confirmPassword) {
		// 		throw new UserInputError('Passwords do not match')
		// 	}
		// 	const errorMessages = checkValidPassword(password)
		// 	if (errorMessages.length) throw new UserInputError(errorMessages)
		// 	const { saltHashed, passwordHashed } = saltHash(password)
		// 	await AdvitoUser.query().patchAndFetchById(id, {
		// 		pwd: passwordHashed,
		// 		userSalt: saltHashed
		// 	})
		// 	await user.$relatedQuery('advitoUserLog').insert({
		// 		advitoUserId: user.id,
		// 		activity: 'User password changed'
		// 	})
		// 	return 'Password has been changed'
		// },
		// deleteUser: async (_, { id }) => {
		// 	const user = await AdvitoUser.query()
		// 		.findById(id)
		// 		.first()
		// 	if (!user) throw new UserInputError('User not found')
		// 	await user
		// 		.$relatedQuery('advitoUserSession')
		// 		.delete()
		// 		.where('advitoUserId', id)
		// 	await user
		// 		.$relatedQuery('advitoUserRoleLink')
		// 		.delete()
		// 		.where('advitoUserId', id)
		// 	await user
		// 		.$relatedQuery('accessToken')
		// 		.delete()
		// 		.where('advitoUserId', id)
		// 	await AdvitoUser.query().deleteById(id)
		// 	return true
		// }
	}
}
