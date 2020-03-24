export default {
	Mutation: {
		name: 'Login Mutations',
		endpoint: '',
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
