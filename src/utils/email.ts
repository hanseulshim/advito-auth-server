import AWS from 'aws-sdk'
const ses = new AWS.SES({
	accessKeyId: process.env.ACCESS_KEY_ID,
	secretAccessKey: process.env.SECRET_ACCESS_KEY,
	region: process.env.REGION
})
import { EmailTemplate } from '../models'

const getUrlPath = (applicationId: number): string => {
	if (applicationId === 4) return 'advito-ingestion'
	else if (applicationId === 5) return 'advito-case-lodgic'
	return null
}

export const getUrl = (applicationId: number, token: string): string => {
	const urlPath = getUrlPath(applicationId)
	const environment = process.env.ENVIRONMENT
	const resetPath = `index.html#/resetpassword?t=${token}`
	if (applicationId === 4) {
		if (environment === 'DEV') {
			return `https://s3.amazonaws.com/alpha.boostlabs/${urlPath}/${resetPath}`
		} else if (environment === 'STAGING') {
			return `https://s3.amazonaws.com/beta.boostlabs/${urlPath}/${resetPath}`
		} else if (environment === 'PRODUCTION') {
			return `https://ingestion-console.advito.com/${resetPath}`
		} else if (environment === 'LOCAL') {
			return `http://localhost:3000/#/resetpassword?t=${token}`
		}
	} else if (environment === 'DEV') {
		return `https://s3.amazonaws.com/dev.boostlabs/${urlPath}/${resetPath}`
	} else if (environment === 'STAGING') {
		return `https://s3.amazonaws.com/staging.boostlabs/${urlPath}/${resetPath}`
	} else if (environment === 'PRODUCTION') {
		return `https://s3.amazonaws.com/${urlPath}/${resetPath}`
	} else if (environment === 'LOCAL') {
		return `http://localhost:3000/#/resetpassword?t=${token}`
	}
	return null
}

export const sendEmail = async (
	name: string,
	email: string,
	applicationId: number,
	token: string
): Promise<void> => {
	const emailTemplate = await EmailTemplate.query()
		.where('templateName', 'Password Recovery')
		.where('advitoApplicationId', applicationId)
		.first()
	let message = emailTemplate.emailBody
	message = message.replace('[[NAMEFIRST]]', name)
	message = message.replace('[[URL]]', getUrl(applicationId, token))
	const params = {
		Source: 'IandA@advito.com',
		Destination: {
			ToAddresses: [email],
			BccAddresses: ['ianda@advito.com', 'hshim@boostlabs.com']
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: message
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: emailTemplate.emailSubject
			}
		}
	}

	await ses.sendEmail(params).promise()
}
