export default `
type User {
  id: Int
  clientId: Int
  username: String
  nameLast: String
  nameFirst: String
  fullName: String
  isEnabled: Boolean
  email: String
  phone: String
  profilePicturePath: String
  defaultTimezone: String
  defaultLanguage: String
  defaultDateFormat: String
  address: String
  roleIds: [Int]
}

extend type Mutation {
  createUser(
    clientId: Int!
    username: String!
    nameFirst: String!
    nameLast: String!
    password: String!
    confirmPassword: String!
    roleIds: [Int]!
  ): User @auth
  
  updateUser(
    id: Int!
    username: String
    nameFirst: String
    nameLast: String
    isEnabled: Boolean
    phone: String
    address: String
    defaultTimezone: String
    defaultLanguage: String
    defaultDateFormat: String
    roleIds: [Int]
  ): User @auth
}
`
// updateUserPassword(
//   id: Int!
//   password: String!
//   confirmPassword: String!
// ): String @auth
// deleteUser(
//   id: Int!
// ): Boolean @auth
