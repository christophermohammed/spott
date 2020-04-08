import * as actionTypes from '../actions/actionTypes';

const reducer = (state = {selectedLocation: {}, data: [], position: {}}, action) => {
    switch(action.type) {
        case actionTypes.SET_LOCATIONS:
            return {...state, data: action.payload};
        case actionTypes.SET_SELECTED_LOCATION: 
            return {...state, selectedLocation: action.payload};
        case actionTypes.SET_POSITION: 
            return {...state, position: action.payload};
        default: 
            return state;
    }
};

export default reducer;