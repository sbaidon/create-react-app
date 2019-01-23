export default class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ClientError';

    // Workaround for https://github.com/istanbuljs/istanbuljs/issues/139
    this.constructor = ClientError;
    this.__proto__ = ClientError.prototype; //eslint-disable-line
    // End Workaround

    // istanbul ignore next
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ClientError);
    }
  }
}
