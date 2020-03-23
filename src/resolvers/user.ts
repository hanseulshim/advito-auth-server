import { AdvitoUser } from '../models'

export default {
	Query: {
		hello: async (): Promise<string> => {
			const user = await AdvitoUser.query().findById(711)
			console.log(user)
			return 'hello'
		}
	}
}
