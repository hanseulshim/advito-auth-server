import 'source-map-support/register'
import { ApolloServer, ForbiddenError } from 'apollo-server-lambda'
import typeDefs from './src/typeDefs'
import resolvers from './src/resolvers'
import playground from './src/playground'
import Knex from 'knex'
import { Context } from './src/types'
import { Model, knexSnakeCaseMappers } from 'objection'
import { authenticateUser } from './src/utils'

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
	playground,
	context: async ({ event }): Promise<Context> => {
		const sessionToken = event.headers.Authorization || ''
		const applicationId = +event.headers.application || null
		if (applicationId === null) {
			throw new ForbiddenError('Application id must be passed in')
		}
		const user = await authenticateUser(sessionToken)
		return { user, applicationId }
	}
})

export const graphqlHandler = server.createHandler({
	cors: {
		origin: true,
		credentials: true
	}
})
