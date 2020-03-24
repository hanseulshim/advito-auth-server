import { SchemaDirectiveVisitor, ApolloError } from 'apollo-server-lambda'
import { defaultFieldResolver, GraphQLField } from 'graphql'

export class RequireAuthDirective extends SchemaDirectiveVisitor {
	// eslint-disable-next-line
	visitFieldDefinition(field: GraphQLField<any, any>) {
		const { resolve = defaultFieldResolver } = field
		// eslint-disable-next-line
		field.resolve = async (...args) => {
			const [, , context] = args
			if (context.user) {
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

// export default class RequireAuthDirective extends SchemaDirectiveVisitor {
// 	visitFieldDefinition(field) {
// 		const { resolve = this.defaultFieldResolver } = field
// 		field.resolve = async (...args) => {
// 			const [, , context] = args
// 			if (context.user) {
// 				// const roleIds = context.user.roleIds.map(role => parseInt(role))
// 				// const idExists = IA_ROLES.some(role => roleIds.indexOf(role) >= 0)
// 				// if (!idExists) { throw new ApolloError('User did not have I&A role', 401) }
// 				return resolve.apply(this, args)
// 			} else {
// 				throw new ApolloError(
// 					'You must be signed in to view this resource.',
// 					'401'
// 				)
// 			}
// 		}
// 	}
// }
