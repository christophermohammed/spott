import React, { useEffect } from 'react';
import { useWindowDimensions } from '../../logic/window';
import { useSelector, useDispatch } from 'react-redux';
import * as actionTypes from '../../state/actions/actionTypes';
import Post from '../post';
import TopBar from '../top-bar';
import { ROOT } from '../../common/paths';
import './media-panel.css';

function MediaPanel({ filter, setFilter, setIsRoot }) {
  const selectedLocation = useSelector(state => state.location.selectedLocation);
  const media = useSelector(state => state.media);
  const adminMode = useSelector(state => state.adminMode);
  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: actionTypes.SET_POSITION, payload: { canBeModified: false } });
    setIsRoot(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <TopBar
        path={ROOT}
        filter={filter}
        setFilter={setFilter}
      />
      {selectedLocation._id ? (
        <div className="media-panel">
          <div className="description-container">
            <p className="description">{selectedLocation && selectedLocation.description}</p>
          </div>
          {(media && media.length !== 0) ? (
            <div className="list-container">
              <ul>
                {media.map(m => (
                  <Post
                    key={m._id}
                    initialMedia={m}
                    screenWidth={width}
                    screenHeight={height}
                  />
                ))}
              </ul>
            </div>
          ) : (
              <div className="no-media-container">
                <h3 className="no-media-message">Looks like this spot doesn't have any media yet</h3>
              </div>
            )}
        </div>
      ) : (
          <div className="no-media-container">
            <h3 className="no-media-message">Select a spot on the map to see what it looks like</h3>
            {adminMode && (
              <p>If there are no locations that have photos for approval, refresh the page to exit Admin Mode</p>
            )}
          </div>
        )}
    </React.Fragment>
  );
}

export default MediaPanel;
