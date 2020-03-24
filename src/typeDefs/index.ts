import { gql } from 'apollo-server-lambda'
import login from './login'

export default gql`
	${login}
	type Query {
		_empty: String
	}
	type Mutation {
		_empty: String
	}
`
