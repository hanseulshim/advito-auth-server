import { ApolloServer, ForbiddenError } from 'apollo-server-lambda'
import Knex from 'knex'
import { knexSnakeCaseMappers, Model } from 'objection'
import 'source-map-support/register'
import RequireAuthDirective from './src/authDirective'
import playground from './src/playground'
import resolvers from './src/resolvers'
import typeDefs from './src/typeDefs'
import { Context } from './src/types'

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
		const applicationId = +event.headers.application || null
		if (applicationId === null) {
			throw new ForbiddenError('Application id must be passed in')
		}
		return { applicationId }
	},
	schemaDirectives: {
		auth: RequireAuthDirective
	}
})

export const graphqlHandler = server.createHandler({
	cors: {
		origin: true,
		credentials: true
	}
})
