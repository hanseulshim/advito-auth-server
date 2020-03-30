export type User = {
	id: number
	displayName: string
	clientId: number
	sessionToken: string
	roleIds: number[]
}

export type AdvitoUserType = {
	id: number
	isEnabled: boolean
	pwd: string
	userSalt: string
	nameFirst: string
	nameLast: string
	clientId: number
	email: string
	username: string
	isVerified: boolean
	mustChangePwd: boolean
	defaultTimezone: string
	defaultLanguage: string
	roleIds: number[]
}
