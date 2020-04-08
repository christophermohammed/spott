import axios from 'axios';
import { GET, POST, PATCH, DELETE, DEV_URL } from '../common/network';
import bcrypt from 'bcryptjs';

export const makeRequest = async (method, urlExt, errorMessage, data, token) => {
    var response = { data: {} };
    const url = getUrl(urlExt);
    // hash secret
    const { REACT_APP_SPOTT_APP_SECRET } = process.env;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(REACT_APP_SPOTT_APP_SECRET, salt);
    // build options
    const options = {
        headers: {
            Authorization: "Bearer " + token,
            Hash: hash
        }
    };

    try {
        switch (method) {
            case POST:
                response = await axios.post(url, data, options);
                break;
            case GET:
                response = await axios.get(url, options);
                break;
            case PATCH:
                response = await axios.patch(url, data, options);
                break;
            case DELETE:
                response = await axios.delete(url, options);
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
    const { REACT_APP_SPOTT_URL_PROD, NODE_ENV } = process.env;
    var baseUrl = (NODE_ENV === 'production') ? REACT_APP_SPOTT_URL_PROD : DEV_URL;
    return baseUrl + urlExt;
}