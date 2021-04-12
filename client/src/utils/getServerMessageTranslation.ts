import {serverErrorMessages} from "shared";

export default function getServerMessageTranslation(serverMessage: string | null, t: any) {
  let message;

  Object.keys(serverErrorMessages).forEach((serverErrorKey) => {
    if (serverMessage === serverErrorMessages[serverErrorKey]) {
      message = t(`error.${serverErrorKey}`);
    }
  });

  return message ? message : serverMessage;
}