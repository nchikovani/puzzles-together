import React, {FunctionComponent} from 'react';
import './style.scss';
import { useHistory } from "react-router-dom";
import {StoreTypes} from "../../store/store.types";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';

interface PagePropsTypes {
  userId: string | null;
  // notFound: boolean;
}

const Page: FunctionComponent<PagePropsTypes> = (props) => {
  const history = useHistory();
  //
  // useEffect(() => {
  //  props.roomId && history.push(`/Room/${props.roomId}`);
  //  props.notFound && history.push(`/notFound`);
  // }, [props.roomId, props.notFound]);

  return (
    <React.Fragment>
      <header className="header">
        <div className="header__logo">
          <Link to={`/`}><h1 className="header__title">Puzzles together</h1></Link>
        </div>
        <div>
          <Link to={`/users/${props.userId}/rooms`} className="header__rooms-link">Личный кабинет</Link>
        </div>
      </header>
      <div className="page-wrapper">
        {props.children}
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (store: StoreTypes) => {
  return {
    userId: store.user.id
  }
}

export default connect(mapStateToProps)(Page);