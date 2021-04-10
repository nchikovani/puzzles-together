import React, {FunctionComponent, useEffect} from 'react';
import './style.scss';
import {StoreTypes, ErrorStateTypes} from "../../store/store.types";
import {connect, useDispatch} from "react-redux";
import {Link} from 'react-router-dom';
import {useRouteMatch} from "react-router-dom";
import Error from "../../pages/Error";
import {setError} from '../../store/actions'
import { useTranslation } from "react-i18next";

interface PagePropsTypes {
  userId: string | null;
  error: ErrorStateTypes;
}

const Page: FunctionComponent<PagePropsTypes> = (props) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
   dispatch(setError(false));
  }, [match.url]);


  return (
    <React.Fragment>
      <header className="header">
        <div className="header__logo">
          <Link to={`/`}><h1 className="header__title">Puzzles together</h1></Link>
        </div>
        <div>
          <Link to={`/users/${props.userId}/rooms`} className="header__rooms-link">{t("header.personalArea")}</Link>
        </div>
      </header>
      {
        props.error.isError && props.error.showType === 'page'
        ? <Error message={props.error.message} statusCode={props.error.statusCode}/>
        : <div className="page-wrapper">
          {props.children}
        </div>
      }
    </React.Fragment>
  )
}

const mapStateToProps = (store: StoreTypes) => {
  return {
    userId: store.user.id,
    error: store.error
  }
}

export default connect(mapStateToProps)(Page);