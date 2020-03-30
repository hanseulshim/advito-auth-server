import merge from 'lodash.merge'
import login from './login'
import password from './password'
import user from './user'

export default {
	...merge(login, password, user)
}
