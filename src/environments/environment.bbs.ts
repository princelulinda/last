import { environmentConfig, environmentModel } from './utils';

export const environment: environmentModel = {
  apiUrl: 'http://10.30.1.42/api/v1',
  websocketUrl: 'ws://10.30.1.42/',
  ...environmentConfig.configTest,
  sentryTargetUrls: [/http:\/\/10\.30\.1\.42\/api\/v1/],
};
