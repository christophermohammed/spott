import { makeRequest } from '../utils/network';
import { POST } from '../common/network';
import { errors } from '../common/top-bar-messages';

export const sendLocation = async (phoneNumber, selectedLocation) => {
    const url = '/api/messages';
    await makeRequest(
        POST,
        url,
        errors.SEND_MESSAGE,
        { phoneNumber, selectedLocation }
    );
}
