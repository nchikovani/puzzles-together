import React from 'react';
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVk, faFacebookF, faOdnoklassniki } from "@fortawesome/free-brands-svg-icons";
import './style.scss';
import {IStore} from "../../../../store/store.types";
import {connect} from "react-redux";
import {useTranslation} from "react-i18next";

library.add(faVk, faFacebookF, faOdnoklassniki);
interface IShareProps {
  roomName: string | null;
  roomId: string | null;
}

const Share: React.FC<IShareProps> = ({roomName, roomId}) => {
  const {t} = useTranslation();
  const openWindow = (e:  React.MouseEvent<HTMLAnchorElement, MouseEvent>, url: string) => {
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000`;
    e.preventDefault();
    window.open(url, "", params);
  }

  const url = window.location.href;
  const title = `${roomName || roomId} - ${t("common.appName")}`;

  const socials = [
    {
      class: "vk",
      title: "Вконтакте",
      url: `https://vk.com/share.php?url=${url}&title=${title}`,
      icon: <FontAwesomeIcon icon={['fab', 'vk']} />
    },
    {
      class: "facebook",
      title: "Facebook",
      url: `https://www.facebook.com/sharer.php?u=${url}`,
      icon: <FontAwesomeIcon icon={['fab', 'facebook-f']} />
    },
    {
      class: "odnoklassniki",
      title: "Одноклассники",
      url: `https://connect.ok.ru/offer?url=${url}&title=${title}`,
      icon: <FontAwesomeIcon icon={['fab', 'odnoklassniki']} />
    }
  ];

  return (
    <div className="room-control-share">
      <ul className="room-control-share__social-list">
        {
          socials.map((social) =>
            <li key={social.class} className="room-control-share__social-item">
              <a
                className={`room-control-share__social-link ${social.class}`}
                href={social.url}
                target="_blank"
                rel="noreferrer noopener"
                title={social.title}
                onClick={(e) => openWindow(e, social.url)}
              >{social.icon}</a>
            </li>
          )
        }
      </ul>
{/*//*/}
    </div>
  )
}

const mapStateToProps = (store: IStore) => {
  return {
    roomName: store.room.name,
    roomId: store.room.id,
  }
}

export default connect(mapStateToProps)(Share);