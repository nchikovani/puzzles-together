import React from 'react';
import './style.scss';
import {useDispatch} from "react-redux";
import {closeModalWindow} from "../../store/actions";
import {useTranslation} from "react-i18next";

interface IConfirmWindowProps {
  message: string;
  confirmAction: () => void;
}

const ConfirmWindow: React.FC<IConfirmWindowProps> = ({message, confirmAction}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const cancel = () => {
    dispatch(closeModalWindow());
  }

  const accept = () => {
    confirmAction();
    dispatch(closeModalWindow());
  }

  return (
    <div className="confirm-window">
      <div className="confirm-window__message">{message}</div>
      <div className="confirm-window__button-group">
        <button
          className="button"
          onClick={cancel}
        >{t("common.cancel")}</button>
        <button
          className="button"
          onClick={accept}
        >{t("common.ok")}</button>
      </div>
    </div>
  );
}

export default ConfirmWindow;