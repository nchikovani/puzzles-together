import React from 'react';
import {ErrorStateTypes} from "../../store/store.types";
import './style.scss';
import {useDispatch} from "react-redux";
import {setError} from "../../store/actions";
import {useTranslation} from "react-i18next";
import getServerMessageTranslation from "../../utils/getServerMessageTranslation";

interface ErrorWindowPropsTypes {
  error: ErrorStateTypes;
}

function ErrorWindow (props: ErrorWindowPropsTypes) {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const closeWindow = () => {
    dispatch(setError(false))
  }

  let message;
  if (props.error.statusCode) {
    message = getServerMessageTranslation(props.error.message, t);
  } else {
    message = props.error.message;
  }
  return (props.error.isError && props.error.showType === 'popWindow')
    ? <div className="error-window">
      <div className="error-window__background">
        <div className="error-window__pop-window">
          <div className="error-window__title">{t("error.error")} {props.error.statusCode}</div>
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