import { SchemaDirectiveVisitor, ApolloError } from 'apollo-server-lambda'
import { defaultFieldResolver, GraphQLField } from 'graphql'

export default class RequireAuthDirective extends SchemaDirectiveVisitor {
	// eslint-disable-next-line
	visitFieldDefinition(field: GraphQLField<any, any>) {
		const { resolve = defaultFieldResolver } = field
		// eslint-disable-next-line
		field.resolve = async (...args) => {
			const [, , context] = args
			if (context.user) {
				if (context.user.roleIds.length === 0) {
					throw new ApolloError('User did not have any roles', '401')
				}
				return resolve.apply(this, args)
			} else {
				throw new ApolloError(
					'You must be signed in to view this resource.',
					'401'
				)
			}
		}
	}
}
