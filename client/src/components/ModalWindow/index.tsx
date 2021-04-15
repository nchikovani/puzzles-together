import React from 'react';
import './style.scss';
import {IStore} from "../../store/store.types";
import {connect} from "react-redux";

interface IModalWindowProps {
  isOpen: boolean;
  content: React.ComponentElement<any, any> | null;
}

const ModalWindow: React.FC<IModalWindowProps> = ({isOpen, content}) => {
  return (
    <>
      {
        isOpen
          ? <div className="modal-window">
            <div className="modal-window__background">
              <div className="modal-window__window">
                {content}
              </div>
            </div>
          </div>
          : null
      }
    </>
  );
}

const mapStateToProps = (store: IStore) => {
  return {
    isOpen: store.modalWindow.isOpen,
    content: store.modalWindow.content,
  }
}

export default connect(mapStateToProps)(ModalWindow);