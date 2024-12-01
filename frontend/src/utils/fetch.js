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

export const uploadImage = async function uploadImage(url, data) {
	if (!data) return
	const blob = dataURItoBlob(data)
	try {
		return await fetch(url, {
			method: "PUT",
			headers: {
				'ContentType': 'image/jpeg',
				'Access-Control-Allow-Origin': "*",
				'Access-Control-Allow-Methods': "PUT",
				'Access-Control-Allow-Headers': "Origin, ContentEncoding, ContentType"
			},
			body: blob
		});
	} catch (error) {
		console.error(error.message);
	}

	function dataURItoBlob(dataURI) {
		var binary = atob(dataURI.split(',')[1]);
		var array = [];
		for(var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
	}
}

export default { postData, getData, uploadImage }