import en_US from '../langConfig/en_US.js';
import zh_CN from '../langConfig/zh_CN.js';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import { addLocaleData } from 'react-intl';
addLocaleData([...en, ...zh]);

const LANGUAGE_MAP = new Map([['zh', zh_CN], ['en', en_US]]);

const LANGUAGE_LIST = [...LANGUAGE_MAP.keys()];

const DEFAULT_LANGUAGE = 'zh';

export { LANGUAGE_MAP, LANGUAGE_LIST, DEFAULT_LANGUAGE };
