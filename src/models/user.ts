import { Model, ModifyMethod, AnyQueryBuilder } from 'objection'

export class AdvitoUserRoleLink extends Model {
	advitoRoleId: number

	static tableName = 'advitoUserRoleLink'

	static modifiers = {
		advitoRoleId(builder): ModifyMethod<AnyQueryBuilder> {
			return builder.select('advitoRoleId')
		}
	}
}

export class AdvitoUserSession extends Model {
	id: number
	sessionEnd: string
	sessionToken: string
	sessionStart: string
	sessionDurationSec: number
	sessionType: string
	sessionExpiration: string
	sessionNote: string
	created: string
	modified: string
	advitoUser: AdvitoUser[]
	advitoUserId: number

	static tableName = 'advitoUserSession'

	static modifiers = {
		sessionToken(builder): ModifyMethod<AnyQueryBuilder> {
			return builder
				.where('sessionEnd', null)
				.first()
				.select('sessionToken')
		}
	}
}

export class AccessToken extends Model {
	isActive: boolean
	tokenType: string
	token: string
	tokenExpiration: string
	advitoUserId: number

	static tableName = 'accessToken'
}

export class AdvitoUser extends Model {
	id: number
	isEnabled: string
	pwd: string
	userSalt: string
	nameFirst: string
	nameLast: string
	clientId: number
	email: string
	advitoUserSession: AdvitoUserSession[]
	advitoUserRoleLink: AdvitoUserRoleLink[]
	accessToken: AccessToken[]

	static tableName = 'advitoUser'

	fullName(): string {
		return this.nameFirst + ' ' + this.nameLast
	}

	static modifiers = {
		getUser(builder): ModifyMethod<AnyQueryBuilder> {
			return builder.first()
		}
	}

	static relationMappings = {
		advitoUserRoleLink: {
			relation: Model.HasManyRelation,
			modelClass: AdvitoUserRoleLink,
			join: {
				from: 'advitoUser.id',
				to: 'advitoUserRoleLink.advitoUserId'
			}
		},
		advitoUserSession: {
			relation: Model.HasManyRelation,
			modelClass: AdvitoUserSession,
			join: {
				from: 'advitoUser.id',
				to: 'advitoUserSession.advitoUserId'
			}
		},
		accessToken: {
			relation: Model.HasManyRelation,
			modelClass: AccessToken,
			join: {
				from: 'advitoUser.id',
				to: 'accessToken.advitoUserId'
			}
		}
	}
}
