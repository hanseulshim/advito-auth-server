export const getEndpoint = (): string => {
	return process.env.ENVIRONMENT === 'DEV'
		? 'https://mv3ohvxam8.execute-api.us-east-2.amazonaws.com/dev/graphql'
		: process.env.ENVIRONMENT === 'STAGING'
		? 'https://sewnh0p54a.execute-api.us-east-2.amazonaws.com/staging/graphql'
		: process.env.ENVIRONMENT === 'PRODUCTION'
		? 'https://lkkkz4lxwc.execute-api.us-east-2.amazonaws.com/production/graphql'
		: 'http://localhost:4000/local/graphql'
}
