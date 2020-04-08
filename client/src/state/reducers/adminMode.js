import * as actionTypes from '../actions/actionTypes';

const reducer = (state = false, action) => {
    switch(action.type) {
        case actionTypes.SET_ADMIN_MODE:
            return action.payload;
        default: 
            return state;
    }
};

export default reducer;