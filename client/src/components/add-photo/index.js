import React, { useState, useEffect } from 'react';
import { Switch } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { checkLocation } from '../../logic/location';
import * as actionTypes from '../../state/actions/actionTypes';
import * as locationService from '../../service/location';
import * as mediaService from '../../service/media';
import { ROOT, ADD_PHOTO } from '../../common/paths';
import { MAIN_DARK, DOWNVOTE_RED } from "../../common/colors";
import * as messages from '../../common/top-bar-messages';
import TopBar from '../top-bar';
import './add-photo.css';
import { isEmpty } from 'utils/validators';

function AddPhoto({ history, setIsRoot }) {
  const user = useSelector(state => state.user);
  const token = useSelector(state => state.token);
  const selectedLocation = useSelector(state => state.location.selectedLocation);
  const position = useSelector(state => state.location.position);
  const [newPositionChecked, setNewPositionChecked] = useState(position.name ? true : false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newLocationId, setNewLocationId] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user.email) {
      history.push(ROOT);
    }
    setIsRoot(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createPhoto = async () => {
    setLoading(true);
    try {
      // check for location errors then set location and service
      var locationId = '';
      if (newPositionChecked) {
        if (isEmpty(newLocationId)) {
          checkLocation(position);
          locationId = await locationService.setLocation(position, token);
        }
      } else {
        locationId = selectedLocation._id;
      }

      if (!isEmpty(locationId)) {
        setNewLocationId(locationId);
        await mediaService.setMedia(selectedFile, locationId, token);
      } else {
        throw new Error(messages.errors.LOCATION_MISSING);
      }
      //success
      dispatch({
        type: actionTypes.SET_BANNER,
        payload: {
          message: messages.general.UPLOAD_THANKS,
          color: MAIN_DARK
        }
      });
      dispatch({ type: actionTypes.SET_POSITION, payload: {} });
      history.push(ROOT);
    } catch (error) {
      dispatch({
        type: actionTypes.SET_BANNER,
        payload: {
          message: error.message,
          color: DOWNVOTE_RED
        }
      });
    }
    setLoading(false);
  }

  return (
    <React.Fragment>
      <TopBar
        visible
        path={ADD_PHOTO}
      />
      <div className="add-photo-container">
        <div className="sub-header-container">
          <h4 style={{ color: MAIN_DARK }}>Media</h4>
        </div>
        <ul>
          <li style={{ fontSize: 14 }}>Max size: 8MB</li>
          <li style={{ fontSize: 14 }}>File type: jpg/jpeg , png</li>
        </ul>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <input type="file" onChange={e => setSelectedFile(e.target.files[0])}></input>
        </div>
        <div className="sub-header-container">
          <h4 style={{ color: MAIN_DARK }}>Location</h4>
        </div>
        {!newPositionChecked && !selectedLocation.name && (
          <span style={{ marginTop: 10 }}>Please select a location</span>
        )}
        {position.name && (
          <div className="row">
            <div className="cell">
              <span>Use new location {position.name}?</span>
            </div>
            <div className="cell">
              <Switch
                color="primary"
                checked={newPositionChecked}
                onChange={e => setNewPositionChecked(e.target.checked)}
              />
            </div>
          </div>
        )}
        {!newPositionChecked && selectedLocation.name && (
          <div className="row">
            <div className="cell">
              <span>Using selected location</span>
            </div>
            <div className="cell">
              <span>{selectedLocation.name}</span>
            </div>
          </div>
        )}
        <div style={{ marginTop: 10 }}>
          <button className="add" onClick={createPhoto}>
            Add Photo
          </button>
        </div>
        {loading && (
          <div style={{ marginTop: 20 }}>
            <CircularProgress />
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default withRouter(AddPhoto);
