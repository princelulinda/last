import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { Dexie, liveQuery } from 'dexie';

import { UserApiResponse } from './models';
import { getAllMetadataKeys } from './models/base.model';
import { environment } from '../../../environments/environment';
import { ApiService } from '../services/api/api.service';
import 'reflect-metadata/lite';
import { ClientApiResponse } from './models/auth';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  public db: Dexie; // TODO : Make this private and use addEvent func
  private dbName = 'main-magis-erp-db';
  private modelsDir = './models';
  public dbIsReady: Subject<boolean> = new Subject<boolean>();

  constructor(private apiService: ApiService) {
    this.db = new Dexie(this.dbName);
    this.dbIsReady.next(false);
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
      // CHECK INSTANCE OF BASE MODEL
      // if (modelInstance instanceof BaseModel) {
      const modelTableName: string = (model as { tableName: string }).tableName;

      const metadataName = `${modelTableName}ModelFields`;
      const uniqueMetadataName = `${modelTableName}ModelUniqueFields`;
      const multiMetadataName = `${modelTableName}ModelMultiFields`;

      console.log(
        `|== ADDING MODEL : ${modelTableName} || ${metadataName} > ${rawModelName} > ${model}`
      );
      console.log(
        '==== METADATA NAMES :: ',
        metadataName,
        uniqueMetadataName,
        multiMetadataName
      );

      const getSchema = () => {
        const schema: string[] = [];

        console.log(`==== BEFORE ADDING PROPS TO MODEL : ${modelTableName}`);
        const commonJsClassPropToExclude: string[] = [
          'constructor',
          'id',
          'prototype',
          // 'length',
        ];
        // ------------------------------
        // const propNames: (string|any)[] = Reflect.ownKeys(model as Record<string, any>).filter((key: any) => !commonJsClassPropToExclude.includes(key) && typeof model[key] !== 'function');
        // ------------------------------
        // const propNames: (string | symbol)[] = Reflect.ownKeys(
        //   model as Record<string, string>
        // ).filter(
        //   (key: string | symbol) =>
        //     !commonJsClassPropToExclude.includes(key as string)
        // );
        // ------------------------------
        // Access class attribute names after class definition

        // NORMAL PROPS

        const propNames =
          getAllMetadataKeys(
            metadataName,
            model as Record<string, string>
          )?.filter(
            (key: string | symbol) =>
              !commonJsClassPropToExclude.includes(key as string)
          ) || [];
        console.log(
          `======> FOUND PROPS '${propNames}' FOR MODEL CLASS '${modelTableName}'`
        );

        for (const prop of propNames) {
          console.log(
            `========> ADDING PROP '${String(prop)}' TO MODEL '${modelTableName}'`
          );
          schema.push(prop as string);
        }

        // UNIQUE PROPS

        const uniquePropNames =
          getAllMetadataKeys(
            uniqueMetadataName,
            model as Record<string, string>
          )?.filter(
            (key: string | symbol) =>
              !commonJsClassPropToExclude.includes(key as string)
          ) || [];
        console.log(
          `======> FOUND UNIQUE PROPS '${uniquePropNames}' FOR MODEL CLASS '${modelTableName}'`
        );

        for (const u_prop of uniquePropNames) {
          console.log(
            `========> ADDING UNIQUE PROP '${String(u_prop)}' TO MODEL '${modelTableName}'`
          );
          schema.push(`&${u_prop}` as string);
        }

        // MULTI PROPS

        const multiPropNames =
          getAllMetadataKeys(multiMetadataName, model)?.filter(
            (key: string | symbol) =>
              !commonJsClassPropToExclude.includes(key as string)
          ) || [];
        console.log(
          `======> FOUND MULTI PROPS '${multiPropNames}' FOR MODEL CLASS '${modelTableName}'`
        );

        for (const m_prop of multiPropNames) {
          console.log(
            `========> ADDING MULTI PROP '${String(m_prop)}' TO MODEL '${modelTableName}'`
          );
          schema.push(`*${m_prop}` as string);
        }

        if (Array.isArray(schema) && schema.length) {
          return `++id, ${(schema as string[]).join(', ')}`;
        } else {
          return '++id';
        }
      };

      stores[modelTableName] = getSchema();
      // } // END OF  CHECK : model instanceof BaseModel
    }

    console.log(`INITIALIZING DB STORES : `, stores);

    await this.db.version(environment.appDbVersion).stores(stores);

    this.db.on('populate', () => this.populate());
    this.db.on('ready', () => {
      console.log(`Database ${this.dbName} is ready`);
      this.dbIsReady.next(true);
    });

    this.db.open();
    // console.log(" ============================== >>> CALLING FROM DB SERVICE");

    this.populate();
  }

  // addEvent(eventName: string, callback: Function) {
  //   // this.db.on(eventName, () => callback());
  // }

  liveQuery<T>(querier: T | Promise<T>) {
    return liveQuery(() => querier);
  }

  async populate(): Promise<void> {
    const localToken = this.apiService.getLocalToken();
    const dbUser = await this.getDbUser();
    console.log('DB USER CHECK : ', dbUser, localToken);
    // if (localToken && !dbUser) {
    if (localToken !== null) {
      this.apiService.get('/client/user/populate/').subscribe({
        next: data => {
          console.log('POPULATED USER USER : ', data);
          const populateData = (
            data as {
              object: {
                user: UserApiResponse;
                client: ClientApiResponse;
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
          const userInfo: { user: UserApiResponse; client: ClientApiResponse } =
            {
              user: {
                username: populateData.user.username,
                token: populateData.user.token,
                fcm_data: {},
                device_data: {},
              },
              client: {
                id: populateData.client.id,
                client_id: populateData.client.client_id,
                client_code: populateData.client.client_code,
                client_email: populateData.client.client_email,
                client_full_name: populateData.client.client_full_name,
                client_phone_number: populateData.client.client_phone_number,
                client_type: populateData.client.client_type,
                has_pin: populateData.client.has_pin,
                is_agent: populateData.client.is_agent,
                is_merchant: populateData.client.is_merchant,
                is_partner_bank: populateData.client.is_partner_bank,
                picture_url: populateData.client.picture_url,
                prefered_language: populateData.client.prefered_language,
              },
            };
          this.setUser(userInfo);
        },
        error: err => {
          console.log(err);
        },
      });
    }
  }

  async setUser(data: { user: UserApiResponse; client: ClientApiResponse }) {
    if (data?.user.token !== null) {
      this.setLocalStorageUserToken(data.user.token);
      await this.addOnce('users', data);
    }
  }

  setLocalStorageUserToken(token: string) {
    this.apiService.setLocalToken(token);
  }

  private async getDbUser() {
    try {
      const userDb = await this.getOnce('users');
      return [userDb];
    } catch (error) {
      console.error('Error in fetching Db user', error);
      return [];
    }
  }

  private async checkUser(): Promise<object> {
    const localToken = this.apiService.getLocalToken();
    const user = await this.getDbUser();

    if (!user || (!user && localToken)) {
      this.populate();
      return this.checkUser();
    }

    return user;
  }

  // Help : data requires IndexableTypes : https://dexie.org/docs/Indexable-Type
  get(tableName: string, data: string | string[] | number) {
    return this.db.table(tableName).get(data);
  }

  getOnce(tableName: string) {
    return this.db.table(tableName).orderBy(':id').first();
  }

  getTable(tableName: string): Promise<unknown[]> {
    return this.db.table(tableName).toArray();
  }

  getTableCount(tableName: string): Promise<number> {
    return this.db.table(tableName).count();
  }

  where(tableName: string, data: string | string[]) {
    this.db.table(tableName).where(data);
  }

  add(tableName: string, data: object) {
    return this.db.table(tableName).add(data);
  }

  async addOnce(tableName: string, data: object) {
    const count = await this.db.table(tableName).count();

    if (!count) {
      return this.add(tableName, data);
    }
    return null;
  }

  async addOnceUpdate(tableName: string, data: object) {
    const row = await this.db.table(tableName).orderBy(':id').first();

    if (!row) {
      this.add(tableName, data);
    } else {
      this.update(tableName, row.id, data);
    }
  }

  update(tableName: string, id: number, data: object) {
    return this.db.table(tableName).update(id, data);
  }
}
