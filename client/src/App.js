import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as actionTypes from './state/actions/actionTypes';
import * as locationService from './service/location';
import { MAIN_DARK, DOWNVOTE_RED } from './common/colors';
import ls from 'local-storage';
import Modal from 'react-modal';
import Map from './components/map';
import Header from './components/header';
import Content from './components/content';
import CountrySelector from './components/country-selector';
import './App.css';

function App() {
  const banner = useSelector(state => state.banner);
  const user = useSelector(state => state.user);
  const adminMode = useSelector(state => state.adminMode);
  const [favouritePlace, setFavouritePlace] = useState((user && user.favouritePlace) || {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const setUserInfo = (data) => {
    dispatch({ type: actionTypes.SET_USER, payload: data.user });
    dispatch({ type: actionTypes.SET_TOKEN, payload: data.token });
    ls.set('user', data.user);
    ls.set('token', data.token);
  }

  const selectFavouritePlace = () => {
    setIsModalOpen(false);
    if (favouritePlace) {
      const newUser = { ...user, favouritePlace };
      dispatch({ type: actionTypes.SET_USER, payload: newUser });
      ls.set('user', newUser);
    }
  }

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = adminMode ?
          await locationService.getAdminLocations(user.adminProperties.countryCode) :
          await locationService.getLocations();
        dispatch({ type: actionTypes.SET_LOCATIONS, payload: data });
      } catch (error) {
        dispatch({ type: actionTypes.SET_BANNER, payload: { message: error.message, color: DOWNVOTE_RED } });
      }
    }

    let user = ls.get('user') || {};
    let token = ls.get('token') || '';
    if (user && user.favouritePlace) {
      setUserInfo({ user, token });
    } else {
      setIsModalOpen(true);
    }

    dispatch({ type: actionTypes.SET_SELECTED_LOCATION, payload: {} });
    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminMode]);

  return (
    <>
      {window.innerWidth > 870 ? (
        <>
          <Router>
            <div>
              <Header
                favouritePlace={favouritePlace}
                setFavouritePlace={setFavouritePlace}
              />
              <div className="root-container" style={{ height: banner.message ? 'calc(100vh - 92px)' : 'calc(100vh - 62px)' }}>
                <Content />
                <Map />
              </div>
            </div>
          </Router>
          <Modal
            isOpen={isModalOpen}
            className="modal"
            overlayClassName="overlay"
          >
            <div className="modal-container">
              <div className="fp-header-container">
                <h1>Favourite place</h1>
                <p style={{ fontSize: 12 }}>Search for your favourite place in the world (city, country...)</p>
              </div>
              <div className="country-selector-container">
                <CountrySelector
                  favouritePlace={user.favouritePlace}
                  setFavouritePlace={setFavouritePlace}
                />
              </div>
              <div className="button-container">
                <button style={{ color: 'white', backgroundColor: MAIN_DARK }} onClick={selectFavouritePlace}>Select</button>
              </div>
            </div>
          </Modal>
        </>
      ) : (
          <div className="small-window-container">
            <h1>Hey,</h1>
            <h2>Spott isn't available on mobile yet</h2>
            <span role="img" aria-labelledby="sad">😢</span>
          </div>
        )}
    </>
  );
}

export default App;
