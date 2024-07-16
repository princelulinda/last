import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { Dexie, liveQuery } from 'dexie';

import { Bank, SelectedBank, User, UserApiResponse } from './models';
import { getAllMetadataKeys } from './models/base.model';
import { environment } from '../../../environments/environment';
import { ApiService } from '../services/api/api.service';
import 'reflect-metadata/lite';
import { ClientApiResponse, UserInfoModel } from './models/auth';
import { bankModel } from './models/bank/bank.model';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private dbName = 'main-magis-erp-db';
  public db: Dexie = new Dexie(this.dbName); // TODO : Make this private and use addEvent func
  private modelsDir = './models';
  public dbIsReady: Subject<boolean> = new Subject<boolean>();

  constructor(private apiService: ApiService) {
    this.dbIsReady.next(false);
  }

  async initializeModels() {
    const exist = await Dexie.exists(this.dbName);
    if (!exist) {
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
        const modelTableName: string = (model as { tableName: string })
          .tableName;

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

      this.db.version(environment.appDbVersion).stores(stores);
    }
    // this.db.on('populate', () => this.populate());
    this.db.on('ready', () => {
      console.log(`Database ${this.dbName} is ready`);
      this.dbIsReady.next(true);
    });

    this.db.open();
    // console.log(" ============================== >>> CALLING FROM DB SERVICE");

    // this.populate();
  }
  liveQuery<T>(querier: T | Promise<T>) {
    return liveQuery(() => querier);
  }

  async setUser(data: { user: UserApiResponse; client: ClientApiResponse }) {
    if (data?.user.token !== null) {
      this.setLocalStorageUserToken(data.user.token);
      this.setLocalStorageClientId(data.client.client_id.toString());
      await this.addOnce(User.tableName, data);
    }
  }

  setLocalStorageUserToken(token: string) {
    this.apiService.setLocalToken(token);
  }

  setLocalStorageClientId(clientId: string) {
    this.apiService.setLocalClientId(clientId);
  }

  setLocalStorageBankId(bankId: number) {
    this.apiService.setLocalBankId(bankId);
  }

  async getDbUser(): Promise<UserInfoModel | null> {
    try {
      const userDb = await this.getOnce(User.tableName);
      console.log('db service userDB', userDb);
      return [userDb][0];
    } catch (error) {
      console.error('Error in fetching Db user', error);
      return null;
    }
  }

  // private async checkUser(): Promise<object> {
  //   const localToken = this.apiService.getLocalToken();
  //   const user = await this.getDbUser();

  //   if (!user || (!user && localToken)) {
  //     this.populate();
  //     return this.checkUser();
  //   }

  //   return user;
  // }

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

  // bank Methods
  setUserBanks(banks: bankModel[]) {
    this.addOnce(Bank.tableName, banks);
  }
  setSelectedBank(selectedBank: bankModel) {
    this.addOnce(SelectedBank.tableName, selectedBank);
  }
  async getUserBanks(): Promise<bankModel> {
    return await this.getOnce(Bank.tableName);
  }
  async getSelectedBank(): Promise<bankModel> {
    return await this.getOnce(SelectedBank.tableName);
  }
}
