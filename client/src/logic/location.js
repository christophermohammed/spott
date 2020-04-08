import { isEmpty } from '../utils/validators';
import * as messages from '../common/top-bar-messages';

export const checkLocation = (position) => {
    const { lat, lng, name, description } = position;
    if (!lat || !lng) {
        throw new Error(messages.errors.POSITION_MISSING);
    }
    if (isEmpty(name) || isEmpty(description)) {
        throw new Error(messages.errors.INVALID_LOCATION_NAME_OR_DESCRIPTION);
    }
    if (description.length < 100) {
        throw new Error(messages.errors.SHORT_DESCRIPTION);
    }
}

export const isSamePosition = (a, b) => {
    return (a.lat === b.lat) && (a.lng === b.lng);
}