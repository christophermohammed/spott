import * as mediaService from '../service/media';
import * as locationService from '../service/location';
import { UPVOTE, DOWNVOTE, APPROVED, DENIED } from '../common/votes';
import { getUrl } from '../utils/network';

export const vote = async (media, userId, token, vote) => {
    let res = media;
    let downvoters = [];
    let upvoters = [];
    switch (vote) {
        case UPVOTE:
            upvoters = (media.upvoters.includes(userId)) ?
                media.upvoters.filter(id => {
                    return id !== userId;
                }) :
                media.upvoters.concat(userId);
            downvoters = media.downvoters.filter(id => {
                return id !== userId;
            });
            res = await mediaService.updateMedia(media._id, { upvoters, downvoters }, token);
            break;
        case DOWNVOTE:
            downvoters = (media.downvoters.includes(userId)) ?
                media.downvoters.filter(id => {
                    return id !== userId;
                }) :
                media.downvoters.concat(userId);
            upvoters = media.upvoters.filter(id => {
                return id !== userId;
            });
            res = await mediaService.updateMedia(media._id, { downvoters, upvoters }, token);
            break;
        default:
            break;
    }
    return res;
}

export const mediaURL = (id, width) => {
    return getUrl('/api/media/' + id + '/' + width);
}

export const setApproval = async (id, token, approval, locationId) => {
    let res = {};
    switch (approval) {
        case APPROVED:
            await locationService.updateLocation(locationId, { approved: true }, token);
            res = await mediaService.updateMedia(id, { approved: true }, token);
            break;
        case DENIED:
            await mediaService.deleteMedia(id, token);
            break;
        default:
            break;
    }
    return res;
}