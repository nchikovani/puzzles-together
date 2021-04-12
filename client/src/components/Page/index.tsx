import React, {FunctionComponent, useEffect} from 'react';
import './style.scss';
import {IStore, IErrorState} from "../../store/store.types";
import {connect, useDispatch} from "react-redux";
import {Link} from 'react-router-dom';
import {useRouteMatch} from "react-router-dom";
import Error from "../../pages/Error";
import {setError} from '../../store/actions'
import { useTranslation } from "react-i18next";

interface IPageProps {
  userId: string | null;
  error: IErrorState;
}

const Page: FunctionComponent<IPageProps> = ({userId, error, children}) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
   error.isError && dispatch(setError(false));
  }, [match.url]);


  return (
    <React.Fragment>
      <header className="header">
        <div className="header__logo">
          <Link to={`/`}><h1 className="header__title">Puzzles together</h1></Link>
        </div>
        <div>
          <Link to={`/users/${userId}/rooms`} className="header__rooms-link">{t("header.personalArea")}</Link>
        </div>
      </header>
      {
        error.isError && error.showType === 'page'
        ? <Error message={error.message} statusCode={error.statusCode}/>
        : <div className="page-wrapper">
          {children}
        </div>
      }
    </React.Fragment>
  )
}

const mapStateToProps = (store: IStore) => {
  return {
    userId: store.user.id,
    error: store.error
  }
}

export default connect(mapStateToProps)(Page);