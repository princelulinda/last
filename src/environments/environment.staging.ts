import { environmentConfig, environmentModel } from './utils';

export const environment: environmentModel = {
  apiUrl: 'https://assets.ihela.bi/testcbs/api/v1',
  websocketUrl: 'ws://assets.ihela.bi/testcbs/',
  ...environmentConfig.configTest,
  sentryTargetUrls: [
    /https:\/\/test\.ihela\.bi/,
    /https:\/\/assets\.ihela\.bi\/testcbs\/api\/v1/,
  ],
};
