import { makeRequest } from '../utils/network';
import { POST, PATCH, DELETE } from '../common/network';
import { errors } from '../common/top-bar-messages';

export const setMedia = async (file, locationId, token) => {
    const url = '/api/media';

    const fd = new FormData();
    fd.append('media', file, file.name);
    fd.append('location', locationId);
    fd.append('approved', false);

    await makeRequest(
        POST,
        url,
        errors.SET_MEDIA,
        fd,
        token
    );
}

export const updateMedia = async (id, updates, token) => {
    const url = '/api/media/' + id;
    const data = await makeRequest(
        PATCH,
        url,
        errors.UPDATE_MEDIA,
        updates,
        token
    );
    return data;
}

export const deleteMedia = async (id, token) => {
    const url = '/api/media/' + id;
    await makeRequest(
        DELETE,
        url,
        errors.DELETE_MEDIA,
        null,
        token
    );
}