import { environmentConfig, environmentModel } from './utils';

export const environment: environmentModel = {
  apiUrl: 'http://10.30.0.12/api/v1',
  websocketUrl: 'ws://10.30.0.12/',
  ...environmentConfig.configProduction,
  sentryTargetUrls: [/10\.30\.0\.12\/api\/v1/],
};
