import * as messages from '../common/top-bar-messages';
import * as userService from '../service/user';
import ls from 'local-storage';
import { isValidEmail, isGoodPassword, isGoodPhoneNumber, isEmpty } from '../utils/validators';

export const login = async (email, password) => {
    if (!isValidEmail(email)) {
        throw new Error(messages.errors.INVALID_EMAIL);
    }
    if (!isGoodPassword(password)) {
        throw new Error(messages.errors.INVALID_PASSWORD);
    }
    return await userService.loginUser(email, password);
}

export const signUp = async (firstName, lastName, email, password, cpassword, favouritePlace) => {
    if (password !== cpassword) {
        throw new Error(messages.errors.PASSWORD_MISMATCH);
    }
    if (!isValidEmail(email)) {
        throw new Error(messages.errors.INVALID_EMAIL);
    }
    if (!isGoodPassword(password)) {
        throw new Error(messages.errors.INVALID_PASSWORD);
    }
    if (isEmpty(firstName) || isEmpty(lastName)) {
        throw new Error(messages.errors.INVALID_USER_NAME);
    }
    if (!favouritePlace) {
        throw new Error(messages.errors.MISSING_FAVOURITE_PLACE);
    }
    return await userService.createUser({ firstName, lastName, email, password, favouritePlace });
}

export const logout = async (token) => {
    await userService.logoutUser(token);
}

export const logoutAll = async (token) => {
    await userService.logoutAllUserSessions(token);
}

export const savePhoneNumber = async (phoneNumber, token) => {
    if (!isGoodPhoneNumber(phoneNumber)) {
        throw new Error(messages.errors.INVALID_PHONE_NUMBER);
    }
    const data = await userService.updateUser({ phoneNumber }, token);
    ls.set('user', data);
    return data;
}

export const updateUserFromSettings = async (firstName, lastName, favouritePlace, token) => {
    if (isEmpty(firstName) || isEmpty(lastName)) {
        throw new Error(messages.errors.INVALID_USER_NAME);
    }
    if (!favouritePlace) {
        throw new Error(messages.errors.MISSING_FAVOURITE_PLACE);
    }
    console.log({ firstName, lastName, favouritePlace, token });
    return await userService.updateUser({ firstName, lastName, favouritePlace }, token);
}