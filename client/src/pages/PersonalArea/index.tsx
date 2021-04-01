import React, {useEffect} from 'react';
import {StoreTypes, PersonalAreaTypes} from "../../store/store.types";
import {connect, useDispatch} from "react-redux";
import {useRouteMatch} from "react-router-dom";
import {fetchGetPersonalArea} from "../../store/actions/fetchActions";

import Rooms from './Rooms';

interface PersonalAreaPropsTypes {
  personalArea: PersonalAreaTypes;
}

function PersonalArea (props: PersonalAreaPropsTypes) {
  const match = useRouteMatch();
  const dispatch = useDispatch();

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchGetPersonalArea(match.params.userId));
  }, [dispatch, match.params]);

  return (
    <div>
      {
        props.personalArea.isOwner
          ? <Rooms rooms={props.personalArea.rooms}/>
          : null
      }
    </div>
  )
}

const mapStateToProps = (store: StoreTypes) => {
  return {
    personalArea: store.personalArea
  }
}

export default connect(mapStateToProps)(PersonalArea);
