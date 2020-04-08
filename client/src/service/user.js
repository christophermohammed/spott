import { makeRequest } from '../utils/network';
import { POST, PATCH } from '../common/network';
import { errors } from '../common/top-bar-messages';

export const createUser = async (user) => {
    const url = '/api/users';
    const data = await makeRequest(
        POST,
        url,
        errors.CREATE_USER,
        user
    );
    return data;
}

export const loginUser = async (email, password) => {
    const url = '/api/users/login';
    const data = await makeRequest(
        POST,
        url,
        errors.LOGIN,
        { email, password }
    );
    return data;
}

export const logoutUser = async (token) => {
    const url = '/api/users/logout';
    await makeRequest(
        POST,
        url,
        errors.LOGOUT,
        null,
        token
    );
}

export const logoutAllUserSessions = async (token) => {
    const url = '/api/users/logoutAll';
    await makeRequest(
        POST,
        url,
        errors.LOGOUT_ALL,
        null,
        token
    );
}

export const updateUser = async (updates, token) => {
    const url = '/api/users/me';
    const data = await makeRequest(
        PATCH,
        url,
        errors.UPDATE_USER,
        updates,
        token
    );
    return data;
}