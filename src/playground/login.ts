import { getEndpoint } from '../utils'

export default {
	Mutation: {
		name: 'Login Mutations',
		endpoint: getEndpoint(),
		headers: { Authorization: 'MY^PR3TTYP0NY' },
		query: `
    mutation {
      login(username: "hshim@boostlabs.com", password: "") {
        id
        displayName
        clientId
        sessionToken
        roleIds
      }
      logout(sessionToken: "")
    }`
	}
}
