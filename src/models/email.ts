import { Model } from 'objection'

export class EmailTemplate extends Model {
	emailSubject: string
	emailBody: string

	static tableName = 'emailTemplate'
}
