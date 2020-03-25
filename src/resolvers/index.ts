import merge from 'lodash.merge'
import login from './login'
import password from './password'

export default {
	...merge(login, password)
}
