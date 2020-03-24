export default {
	Mutation: {
		name: 'Login Mutations',
		endpoint: '',
		headers: { sessiontoken: 'MY^PR3TTYP0NY' },
		query: `
    mutation {
      login(username: "hshim@boostlabs.com", password: "") {
        id
        displayName
        clientId
        sessionToken
        roleIds
      }
    }`
	}
}
