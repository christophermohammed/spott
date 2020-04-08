import * as actionTypes from '../actions/actionTypes';
import { DOWNVOTE_RED } from '../../common/colors';

const defaultState = {
    color: DOWNVOTE_RED,
    message: ""
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.SET_BANNER:
            if (action.payload.message && action.payload.message === "") {
                return defaultState;
            }
            return { ...state, ...action.payload };

        default:
            return state;
    }
};

export default reducer;