// import { fromJS, List } from 'immutable';
import warning from 'warning';
import createWsModel from './createWsModel';
import { Message } from './interface';
import { NewsFeedMessage, NewsFeedMessageData } from './interfaceNewsFeed';
import newsFeedHandlers from './newsFeedHandlers';
import { updateSelf } from '../members/actions';
import { kickWebUser, kickoutDevices } from '../session/actions';

const ShouldBeTrue = process.env.NODE_ENV !== 'production';

const newsFeed = (data: NewsFeedMessageData) => {
  const { messageType } = data;
  const handler = newsFeedHandlers[messageType.toLowerCase()];
  if (handler) {
    return handler(data);
  } else {
    warning(false, 'Unhandled news_feed message type: %s', messageType);
    return {
      type: '__unknown',
    };
  }
};

const handlers = {
  news_feed(message: NewsFeedMessage) {
    return newsFeed({
      ...message.data,
      createTs: message.ts,
    });
  },
  update_self(message: Message) {
    return updateSelf(message.data);
  },
  kick_web_user(message: Message) {
    return kickWebUser(message.data);
  },
  kickout_devices(message: Message) {
    return kickoutDevices(message.data);
  },
};

const chatWsModel = createWsModel({
  eventHandler(dispatch: Function, message: Message) {
    const type = message.type;
    // FIXME: del
    if (!message.type) {
      console.log('unknown ws:', message);
      return;
    }

    const handler = handlers[type.toLowerCase()];
    if (handler) {
      const action = handler(message);
      if (Array.isArray(action)) {
        action.forEach((a) => dispatch(a));
      } else {
        dispatch(action);
      }
    } else if (ShouldBeTrue) {
      warning(false, 'Unhandled RTM message type: %s', type);
    }
  },

  extraEffects: {
    *updateMessage({ payload }, {}) {},

    *pushMessage({ payload }, {}) {},

    *resendMessage({ payload }, {}) {},
  },
});

export default chatWsModel;
