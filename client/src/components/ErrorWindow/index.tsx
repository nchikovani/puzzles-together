import React from 'react';
import {ErrorStateTypes} from "../../store/store.types";
import './style.scss';
import {useDispatch} from "react-redux";
import {setError} from "../../store/actions";

interface ErrorWindowPropsTypes {
  error: ErrorStateTypes;
}

function ErrorWindow (props: ErrorWindowPropsTypes) {
  const dispatch = useDispatch();
  const closeWindow = () => {
    dispatch(setError(false))
  }

  return (props.error.isError && props.error.showType === 'popWindow')
    ? <div className="error-window">
      <div className="error-window__background">
        <div className="error-window__pop-window">
          <div className="error-window__title">Error {props.error.statusCode}</div>
          <div className="error-window__message">{props.error.message}</div>
          <div className="error-window__button-group">
            <button
              className="button error-window__button-ok"
              onClick={closeWindow}
            >ok</button>
          </div>
        </div>
      </div>
    </div>
    : null
}

export default ErrorWindow;