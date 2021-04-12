import React from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {setError} from "../../store/actions";
import './style.scss';
import {useTranslation} from "react-i18next";
import getServerMessageTranslation from '../../utils/getServerMessageTranslation';

interface IErrorProps {
  message: string | null;
  statusCode: number | null;
}

const Error: React.FC<IErrorProps> = ({message, statusCode}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const goToMainPage = () => {
    dispatch(setError(false));
    history.push('/');
  }

  let messageTranslation;
  if (statusCode) {
    messageTranslation = getServerMessageTranslation(message, t);
  } else {
    messageTranslation = message;
  }
  return (
    <div className="error-page" onClick={goToMainPage}>
      <div className="error-page__error-content error-content">
        <div className="error-content__error-title">{t("error.error")} {statusCode}</div>
        <div className="error-content__error-message">{messageTranslation}</div>
      </div>
    </div>
  )
}

export default Error;