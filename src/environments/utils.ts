export const VERSION = '2.0.1';
export const APPDBVERSION = 1;

interface reusableDataModel {
  production: boolean;
  plateformsUuid: { name: string; uuid: string }[];
  appInfo: string;
  defaultAppSubject: string;
  bigBangId: number;
  publicServicesMerchantCategoryId: number;
  sentryDsn: string;
  sentryTraceRate: number;
  appDbVersion: number;
  activateHttpEncryption: boolean;
}
export interface environmentModel extends reusableDataModel {
  apiUrl: string;
  sentryTargetUrls: (string | RegExp)[];
  websocketUrl?: string;
}

export const environmentConfig: {
  configTest: reusableDataModel;
  configProduction: reusableDataModel;
} = {
  configTest: {
    production: false,
    plateformsUuid: [
      { name: 'newsfeed', uuid: '44793f5f-1bd5-4569-9592-ec8a7c81d022' },
      { name: 'onlinebanking', uuid: '65231163-2099-45e3-95de-0bdfa5882088' },
      { name: 'marketplace', uuid: '28544962-9f7a-4768-adad-66f336251822' },
      { name: 'workstation', uuid: '1e35b443-1076-4971-ae04-85a9272d6ec9' },
    ],
    appInfo: '39a31c07-633e-429e-a602-09500f8d56d2',
    defaultAppSubject: '44793f5f-1bd5-4569-9592-ec8a7c81d022',
    bigBangId: 1,
    publicServicesMerchantCategoryId: 1,
    sentryDsn: 'https://4808bd0c8a72e687fe9af699ab0a05d7@turabe.ihela.online/6',
    sentryTraceRate: 1.0,
    appDbVersion: APPDBVERSION,
    activateHttpEncryption: false,
  },
  configProduction: {
    production: true,
    plateformsUuid: [
      { name: 'newsfeed', uuid: '9c11211d-39cb-472d-ac7c-67820f067706' },
      { name: 'onlinebanking', uuid: 'bafc6065-b332-443b-8444-a811f9a5e6a2' },
      { name: 'marketplace', uuid: 'ef333aab-4887-4f33-baa8-862051151992' },
      { name: 'workstation', uuid: 'bd75a7eb-37a1-4916-a144-54286dfbcc41' },
    ],
    appInfo: '9c11211d-39cb-472d-ac7c-67820f067706',
    defaultAppSubject: '',
    bigBangId: 1,
    publicServicesMerchantCategoryId: 3,
    sentryDsn: 'https://8343ed4cedf1ee0797427869307f4cc1@turabe.ihela.online/7',
    sentryTraceRate: 1.0,
    appDbVersion: APPDBVERSION,
    activateHttpEncryption: true,
  },
};
