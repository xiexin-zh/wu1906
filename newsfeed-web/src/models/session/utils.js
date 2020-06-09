import { MAX_CONNECT_COUNT } from './constants';

let tryConnectionCount = 0;
export function shouldTryToConnect() {
  addConnectionCount();
  return tryConnectionCount < MAX_CONNECT_COUNT;
}

function addConnectionCount() {
  tryConnectionCount += 1;
  console.info('reconnecting, number of attempts %s', tryConnectionCount);
}

export function initConnectionCount() {
  tryConnectionCount = 0;
}
