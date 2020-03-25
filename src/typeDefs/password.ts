export default `
extend type Mutation {
  sendResetPasswordEmail(email: String!): String
  resetPassword(token: String!, password: String!, confirmPassword: String!): Boolean
}
`
