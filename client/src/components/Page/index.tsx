import React, {FunctionComponent, useEffect} from 'react';
import './style.scss';
import { useHistory } from "react-router-dom";
import {connect} from "react-redux";

interface PagePropsTypes {
  roomId: string;
  notFound: boolean;
}

const Page: FunctionComponent<PagePropsTypes> = (props) => {
  const history = useHistory();

  useEffect(() => {
   props.roomId && history.push(`/Room/${props.roomId}`);
   props.notFound && history.push(`/notFound`);
  }, [props.roomId, props.notFound]);

  return (
    <React.Fragment>
      <header className="header">
        <a href="#"
           onClick={(e) => {
             e.preventDefault();
             history.push('/');
           }}
        >
          <h1 className="header__title">Puzzles together</h1>
        </a>
      </header>
      <div className="page-wrapper">
        {props.children}
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (store: any) => {
  return {
    roomId: store.room.roomId,
    notFound: store.room.notFound,
  }
}

export default connect(mapStateToProps)(Page);