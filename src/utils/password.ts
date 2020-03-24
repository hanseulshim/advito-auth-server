import crypto from 'crypto'

export const saltPassword = (
	password: string,
	userSalt: string | null
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
