export default class ErrorService {
  constructor() {
    window.onerror = (event, source, lineno, colno, error) => {
      this.throwError(event, source, lineno, colno, error);
    };
  }

  throwError = (event: Event | string, source: string | undefined, lineno: number | undefined, colno: number | undefined, error: Error | undefined) => {
    console.log(error);
  }
}
