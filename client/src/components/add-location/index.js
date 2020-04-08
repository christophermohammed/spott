import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actionTypes from '../../state/actions/actionTypes';
import { withRouter } from 'react-router-dom';
import { ROOT, ADD_LOCATION, ADD_PHOTO } from '../../common/paths';
import { DOWNVOTE_RED } from "../../common/colors";
import { isEmpty } from '../../utils/validators';
import { checkLocation } from '../../logic/location';
import TopBar from '../top-bar';
import './add-location.css';

function AddLocation({ history, setIsRoot }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const user = useSelector(state => state.user);
    const position = useSelector(state => state.location.position);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: actionTypes.SET_POSITION, payload: { canBeModified: true } });
        if (!user.email) {
            history.push(ROOT);
        }

        setIsRoot(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createLocation = () => {
        try {
            position.name = name;
            position.description = description;
            checkLocation(position);
            dispatch({ type: actionTypes.SET_POSITION, payload: { ...position, name, description } });
            history.push(ADD_PHOTO);
        } catch (error) {
            dispatch({ type: actionTypes.SET_BANNER, payload: { message: error.message, color: DOWNVOTE_RED } });
        }
    }

    return (
        <React.Fragment>
            <TopBar
                path={ADD_LOCATION}
                visible
            />
            <div className="add-location-container">
                <span>(Click on the map to add a marker)</span>
                {!isEmpty(name) && (
                    <div className="h5-container">
                        <h5>Name</h5>
                    </div>
                )}
                <input
                    className="name-input"
                    placeholder="Name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                >
                </input>
                {!isEmpty(description) && (
                    <div className="h5-container">
                        <h5>Description (100 characters minimum)</h5>
                    </div>
                )}
                <textarea
                    className="description-textarea"
                    placeholder="Description (100 characters minimum)"
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                >
                </textarea>
                <button className="add" onClick={createLocation}>
                    Add Location
                </button>
            </div>
        </React.Fragment>
    );
}

export default withRouter(AddLocation);
