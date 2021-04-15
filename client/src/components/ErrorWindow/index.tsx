import React from 'react';
import {IErrorState, IStore} from "../../store/store.types";
import './style.scss';
import {connect, useDispatch} from "react-redux";
import {setError, closeModalWindow} from "../../store/actions";
import {useTranslation} from "react-i18next";
import getServerMessageTranslation from "../../utils/getServerMessageTranslation";

interface IErrorWindowProps {
  error: IErrorState;
}

const ErrorWindow: React.FC<IErrorWindowProps> = ({error}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const closeWindow = () => {
    dispatch(setError(false));
    dispatch(closeModalWindow());
  }

  let message;
  if (error.statusCode) {
    message = getServerMessageTranslation(error.message, t);
  } else {
    message = error.message;
  }
  return (
    <div className="error-window">
      <div className="error-window__title">{t("error.error")} {error.statusCode}</div>
      <div className="error-window__message">{message}</div>
      <div className="error-window__button-group">
        <button
          className="button error-window__button-ok"
          onClick={closeWindow}
        >{t("common.ok")}</button>
      </div>
    </div>
  );
}

const mapStateToProps = (store: IStore) => {
  return {
    error: store.error
  }
}

export default connect(mapStateToProps)(ErrorWindow);