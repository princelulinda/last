import { environmentConfig, environmentModel } from './utils';

export const environment: environmentModel = {
  apiUrl: 'http://127.0.0.1:8000/api/v1',
  websocketUrl: 'ws://127.0.0.1:8000/',
  ...environmentConfig.configTest,
  sentryTargetUrls: [/http:\/\/127\.0\.0\.1\:8000\/api\/v1/],
};
