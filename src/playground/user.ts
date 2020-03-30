import { getEndpoint } from '../utils'

export default {
	Mutation: {
		name: 'User Mutations',
		endpoint: getEndpoint(),
		headers: { Authorization: 'MY^PR3TTYP0NY', application: 4 },
		query: `
    mutation {
			# createUser(
      #   clientId: 1
      #   username: "user@boostlabs.com"
      #   nameFirst: "first"
      #   nameLast: "last"
      #   password: "Password1"
      #   confirmPassword: "Password1"
      #   roleIds: [4]
      # ) {
      #   id
      #   username
      #   nameFirst
      #   nameLast
      #   roleIds
      # }
			# updateUser(
      #   id: null
      #   username: null
      #   nameFirst: null
      #   nameLast: null
      #   isEnabled: null
      #   phone: null
      #   address: null
      #   defaultTimezone: null
      #   defaultLanguage: null
      #   defaultDateFormat: null
      #   roleIds: []
      # ) {
      #   id
      #   username
      #   nameFirst
      #   nameLast
      #   isEnabled
      #   phone
      #   address
      #   defaultTimezone
      #   defaultLanguage
      #   defaultDateFormat
      #   roleIds
      # }
      # updateUserPassword(
      #   id: null
      #   password: ""
      #   confirmPassword: ""
      # )
      # deleteUser(id: null)
    }`
	}
}
