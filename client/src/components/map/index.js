import React, {useEffect, useState} from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker
} from "react-google-maps";
import { useSelector, useDispatch } from 'react-redux';
import * as actionTypes from '../../state/actions/actionTypes';
import './map.css';

function Map() {
  const favouritePlace = useSelector(state => state.user.favouritePlace);
  const location = useSelector(state => state.location);
  const [center, setCenter] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if(!location.selectedLocation._id) {
      setCenter((favouritePlace && favouritePlace.geometry && favouritePlace.geometry.location) || 
        {lat: 10.691803, lng: -61.222503});
    } else {
      const { lat, lng } = location.selectedLocation;
      setCenter({lat: parseFloat(lat), lng: parseFloat(lng)});
    }
  }, [favouritePlace, location.selectedLocation]);

  return (
    <>
    {center.lat && (
      <GoogleMap
        defaultZoom={9}
        center={center}
        onClick={e => {
          const lat = e.latLng.lat(); 
          const lng = e.latLng.lng();
          if(location.position.canBeModified) {
            dispatch({type: actionTypes.SET_POSITION, payload: {lat, lng, canBeModified: true}});
          } 
        }}
      >
        {location.data && location.data.map((l) => (
          <Marker 
            icon={{
              url: '/flag.svg',
              scaledSize: new window.google.maps.Size(30, 30)
            }}
            key={l._id}
            position={{lat: parseFloat(l.lat), lng: parseFloat(l.lng)}}
            onClick={() => dispatch({type: actionTypes.SET_SELECTED_LOCATION, payload: l})}
          />
        ))}
        {(location.position.lat) && (
          <Marker 
            icon={{
              url: '/outlined_flag.svg',
              scaledSize: new window.google.maps.Size(30, 30)
            }}
            position={{
              lat: parseFloat(location.position.lat), 
              lng: parseFloat(location.position.lng)
            }}
          />
        )}
      </GoogleMap>
    )}
    </>
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default function FinalMap() {
  const {REACT_APP_MAPS_URL, REACT_APP_MAPS_API_KEY} = process.env;
  const url = REACT_APP_MAPS_URL + REACT_APP_MAPS_API_KEY;
  return (
    <div className="map-container">
      <WrappedMap
        googleMapURL={url}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}