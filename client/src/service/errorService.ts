import {ServerError} from 'shared';
import store from "../store";
import {setError} from '../store/actions';

export default class ErrorService {
  constructor() {
    window.onerror = (event, source, lineno, colno, error) => {
      this.throwError(error);
    };
    window.onunhandledrejection = (event: PromiseRejectionEvent) => {
      this.throwError(event.reason);
    }
  }

  private throwError(error: unknown) {
    let statusCode;
    let message;
    let showType;
    if (error instanceof ServerError) {
      statusCode = error.code;
      message = error.message;
    } else if (error instanceof Error){
      message = error.message;
    }
    if (statusCode === 404 || statusCode === 403 || statusCode === 401) {
      showType = 'page';
    } else {
      showType = 'popWindow';
    }
    store.dispatch(setError(true, showType, message, statusCode))
  }
}
