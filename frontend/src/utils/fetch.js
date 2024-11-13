import { useAuthStore } from '@/stores/auth'
import router from "@/router/index";

export const postData = async function postData(url, data) {
	try {
		const response = await fetch(url, {
			method: "POST",
			credentials: "include",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': "*"
			},
			body: JSON.stringify(data)
		});
		return await response.json();
	} catch (error) {
		console.error(error.message);
	}
}

export const getData = async function getData(url) {
	try {
		const response = await fetch(url, {
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': "*"
			}
		});
		return await response.json();
	} catch (error) {
		console.error(error.message);
	}
}
export default { postData, getData }