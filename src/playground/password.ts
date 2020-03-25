import { getEndpoint } from '../utils'

export default {
	Mutation: {
		name: 'Password Mutations',
		endpoint: getEndpoint(),
		headers: { Authorization: 'MY^PR3TTYP0NY', application: 4 },
		query: `
    mutation {
			sendResetPasswordEmail(email: "")
			resetPassword(token: "", password: "", confirmPassword: "")
    }`
	}
}
