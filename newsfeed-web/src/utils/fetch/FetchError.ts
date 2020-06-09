import get from 'lodash/get';
import { AxiosResponse } from 'axios';

export class ResponseError extends Error {
  protected status: number;
  protected data: object | undefined;
  protected response: AxiosResponse;

  constructor(response: AxiosResponse) {
    const { status, statusText, data } = response;
    const errorMessage = get(data, 'error', statusText);
    super(errorMessage);
    this.status = status;
    this.data = data;
    this.response = response;
  }
}

export class UnusualCodeError extends ResponseError {
  protected code: number | undefined;

  constructor(response: AxiosResponse, code: number) {
    super(response);
    this.code = code;
  }
}
