module.exports = {
  verbose: true,
  testURL: "http://localhost/",
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "identity-obj-proxy",
    // "services/channel$": "<rootDir>/__mocks__/channel.js",
    "testUtil": "<rootDir>/src/utils/testUtil",
    "testMock/(.*)$": "<rootDir>/__mocks__/$1",
    "assets/(.*)$": "<rootDir>/src/assets/$1",
    "^utils/(.*)$": "<rootDir>/src/utils/$1"
  },
  "globals": {
    "APP_VERSION": false,
    "CLIENT_ID": false
  }
}
