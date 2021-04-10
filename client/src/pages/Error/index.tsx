import React from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {setError} from "../../store/actions";
import './style.scss';
import {useTranslation} from "react-i18next";
import getServerMessageTranslation from '../../utils/getServerMessageTranslation';

interface ErrorPropsTypes {
  message: string | null;
  statusCode: number | null;
}

function Error(props: ErrorPropsTypes) {
  const history = useHistory();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const goToMainPage = () => {
    dispatch(setError(false));
    history.push('/');
  }

  let message;
  if (props.statusCode) {
    message = getServerMessageTranslation(props.message, t);
  } else {
    message = props.message;
  }
  return (
    <div className="error-page" onClick={goToMainPage}>
      <div className="error-page__error-content error-content">
        <div className="error-content__error-title">{t("error.error")} {props.statusCode}</div>
        <div className="error-content__error-message">{message}</div>
      </div>
    </div>
  )
}

export default Error;