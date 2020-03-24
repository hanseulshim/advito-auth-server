import moment from 'moment'

export const getDateString = (type?: string): string => {
	if (!type) return moment().format()
	const expirationDate = moment()
	if (type === 'session') {
		expirationDate.set('hour', expirationDate.hour() + 1)
	} else if (type === 'recovery') {
		expirationDate.set('hour', expirationDate.hour() + 24)
	}
	return expirationDate.format()
}
