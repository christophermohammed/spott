import { makeRequest } from '../utils/network';
import { GET, POST, PATCH, DELETE } from '../common/network';
import { errors } from '../common/top-bar-messages';

export const setLocation = async (position, token) => {
    const url = '/api/locations';
    const { lat, lng, name, description } = position;
    const data = await makeRequest(
        POST,
        url,
        errors.SET_LOCATION,
        { lat, lng, name, description, approved: false },
        token
    );
    return data;
}

export const getQueriedLocations = async (query) => {
    const url = '/api/locations?query=' + query;
    const data = await makeRequest(
        GET,
        url,
        errors.GET_LOCATIONS
    );
    return data;
}

export const getLocations = async () => {
    const url = '/api/locations';
    const data = await makeRequest(
        GET,
        url,
        errors.GET_LOCATIONS
    );
    return data;
}

export const getAdminLocations = async (countryCode) => {
    const url = '/api/locations/admin?countryCode=' + countryCode;
    const data = await makeRequest(
        GET,
        url,
        errors.GET_LOCATIONS
    );
    return data;
}

export const getMediaForLocation = async (id, limit, skip, filter, isAdmin) => {
    const url =
        '/api/locations/' + id +
        '?limit=' + limit +
        '&skip=' + skip +
        '&sortBy=' + filter + ':desc' +
        '&isAdmin=' + isAdmin;
    const data = await makeRequest(
        GET,
        url,
        errors.GET_MEDIA_FOR_LOCATION
    );
    return data;
}

export const updateLocation = async (id, updates, token) => {
    const url = '/api/locations/' + id;
    const data = await makeRequest(
        PATCH,
        url,
        errors.UPDATE_LOCATION,
        updates,
        token
    );
    return data;
}

export const deleteLocation = async (id, token) => {
    const url = '/api/locations/' + id;
    const data = await makeRequest(
        DELETE,
        url,
        errors.DELETE_LOCATION,
        null,
        token
    );
    return data;
}