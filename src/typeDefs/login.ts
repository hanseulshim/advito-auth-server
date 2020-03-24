export default `
type Login {
  id: Int
  displayName: String
  clientId: Int
  sessionToken: String
  roleIds: [Int]
}

extend type Mutation {
  login(username: String!, password: String!): Login
  logout(sessionToken: String!): Boolean
}
`
