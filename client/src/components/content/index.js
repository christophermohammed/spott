import React, { useRef, useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import serverConfig from '../../config/server';
import * as locationService from '../../service/location';
import * as actionTypes from '../../state/actions/actionTypes';
import MediaPanel from '../media-panel';
import AddPhoto from '../add-photo';
import AddLocation from '../add-location';
import { ROOT, ADD_PHOTO, ADD_LOCATION } from '../../common/paths';
import { DOWNVOTE_RED } from "../../common/colors";
import { NEWEST } from "../../common/filters";
import './content.css';

function Content() {
  const contentRef = useRef(null);
  const selectedLocation = useSelector(state => state.location.selectedLocation);
  const media = useSelector(state => state.media);
  const adminMode = useSelector(state => state.adminMode);
  const [skip, setSkip] = useState(1);
  const [loadedAllMedia, setLoadedAllMedia] = useState(false);
  const [filter, setFilter] = useState(NEWEST);
  const [isRoot, setIsRoot] = useState(true);
  const [loadingMoreMedia, setLoadingMoreMedia] = useState(false);
  const dispatch = useDispatch();

  const { postsPerRequest } = serverConfig;

  useEffect(() => {
    const setMedia = async () => {
      try {
        if (selectedLocation._id) {
          const data = await locationService.getMediaForLocation(selectedLocation._id, postsPerRequest, 0, filter, adminMode);
          if (data) {
            dispatch({ type: actionTypes.SET_MEDIA, payload: data });
          }
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_BANNER, payload: { message: error.message, color: DOWNVOTE_RED } });
      }
    }

    setMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, filter]);

  const handleScroll = async () => {
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const percentageScroll = scrollTop / (scrollHeight - clientHeight);
    if (selectedLocation._id && percentageScroll > 0.8 && !loadedAllMedia && !loadingMoreMedia) {
      setLoadingMoreMedia(true);
      const newMedia = await locationService.getMediaForLocation(
        selectedLocation._id,
        postsPerRequest,
        skip * postsPerRequest,
        filter
      );
      dispatch({ type: actionTypes.SET_MEDIA, payload: [...media, ...newMedia] });
      if (newMedia.length < postsPerRequest) {
        setLoadedAllMedia(true);
      }
      setSkip(skip + 1);
      setLoadingMoreMedia(false);
    }
  }

  return (
    <div
      className="content-container"
      style={(isRoot && selectedLocation._id) ? { height: 'calc(100% - 80px)', marginTop: 80 } : { height: 'calc(100% - 80px)', marginTop: 50 }}
      ref={contentRef}
      onScroll={handleScroll}
    >
      <Switch>
        <Route path={ROOT} exact component={() =>
          <MediaPanel
            filter={filter}
            setFilter={setFilter}
            setIsRoot={setIsRoot}
          />
        } />
        <Route path={ADD_PHOTO} exact component={() => <AddPhoto setIsRoot={setIsRoot} />} />
        <Route path={ADD_LOCATION} exact component={() => <AddLocation setIsRoot={setIsRoot} />} />
      </Switch>
    </div>
  );
}

export default Content;
