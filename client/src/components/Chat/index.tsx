import React, {useEffect, useState, useRef} from 'react';
import {fetchGetChat} from '../../store/actions/fetchActions';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import './style.scss';
import {IChatState, IStore, IUserState} from "../../store/store.types";
import {connect, useDispatch} from "react-redux";
import SocketService from "../../service/socketService";
import {clearChat} from "../../store/actions";

interface IChatProps {
  user: IUserState;
  chat: IChatState;
  chatId: string | null;
  socketService: SocketService;
}

const Chat: React.FC<IChatProps> = ({user, chat, chatId, socketService}) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    if (!chatId) return;
    dispatch(fetchGetChat(chatId));
    return () => {
      dispatch(clearChat());
    }
  }, [chatId]);

  const sendMessage = () => {
    if (!chat.id) return;
    if (!message.replace(/\s/g, '')) return;
    socketService.sendMessage(chat.id, message.trim());
    setMessage('');
  };

  const enterHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.shiftKey && e.key === 'Enter') || (e.ctrlKey && e.key === 'Enter')) {
      e.preventDefault();
      setMessage(message + '\n');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      className="chat"
    >
      {/*<div className="chat__body-wrap">*/}
        <div className="chat__body" ref={chatBodyRef}>
          {
            chat.messages.map((message) => {
              const date = new Date(message.date);
              return (
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
                      {`${date.getHours()}:${date.getMinutes()}`}
                    </Typography>
                  </div>

                </div>
              );
            })
          }
        </div>
      {/*</div>*/}
      <div className="chat__input">
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={enterHandler}
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