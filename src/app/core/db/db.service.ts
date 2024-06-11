import { Injectable } from '@angular/core';
import { Dexie, liveQuery } from 'dexie';
import { UserApiResponse } from './models';
import { environment } from '../../../environments/environment';
import { ApiService } from '../services/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private db: Dexie;
  private dbName = 'main-magis-erp-db';
  private modelsDir = './models';
  public liveQuery = liveQuery;

  constructor(private apiService: ApiService) {
    this.db = new Dexie(this.dbName);
    this.initializeModels();
  }

  async initializeModels() {
    // Assuming models are loaded dynamically (replace with your loading logic)
    const rawModelsModule: object = await import('./models');
    const modelsModule: Record<string, object> = rawModelsModule as Record<
      string,
      object
    >;

    console.log(
      'FOUND DB MODELS :',
      modelsModule,
      'RAW :',
      rawModelsModule,
      'ALL :'
    );

    const stores: Record<string, string> = {};
    for (const [rawModelName, model] of Object.entries(modelsModule)) {
      // TODO : MAKE
      // if (model instanceof BaseModel) {
      const modelName: string = rawModelName.toLowerCase() + 's'; // Pluralize for store name

      console.log(
        `|== ADDING MODEL : ${modelName} > ${rawModelName} > ${model}`
      );

      const getSchema = () => {
        const schema: string[] = [];

        console.log(`==== BEFORE ADDING PROPS TO MODEL : ${modelName}`);
        const commonJsClassPropToExclude: string[] = [
          'constructor',
          'id',
          'prototype',
          // 'length',
        ];
        // Access class attribute names after class definition
        const propNames =
          Reflect.getMetadata(
            'modelFields',
            model as Record<string, string>
          ).filter(
            (key: string | symbol) =>
              !commonJsClassPropToExclude.includes(key as string)
          ) || [];
        console.log(
          `======> FOUND PROPS '${propNames}' FOR MODEL CLASS '${modelName}'`
        );

        for (const prop of propNames) {
          console.log(
            `========> ADDING PROP '${String(prop)}' TO MODEL '${modelName}'`
          );
          schema.push(prop as string);
        }

        if (Array.isArray(schema) && schema.length) {
          return `++id, ${(schema as string[]).join(', ')}`;
        } else {
          return '++id';
        }
      };

      stores[modelName] = getSchema();
      // } // END OF  CHECK : model instanceof BaseModel
    }

    console.log(`INITIALIZING DB STORES : `, stores);

    await this.db.version(environment.appDbVersion).stores(stores);

    this.db.on('populate', () => this.populate());

    this.db.open();
    // console.log(" ============================== >>> CALLING FROM DB SERVICE");

    // this.populate();
  }

  async populate() {
    const localToken = this.apiService.getLocalToken();
    const dbUser = await this.getDbUser();
    console.log('DB USER CHECK : ', dbUser, localToken);
    // if (localToken && !dbUser) {
    if (localToken !== null) {
      this.apiService.get('/client/user/populate/').subscribe(data => {
        console.log('POPULATED USER USER : ', data);
        const populateData = (
          data as {
            object: {
              user: UserApiResponse;
              client: {
                client_full_name: string;
                client_phone_number: string;
                client_code: number;
                has_pin: boolean;
              };
            };
          }
        ).object;
        console.log(
          'POPULATED USER USER : ',
          populateData,
          ' DATA : ',
          populateData.user,
          populateData.client
        );
        this.setUser({
          username: populateData.user.username,
          email: populateData.user.email,
          full_name: populateData.client.client_full_name,
          has_pin: populateData.client.has_pin,
          ihela_code: populateData.client.client_code,
          phone_number: populateData.client.client_phone_number,
          token: populateData.user.token,
          fcm_data: {},
          device_data: {},
        });
      });
    }
    // TODO : Put populate here for all populate
    // const populatedUser = await this.db.table('users').add({
    //   username: 'pierreclaverkoko',
    //   token: 'mytoken1',
    // });

    // console.log('POPULATED USER : ', populatedUser);
  }

  async setUser(data: UserApiResponse) {
    console.log('ADDING USER USER : ', data, data?.token);
    if (data?.token !== null) {
      console.log('ADDING USER TOKEN : ', data.token);
      this.apiService.setLocalToken(data.token);
      await this.add('users', {
        username: data.username,
        email: data.email,
        fullName: data.full_name,
        hasPin: data.has_pin,
        ihelaCode: data.ihela_code,
        phoneNumber: data.phone_number,
        userToken: data.token,
        fcmData: data.fcm_data,
        deviceData: data.device_data,
      });
    }
  }

  async getDbUser() {
    return this.liveQuery(async () => {
      await this.db.table('users').where({ id: 1 }).toArray();
    });
  }

  async getUser(): Promise<object> {
    const localToken = this.apiService.getLocalToken();
    const user = await this.getDbUser();

    if (!user && localToken) {
      this.populate();

      return this.getUser();
    }

    return user;
  }

  // Help : data requires IndexableTypes : https://dexie.org/docs/Indexable-Type
  get(tableName: string, data: string | string[]) {
    return this.liveQuery(async () => {
      this.db.table(tableName).get(data);
    });
  }

  where(tableName: string, data: string | string[]) {
    return this.liveQuery(async () => {
      this.db.table(tableName).where(data);
    });
  }

  add(tableName: string, data: object) {
    return this.db.table(tableName).add(data);
  }

  update(tableName: string, id: number, data: object) {
    return this.db.table(tableName).update(id, data);
  }
}
