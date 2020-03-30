import { gql } from 'apollo-server-lambda'
import login from './login'
import password from './password'
import user from './user'

export default gql`
	directive @auth on FIELD_DEFINITION
	${login}
	${password}
	${user}
	type Query {
		_empty: String
	}
	type Mutation {
		_empty: String
	}
`
