import { environmentModel, environmentConfig } from './utils';

export const environment: environmentModel = {
  apiUrl: 'https://assets.ihela.bi/api/v1',
  websocketUrl: 'ws://assets.ihela.bi/',
  ...environmentConfig.configProduction,
  sentryTargetUrls: [
    /https:\/\/ihela\.bi/,
    /https:\/\/assets\.ihela\.bi\/api\/v1/,
  ],
};
