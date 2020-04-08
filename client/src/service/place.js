import { makeRequest } from '../utils/network';
import { GET } from '../common/network';
import { errors } from '../common/top-bar-messages';

export const searchForPlace = async (query) => {
    const formattedQuery = query.trim().replace(/ /g, '+');
    const url = '/api/places?query=' + formattedQuery;
    const data = await makeRequest(
        GET,
        url,
        errors.MISSING_PLACE_DATA
    );
    return data;
}
