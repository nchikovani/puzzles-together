import React, {useEffect, useState} from 'react';

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import './style.scss';
import {IChatState, IStore, IUserState} from "../../store/store.types";
import {connect} from "react-redux";
import SocketService from "../../service/socketService";

interface IChatProps {
  user: IUserState;
  chat: IChatState;
  chatId: string | null;
  socketService: SocketService;
}

const Chat: React.FC<IChatProps> = ({user, chat, socketService}) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    //получить чат
  }, []);

  const sendMessage = () => {
    if (!chat.id) return;
    socketService.sendMessage(chat.id, message);
    setMessage('');
  };
  return (
    <div
      className="chat"
    >
      {/*<div className="chat__body-wrap">*/}
        <div className="chat__body">
          {
            chat.messages.map((message) => (
              <div
                key={message.id}
                className={`chat__message-wrap ${message.userId === user.id ? 'chat__message-wrap_my' : ''}`}
              >
                <div className='chat__message chat-message'>
                  <Typography
                    className="chat-message__user-name"
                  >
                    {message.userId}
                  </Typography>
                  <Typography
                    className="chat-message__content"
                  >
                    {message.content}
                  </Typography>
                  <Typography
                    className="chat-message__time"
                  >
                    {`${message.date.getHours()}:${message.date.getMinutes()}`}
                  </Typography>
                </div>

              </div>
            ))
          }
        </div>
      {/*</div>*/}
      <div className="chat__input">
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение"
          multiline
          rowsMax={4}
          variant="outlined"
          size="small"
          className="chat__input-text"
        />
        <IconButton
          className="chat__send-button"
          size="small"
          onClick={sendMessage}
        >
          <SendIcon/>
        </IconButton>
      </div>

    </div>
  )
}

const mapStateToProps = (store: IStore) => {
  return {
    user: store.user,
    chat: store.chat,
  }
}

export default connect(mapStateToProps)(Chat);