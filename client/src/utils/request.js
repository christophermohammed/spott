import axios from 'axios';
import { GET, POST, PATCH, DELETE, DEV_URL } from 'common/network';

export const makeRequest = async (method, urlExt, errorMessage, data) => {
    var response = { data: {} };
    const url = getUrl(urlExt);

    try {
        switch (method) {
            case POST:
                response = await axios.post(url, data);
                break;
            case GET:
                response = await axios.get(url);
                break;
            case PATCH:
                response = await axios.patch(url, data);
                break;
            case DELETE:
                response = await axios.delete(url);
                break;
            default:
                break;
        }
        return response.data;
    } catch (error) {
        throw new Error(errorMessage);
    }
}

export const getUrl = (urlExt) => {
    const { NODE_ENV, REACT_APP_PROD_URL } = process.env;
    const baseUrl = (NODE_ENV === 'production') ? REACT_APP_PROD_URL : DEV_URL;
    return baseUrl + urlExt;
}