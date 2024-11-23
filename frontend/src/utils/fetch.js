import { useAuthStore } from '@/stores/auth'
import isValidAuth from '@/auth/auth'
import router from "@/router/index";


export const postData = async function postData(url, data) {
	if (!await isValidAuth) await router.push({ name: 'Login' })

	const authData = useAuthStore();
	try {
		const response = await fetch(url, {
			method: "POST",
			credentials: "include",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': "*",
				'Authorization': `Bearer ${authData.accessToken}`
			},
			body: JSON.stringify(data)
		});
		return await response.json();
	} catch (error) {
		console.error(error.message);
	}
}

export const getData = async function getData(url) {
	if (!await isValidAuth) await router.push({ name: 'Login' })
		
	const authData = useAuthStore();
	try {
		const response = await fetch(url, {
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': "*",
				'Authorization': `Bearer ${authData.accessToken}`
			}
		});
		return await response.json();
	} catch (error) {
		console.error(error.message);
	}
}
export default { postData, getData }