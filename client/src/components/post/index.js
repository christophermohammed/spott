import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdArrowDownward, MdArrowUpward, MdPhotoCamera, MdThumbUp, MdThumbDown } from 'react-icons/md';
import * as actionTypes from '../../state/actions/actionTypes';
import { isSamePosition } from '../../logic/location';
import { CircularProgress } from '@material-ui/core';
import * as mediaLogic from '../../logic/media';
import { errors } from '../../common/top-bar-messages';
import { UPVOTE, DOWNVOTE, APPROVED, DENIED } from "../../common/votes";
import { MAIN_DARK, DOWNVOTE_RED, UPVOTE_GREEN } from "../../common/colors";
import './post.css';

function Post({ initialMedia, screenWidth }) {
    const user = useSelector(state => state.user);
    const adminMode = useSelector(state => state.adminMode);
    const token = useSelector(state => state.token);
    const { position } = useSelector(state => state.location);
    const [media, setMedia] = useState(initialMedia);
    const [approved, setApproved] = useState("");
    const dispatch = useDispatch();

    const width = parseInt(((screenWidth / 2) * 0.9) - 30);
    const iconStyle = {
        height: 30,
        width: 30,
    }

    const placeVote = async (vote) => {
        try {
            if (!user._id) throw new Error(errors.VOTE_MISSING_AUTH);
            let updatedMedia = await mediaLogic.vote(media, user._id, token, vote);
            if (updatedMedia) {
                setMedia(updatedMedia);
            }
        } catch (error) {
            const color = error.message === errors.VOTE_MISSING_AUTH ? MAIN_DARK : DOWNVOTE_RED;
            dispatch({ type: actionTypes.SET_BANNER, payload: { message: error.message, color } });
        }
    }

    const sendApproval = async (approval) => {
        try {
            await mediaLogic.setApproval(media._id, token, approval, media.location);
            dispatch({ type: actionTypes.SET_POSITION, payload: {} })
            setApproved(approval);
        } catch (error) {
            dispatch({ type: actionTypes.SET_BANNER, payload: { message: error.message, color: DOWNVOTE_RED } });
        }
    }

    const voteCount = media.upvoters.length - media.downvoters.length;
    var voteCountColor = MAIN_DARK;
    if (voteCount !== 0) {
        voteCountColor = (voteCount > 0) ? UPVOTE_GREEN : DOWNVOTE_RED;
    }
    return (
        <div className="post">
            <div className="upper">
                <div className="vote-buttons">
                    <div className="upvote" onClick={() => placeVote(UPVOTE)}>
                        <MdArrowUpward
                            style={{
                                ...iconStyle,
                                color: (media.upvoters && media.upvoters.includes(user._id)) ?
                                    UPVOTE_GREEN :
                                    MAIN_DARK
                            }}
                        />
                    </div>
                    <div className="vote-count" style={{ color: voteCountColor }}>
                        {voteCount}
                    </div>
                    <div className="downvote" onClick={() => placeVote(DOWNVOTE)}>
                        <MdArrowDownward
                            style={{
                                ...iconStyle,
                                color: (media.downvoters && media.downvoters.includes(user._id)) ?
                                    DOWNVOTE_RED :
                                    MAIN_DARK
                            }}
                        />
                    </div>
                </div>
                <div className="media-parent">
                    <div className="loading-container" style={{ width, height: 300 }}>
                        <CircularProgress />
                    </div>
                    <div className="media">
                        <img src={mediaLogic.mediaURL(media._id, width)} alt="" />
                    </div>
                </div>
            </div>
            <div className="lower">
                <div className="creator">
                    <MdPhotoCamera style={{ width: 18, height: 18, paddingTop: 3, paddingRight: 5 }} />
                    <span>: {`${media.owner.firstName} ${media.owner.lastName}`}</span>
                </div>
                {adminMode && !media.approved && (
                    <div className="approval">
                        {(approved === "" || approved === DENIED) && (
                            <div className="deny-container">
                                <MdThumbDown
                                    onClick={() => sendApproval(DENIED)}
                                    style={{ width: 30, height: 30, color: DOWNVOTE_RED, cursor: "pointer" }}
                                />
                            </div>
                        )}
                        {(approved === "" || approved === APPROVED) && (
                            <div className="approve-container">
                                <MdThumbUp
                                    onClick={() => sendApproval(APPROVED)}
                                    style={{ width: 30, height: 30, color: UPVOTE_GREEN, cursor: "pointer" }}
                                />
                            </div>
                        )}
                    </div>
                )}
                {adminMode && (!isSamePosition(media.location, position) && approved === "") && (
                    <button
                        className="see-on-map"
                        onClick={() => dispatch({ type: actionTypes.SET_POSITION, payload: media.location })}
                    >
                        See on Map
                    </button>
                )}
            </div>
        </div>
    );
}

export default Post;
