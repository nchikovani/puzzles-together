import React from 'react';
import './style.scss';
import {useDispatch} from "react-redux";
import {closeModalWindow} from "../../store/actions";
import {useTranslation} from "react-i18next";

interface INoticeWindowProps {
  message: string;
}

const NoticeWindow: React.FC<INoticeWindowProps> = ({message}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const accept = () => {
    dispatch(closeModalWindow());
  }

  return (
    <div className="confirm-window">
      <div className="confirm-window__message">{message}</div>
      <div className="confirm-window__button-group">
        <button
          className="button"
          onClick={accept}
        >{t("common.ok")}</button>
      </div>
    </div>
  );
}

export default NoticeWindow;