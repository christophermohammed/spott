import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { isEmpty } from '../../utils/validators';
import Modal from 'react-modal';
import * as twilioLogic from '../../logic/twilio';
import * as userLogic from '../../logic/user';
import * as actionTypes from '../../state/actions/actionTypes';
import { errors } from '../../common/top-bar-messages';
import { ROOT, ADD_LOCATION, ADD_PHOTO } from '../../common/paths';
import { MAIN_DARK, DOWNVOTE_RED } from '../../common/colors';
import { NEWEST, POPULAR } from '../../common/filters';
import './top-bar.css';

function TopBar({ path, history, filter, setFilter }) {
  const user = useSelector(state => state.user);
  const adminMode = useSelector(state => state.adminMode);
  const token = useSelector(state => state.token);
  const selectedLocation = useSelector(state => state.location.selectedLocation);
  const message = useSelector(state => state.banner.message);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const dispatch = useDispatch();

  const sendLocation = async () => {
    try {
      await twilioLogic.sendLocation(phoneNumber, selectedLocation);
    } catch (error) {
      dispatch({ type: actionTypes.SET_BANNER, payload: { message: error.message, color: DOWNVOTE_RED } });
    }
    setIsModalOpen(false);
    setPhoneNumber('');
  }

  const savePhoneNumber = async () => {
    try {
      const user = await userLogic.savePhoneNumber(phoneNumber, token);
      dispatch({ type: actionTypes.SET_USER, payload: user });
    } catch (error) {
      setIsModalOpen(false);
      setPhoneNumber('');
      dispatch({ type: actionTypes.SET_BANNER, payload: { message: error.message, color: DOWNVOTE_RED } });
    }
  }

  const handleAddPhotoClick = () => {
    if (!user._id) {
      dispatch({ type: actionTypes.SET_BANNER, payload: { message: errors.ADD_PHOTO_MISSING_AUTH, color: MAIN_DARK } })
    } else {
      history.push(ADD_PHOTO);
    }
  }

  const renderLeft = () => {
    switch (path) {
      case ROOT:
        return (
          <button className="add" onClick={handleAddPhotoClick}>
            Add Photo
          </button>
        );
      case ADD_PHOTO:
        return (
          <Link to={ROOT}>
            <MdArrowBack style={{ width: 30, height: 30, color: 'black' }} />
          </Link>
        );
      case ADD_LOCATION:
        return (
          <Link to={ADD_PHOTO}>
            <MdArrowBack style={{ width: 30, height: 30, color: 'black' }} />
          </Link>
        );
      default:
        break;
    }
  }

  const renderRight = () => {
    switch (path) {
      case ROOT:
        if (selectedLocation.lat && selectedLocation.lng) {
          return (
            <button className="add" onClick={() => setIsModalOpen(true)}>
              Send to your phone
            </button>
          );
        }
        return;
      case ADD_PHOTO:
        return (
          <Link to={ADD_LOCATION}>
            <button className="add">
              Add Location
            </button>
          </Link>
        );
      case ADD_LOCATION:
        return;
      default:
        return;
    }
  }

  const getMiddleMessage = () => {
    switch (path) {
      case ROOT:
        return !adminMode && selectedLocation && (
          <div className="location-name" style={{ flexDirection: "column" }}>
            <h4>{selectedLocation.name}</h4>
            <p>{selectedLocation.address}</p>
          </div>
        );
      case ADD_PHOTO:
        return (
          <h3>Add Photo</h3>
        );
      case ADD_LOCATION:
        return (
          <h3>Add Location</h3>
        );
      default:
        return;
    }
  }

  return (
    <React.Fragment>
      <div className="topbar-container" style={{ top: message ? 102 : 70 }}>
        <div className="top">
          <div className="left-container">
            {renderLeft()}
          </div>
          <div className="location-container">
            {getMiddleMessage()}
          </div>
          <div className="right-container">
            {renderRight()}
          </div>
        </div>
        {(path === ROOT) && (selectedLocation._id) && (
          <div className="bottom">
            <div
              className="newest-label-wrapper"
              style={{ backgroundColor: (filter === NEWEST && !adminMode) ? '#ecf0f1' : 'white' }}
              onClick={() => {
                setFilter(NEWEST);
                dispatch({ type: actionTypes.SET_ADMIN_MODE, payload: false });
              }}
            >
              <h3>Newest</h3>
            </div>
            <div
              className="popular-label-wrapper"
              style={{ backgroundColor: (filter === POPULAR && !adminMode) ? '#ecf0f1' : 'white' }}
              onClick={() => {
                setFilter(POPULAR);
                dispatch({ type: actionTypes.SET_ADMIN_MODE, payload: false });
              }}
            >
              <h3>Most Popular</h3>
            </div>
            {user.adminProperties && (
              <div
                className="admin-label-wrapper"
                style={{ backgroundColor: adminMode ? '#ecf0f1' : 'white' }}
                onClick={() => dispatch({ type: actionTypes.SET_ADMIN_MODE, payload: true })}
              >
                <h3>Admin</h3>
              </div>
            )}
          </div>
        )}
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-container">
            <h1>Send Location</h1>
            <div className="phone-number-input-container">
              {!isEmpty(phoneNumber) && (
                <h5>Phone Number</h5>
              )}
              <input
                className="phone-number-input"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              >
              </input>
            </div>
            {user.phoneNumber !== phoneNumber && (
              <div className="phone-number-button-container">
                {user.email && (
                  <button style={{ backgroundColor: 'white' }} onClick={savePhoneNumber}>Save #</button>
                )}
                {user.phoneNumber && (
                  <button style={{ color: 'white', backgroundColor: MAIN_DARK }} onClick={() => setPhoneNumber(user.phoneNumber)}>Use saved #</button>
                )}
              </div>
            )}
            <div className="phone-number-button-container">
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button style={{ color: 'white', backgroundColor: MAIN_DARK }} onClick={sendLocation}>Send</button>
            </div>
          </div>
        </Modal>
      )}
    </React.Fragment>
  )
}

export default withRouter(TopBar);
