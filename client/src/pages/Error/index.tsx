import React from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {setError} from "../../store/actions";
import './style.scss';

interface ErrorPropsTypes {
  message: string | null;
  statusCode: number | null;
}

function Error(props: ErrorPropsTypes) {
  const history = useHistory();
  const dispatch = useDispatch();
  const goToMainPage = () => {
    dispatch(setError(false));
    history.push('/');
  }

  return (
    <div className="error-page" onClick={goToMainPage}>
      <div className="error-page__error-content error-content">
        <div className="error-content__error-title">ERROR {props.statusCode}</div>
        <div className="error-content__error-message">{props.message}</div>
      </div>
    </div>
  )
}

export default Error;