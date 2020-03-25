import { gql } from 'apollo-server-lambda'
import login from './login'
import password from './password'

export default gql`
	${login}
	${password}
	type Query {
		_empty: String
	}
	type Mutation {
		_empty: String
	}
`
