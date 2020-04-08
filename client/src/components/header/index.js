import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MdAllOut, MdClose, MdSettings } from 'react-icons/md';
import Modal from 'react-modal';
import ls from 'local-storage';
import { isEmpty } from '../../utils/validators';
import * as auth from '../../logic/user';
import * as locationService from '../../service/location';
import * as actionTypes from '../../state/actions/actionTypes';
import { ROOT } from '../../common/paths';
import { MAIN_DARK, DOWNVOTE_RED } from "../../common/colors";
import CountrySelector from '../country-selector';
import './header.css';

Modal.setAppElement('#root');

function Header({ history, favouritePlace, setFavouritePlace }) {
    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const banner = useSelector(state => state.banner);

    const [searchPlaceHolder, setSearchPlaceHolder] = useState('Search 🔎');
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [fName, setFName] = useState((user && user.firstName) || '');
    const [lName, setLName] = useState((user && user.lastName) || '');
    const [email, setEmail] = useState((user && user.email) || '');
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setFName((user && user.firstName) || '');
        setLName((user && user.lastName) || '');
        setEmail((user && user.email) || '');
        setFavouritePlace((user && user.favouritePlace &&
            { label: user.favouritePlace.formatted_address, value: user.favouritePlace }) || {});
        setPassword('');
        setCPassword('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const search = async (value) => {
        setQuery(value);
        if (value.length > 2) {
            const results = await locationService.getQueriedLocations(value);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }

    const setLocation = async (l) => {
        search('');
        dispatch({ type: actionTypes.SET_SELECTED_LOCATION, payload: l });
    }

    const setUserInfo = (data) => {
        dispatch({ type: actionTypes.SET_USER, payload: data.user });
        dispatch({ type: actionTypes.SET_TOKEN, payload: data.token });
        ls.set('user', data.user);
        ls.set('token', data.token);
    }

    const login = async () => {
        try {
            let data = await auth.login(email, password);
            setUserInfo(data);
        } catch (error) {
            dispatch({ type: actionTypes.SET_BANNER, payload: { message: error.message, color: DOWNVOTE_RED } });
        }
    }

    const signup = async () => {
        setIsModalOpen(false);
        try {
            let data = await auth.signUp(fName, lName, email, password, cpassword, favouritePlace);
            setUserInfo(data);
        } catch (error) {
            dispatch({ type: actionTypes.SET_BANNER, payload: { message: error.message, color: DOWNVOTE_RED } });
        }
    }

    const logout = async () => {
        try {
            await auth.logout(token);
            setUserInfo({ user: {}, token: "" });
            history.push(ROOT);
            dispatch({ type: actionTypes.SET_POSITION, payload: {} });
        } catch (error) {
            dispatch({ type: actionTypes.SET_BANNER, payload: { message: error.message, color: DOWNVOTE_RED } });
        }
    }

    const updateUserFromSettings = async () => {
        setShowSettings(false);
        try {
            var newUser = { ...user, favouritePlace };
            if (user._id) {
                var { firstName, lastName } = user;
                firstName = fName;
                lastName = lName;
                newUser = await auth.updateUserFromSettings(firstName, lastName, favouritePlace, token);
            }
            setUserInfo({ user: newUser, token });
        } catch (error) {
            dispatch({ type: actionTypes.SET_BANNER, payload: { message: error.message, color: DOWNVOTE_RED } });
        }
    }

    return (
        <React.Fragment>
            <div className="header" style={{ zIndex: (user.favouritePlace && !isModalOpen) ? 1000 : 0 }}>
                <div className="left">
                    <div className="logo-title-container">
                        <MdAllOut style={{ height: 30, width: 30 }} />
                        <div className="title-container">
                            <h1 className="title">Spott</h1>
                        </div>
                    </div>
                </div>
                <div className="search-bar-container">
                    <input
                        className="search-bar"
                        placeholder={searchPlaceHolder}
                        onFocus={() => setSearchPlaceHolder('')}
                        onBlur={() => setSearchPlaceHolder('Search 🔎')}
                        value={query}
                        onChange={e => search(e.target.value)}
                    ></input>
                    <MdClose size={12} onClick={() => search('')} />
                </div>
                <div className="right">
                    {!user._id ? (
                        <React.Fragment>
                            <div>
                                <input
                                    className="email-input"
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                >
                                </input>
                                <input
                                    className="password-input"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                >
                                </input>
                            </div>
                            <div>
                                <button className="login-btn" onClick={login}>Login</button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    style={{ color: 'white', backgroundColor: MAIN_DARK }}
                                >Sign Up</button>
                            </div>
                        </React.Fragment>
                    ) : (
                            <div>
                                <button onClick={logout}>Logout</button>
                            </div>
                        )}
                    <div
                        className="settings-icon-container"
                        onClick={() => {
                            setShowSettings(!showSettings)
                        }}
                    >
                        <MdSettings size={30} />
                    </div>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    className="modal"
                    overlayClassName="overlay"
                >
                    <div className="modal-container">
                        <div className="su-h1-container">
                            <h1>Sign Up</h1>
                        </div>
                        <div className="su-input-container">
                            <div className="auth-info">
                                {!isEmpty(fName) && (
                                    <h5>First Name</h5>
                                )}
                                <input
                                    className="fname-input"
                                    placeholder="First Name"
                                    type="text"
                                    value={fName}
                                    onChange={e => setFName(e.target.value)}
                                >
                                </input>
                                {!isEmpty(lName) && (
                                    <h5>Last Name</h5>
                                )}
                                <input
                                    className="lname-input"
                                    placeholder="Last Name"
                                    type="text"
                                    value={lName}
                                    onChange={e => setLName(e.target.value)}
                                >
                                </input>
                                {!isEmpty(email) && (
                                    <h5>Email</h5>
                                )}
                                <input
                                    className="email-input"
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                >
                                </input>
                                {!isEmpty(password) && (
                                    <h5>Password</h5>
                                )}
                                <input
                                    className="password-input"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                >
                                </input>
                                {!isEmpty(cpassword) && (
                                    <h5>Confirm Password</h5>
                                )}
                                <input
                                    className="password-input"
                                    placeholder="Confirm Password"
                                    type="password"
                                    value={cpassword}
                                    onChange={e => setCPassword(e.target.value)}
                                >
                                </input>
                            </div>
                            <div className="country-info">
                                <CountrySelector
                                    favouritePlace={favouritePlace}
                                    setFavouritePlace={setFavouritePlace}
                                />
                            </div>
                        </div>
                        <div className="su-button-container">
                            <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button style={{ color: 'white', backgroundColor: MAIN_DARK }} onClick={signup}>Sign Up</button>
                        </div>
                    </div>
                </Modal>
            </div>
            {banner.message && (
                <div className="error-container" style={{ backgroundColor: banner.color }}>
                    <div className="message-container">
                        <span style={{ color: 'white' }}>{banner.message}</span>
                    </div>
                    <div className="close-container">
                        <MdClose style={{ color: 'white' }} onClick={() => dispatch({ type: actionTypes.SET_BANNER, payload: { message: "" } })} />
                    </div>
                </div>
            )}
            {searchResults.length > 0 && (
                <div className="search-results-container">
                    <ul>
                        {searchResults.map(location => (
                            <div className="search-result" onClick={() => setLocation(location)}>
                                <h4>{location.name}</h4>
                                <p>{location.address}</p>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
            {showSettings && (
                <div className="settings-panel">
                    <h1>Settings</h1>
                    <CountrySelector
                        favouritePlace={favouritePlace}
                        setFavouritePlace={setFavouritePlace}
                    />
                    {user._id && (
                        <div className="input-container">
                            {!isEmpty(fName) && (
                                <h5>First Name</h5>
                            )}
                            <input
                                className="fname-input"
                                placeholder="First Name"
                                type="text"
                                value={fName}
                                onChange={e => setFName(e.target.value)}
                            >
                            </input>
                            {!isEmpty(lName) && (
                                <h5>Last Name</h5>
                            )}
                            <input
                                className="lname-input"
                                placeholder="Last Name"
                                type="text"
                                value={lName}
                                onChange={e => setLName(e.target.value)}
                            >
                            </input>
                        </div>
                    )}
                    <div className="settings-button-wrapper">
                        <div className="su-button-container">
                            <button className="cancel-btn" onClick={() => setShowSettings(false)}>Cancel</button>
                            <button
                                style={{ color: 'white', backgroundColor: MAIN_DARK }}
                                onClick={updateUserFromSettings}
                            >Save</button>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}

export default withRouter(Header);
