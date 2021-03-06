/**
 * Here All Axios Related Work
 */

import { config } from '../config'
import { store } from '../store'

import axios from 'axios'
axios.defaults.baseURL = config.apiBaseUrl

let requestsCount = 0;

// Axios Requests Interceptor
axios.interceptors.request.use(config => {
	requestsCount++;
	store.commit('appStatus/setLoading', true)
	return config;
}, error => {
	console.log('Request Error');
	return Promise.reject(error)
})

// Axios Response Interceptor
axios.interceptors.response.use(response => {
	requestsCount--;
	if (!requestsCount) {
		store.commit('appStatus/setLoading', false)
	}
	return response;
}, error => {
	if (error.response) {
		switch (error.response.status) {
			case 488:
				Vue.prototype.$notify({
					type: 'error',
					title: 'Validation Error',
					text: error.response.data.message,
					group: 'axios'
				})
				break;
			default:
				Vue.prototype.$notify({
					type: 'error',
					title: error.response.status,
					text: error.message,
					group: 'axios'
				})
		}
	} else if (error.request) {
		Vue.prototype.$notify({
			type: 'error',
			title: 'Connection',
			text: 'Connection Error!',
			group: 'axios'
		})
	}

	requestsCount--;
	if (!requestsCount) {
		store.commit('appStatus/setLoading', false)
	}
	
	return Promise.reject(error)
})