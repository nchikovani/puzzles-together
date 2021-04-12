import React from 'react';
// import {StoreTypes, PersonalAreaTypes} from "../../store/store.types";
// import {connect, useDispatch} from "react-redux";
// import {useRouteMatch} from "react-router-dom";
// import {fetchGetPersonalArea} from "../../store/actions/fetchActions";

import Rooms from '../Rooms';

// interface PersonalAreaPropsTypes {
//   personalArea: PersonalAreaTypes;
// }

const PersonalArea = () => {

  return (
    <div>
      <Rooms/>
    </div>
  )
}

// const mapStateToProps = (store: StoreTypes) => {
//   return {
//     personalArea: store.personalArea
//   }
// }

// export default connect(mapStateToProps)(PersonalArea);
export default PersonalArea;