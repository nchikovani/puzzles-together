import React from 'react';

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import './style.scss';
import {IStore, IUserState} from "../../store/store.types";
import {connect} from "react-redux";

interface IChat {
  user: IUserState;
}

const Chat: React.FC<IChat> = ({user}) => {
  const chat = {
    // senders: {
    //   userId: 'userId',
    //   name: 'name',
    // },
    messages: [
      {
        messageId: '123',
        userId: '6081dc7fff955935345149e5',
        content: 'пока!!',
        date: new Date(),
      },
      {
        messageId: '321',
        userId: 'userId123',
        content: 'Привет!!',
        date: new Date(),
      }
    ]
  }
  return (
    <div
      className="chat"
    >
      {/*<div className="chat__body-wrap">*/}
        <div className="chat__body">
          {
            chat.messages.map((message) => (
              <div
                key={message.messageId}
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
                </div>
              </div>
            ))
          }
        </div>
      {/*</div>*/}
      <div className="chat__input">
        <TextField
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
  }
}

export default connect(mapStateToProps)(Chat);