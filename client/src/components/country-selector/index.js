import React, { useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { searchForPlace } from '../../service/place';
import { isEmpty } from '../../utils/validators';
import './country-selector.css';

function CountrySelector({ favouritePlace, setFavouritePlace }) {
    const [query, setQuery] = useState((favouritePlace && favouritePlace.formatted_address) || "");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const search = async () => {
        setLoading(true);
        const results = await searchForPlace(query);
        setSearchResults(results);
        setLoading(false);
    }

    const selectPlace = (place) => {
        setFavouritePlace(place);
        setSearchResults([]);
        setQuery(place.formatted_address);
    }

    return (
        <>
            {!isEmpty(query) && (
                <h5>Favourite place</h5>
            )}
            <div className="place-search-container">
                <div className="fp-input-wrapper">
                    <input
                        placeholder="Favourite place"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyPress={e => {
                            if (!e) e = window.event;
                            var keyCode = e.keyCode || e.which;
                            if (keyCode === 13) {
                                // Enter pressed
                                search();
                                return false;
                            }
                        }}
                    ></input>
                    <div className="cursor-pointer" onClick={search}>
                        <span role="img" aria-label="search">🔎</span>
                    </div>
                </div>
                <div className="google-maps-label-container">
                    <span className="google-maps-label">Powered by Google Maps</span>
                </div>
            </div>
            <div className="place-list-container" style={{ marginBottom: loading ? 20 : 0 }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                        <>
                            {searchResults.length > 0 && (
                                <ul>
                                    {searchResults.map(place => (
                                        <div onClick={() => selectPlace(place)} className="cursor-pointer" key={place.place_id}>
                                            <span className="place-label">{place.formatted_address}</span>
                                        </div>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
            </div>
        </>
    );
}

export default CountrySelector;
