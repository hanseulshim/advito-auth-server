import crypto from 'crypto'

export const saltPassword = (
	password: string,
	userSalt?: string
): { salt: string; hashedPassword: string } => {
	const salt = userSalt || crypto.randomBytes(16).toString('base64')
	const hashedPassword = crypto
		.createHash('sha256')
		.update(password)
		// @ts-ignore:disable-next-line
		.update(salt, 'base64')
		.digest('base64')
	return {
		salt,
		hashedPassword
	}
}

export const checkValidPassword = (password: string): string[] => {
	const errorMessages = []
	if (password.length < 8) {
		errorMessages.push('Password must be at least 8 characters long.')
	}
	if (!/\d/g.test(password)) {
		errorMessages.push('Password must have at least one number.')
	}
	if (!/[a-z]/g.test(password)) {
		errorMessages.push('Password must have at least one lowercase letter.')
	}
	if (!/[A-Z]/g.test(password)) {
		errorMessages.push('Password must have at least one uppercase letter.')
	}
	// if (!/\.|\,|\?|\/|!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\+|\=|\||\~/g.test(password)) errorMessages.push('Password must have at least one special character.') // eslint-disable-line
	if (/\s/g.test(password)) {
		errorMessages.push('Password cannot have spaces or other whitespace.')
	}
	return errorMessages
}
