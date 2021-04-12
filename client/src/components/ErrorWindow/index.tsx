import React from 'react';
import {IErrorState} from "../../store/store.types";
import './style.scss';
import {useDispatch} from "react-redux";
import {setError} from "../../store/actions";
import {useTranslation} from "react-i18next";
import getServerMessageTranslation from "../../utils/getServerMessageTranslation";

interface IErrorWindowProps {
  error: IErrorState;
}

const ErrorWindow: React.FC<IErrorWindowProps> = ({error}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const closeWindow = () => {
    dispatch(setError(false))
  }

  let message;
  if (error.statusCode) {
    message = getServerMessageTranslation(error.message, t);
  } else {
    message = error.message;
  }
  return (error.isError && error.showType === 'popWindow')
    ? <div className="error-window">
      <div className="error-window__background">
        <div className="error-window__pop-window">
          <div className="error-window__title">{t("error.error")} {error.statusCode}</div>
          <div className="error-window__message">{message}</div>
          <div className="error-window__button-group">
            <button
              className="button error-window__button-ok"
              onClick={closeWindow}
            >{t("common.ok")}</button>
          </div>
        </div>
      </div>
    </div>
    : null
}

export default ErrorWindow;