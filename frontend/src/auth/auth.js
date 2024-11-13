import { useAuthStore } from '@/stores/auth'
import urlList from "@/config/urlList"
import utils from "@/utils/fetch";
import { jwtDecode } from "jwt-decode";


// Check whether everything is correct in order to access protected resources
export async function isValidAuth() {
    const authData = useAuthStore();

    if (!authData.authenticated) {
        // request for new access token using refresh
        const response = await utils.getData(urlList.BACKEND_REFRESH_AUTH)

        // set new auth data and return true as the user is authenticated 
        if (response.code == 200) {
            authData.authenticated = true;
            authData.accessToken = response.accessToken;
            return true;
        }
        else {
            // The user is not authenticated and must go to login page
            authData.authenticated = false;
            authData.accessToken = "";
            return false;
        }
    }
    else {
        // No auth token 
        if (authData.accessToken.length <= 0) {
            // The user is not authenticated and must go to login page
            authData.authenticated = false;
            authData.accessToken = "";
            return false;
        }

        // The user claims to be authenticated. We check the validity of the access token.
        const decodedJWT = jwtDecode(authData.accessToken);
        const expiration = decodedJWT.exp;
        const currentTimestamp = new Date().getTime() / 1000;

        // Check if it's still valid
        // We substract 10 seconds from the expiry date as a leeway
        if (currentTimestamp >= (expiration - 10)) {
            // Token is expired, we need to get a new one.
            const response = await utils.getData(urlList.BACKEND_REFRESH_AUTH)

            // set new auth data and return true as the user is authenticated 
            if (response.code == 200) {
                authData.authenticated = true;
                authData.accessToken = response.accessToken;
                return true;
            }
            else {
                // The user is not authenticated and must go to login page
                authData.authenticated = false;
                authData.accessToken = "";
                return false;
            }
        }
        else {
            // the token is valid so the user is authenticated
            const response = await utils.getData(urlList.BACKEND_REFRESH_AUTH)

            // set new auth data and return true as the user is authenticated 
            if (response.code == 200) {
                authData.authenticated = true;
                authData.accessToken = response.accessToken;
                return true;
            }
            else {
                // The user is not authenticated and must go to login page
                return true;
            }
        }
    }
}


export default { isValidAuth }