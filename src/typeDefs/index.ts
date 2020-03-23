import { gql } from 'apollo-server-lambda'
import user from './user'

export default gql`
	${user}
	type Query {
		_empty: String
	}
	type Mutation {
		_empty: String
	}
`
