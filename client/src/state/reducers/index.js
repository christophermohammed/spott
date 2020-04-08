import {combineReducers} from 'redux';

import userReducer from './user';
import tokenReducer from './token';
import locationReducer from './location';
import mediaReducer from './media';
import bannerReducer from './banner';
import adminModeReducer from './adminMode';

const rootReducer = combineReducers({
    user: userReducer,
    token: tokenReducer,
    location: locationReducer,
    media: mediaReducer,
    banner: bannerReducer,
    adminMode: adminModeReducer
});

export default rootReducer;