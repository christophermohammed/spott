import { errors } from '../common/top-bar-messages';
import * as twilioService from '../service/twilio';
import { isGoodPhoneNumber } from '../utils/validators';

export const sendLocation = async (phoneNumber, selectedLocation) => {
    if (!isGoodPhoneNumber(phoneNumber)) {
        throw new Error(errors.INVALID_PHONE_NUMBER);
    }
    await twilioService.sendLocation(phoneNumber, selectedLocation);
}