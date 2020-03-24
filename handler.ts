import 'source-map-support/register'
import { ApolloServer } from 'apollo-server-lambda'
import typeDefs from './src/typeDefs'
import resolvers from './src/resolvers'
import playground from './src/playground'
import Knex from 'knex'
import { Model, knexSnakeCaseMappers } from 'objection'

Model.knex(
	Knex({
		client: 'pg',
		connection: {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME
		},
		...knexSnakeCaseMappers()
	})
)

const server = new ApolloServer({
	typeDefs,
	resolvers,
	playground
	// context: async ({ event }): Promise<any> => {
	// 	const sessionToken = event.headers.Authorization || ''
	// 	const application = event.headers.application || ''
	// 	const user = await authenticateUser(sessionToken)
	// 	return { user, application }
	// }
})

export const graphqlHandler = server.createHandler()
