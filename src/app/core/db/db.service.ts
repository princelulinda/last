import { Injectable } from '@angular/core';
import { Dexie } from 'dexie';
// import { BaseModel } from './models/base.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private db: Dexie;
  private dbName = 'main-magis-erp-db';
  private modelsDir = './models';

  constructor() {
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
  }

  async populate() {
    // TODO : Put populate here for all populate
    const populatedUser = await this.db.table('users').add({
      username: 'pierreclaverkoko',
      token: 'mytoken1',
    });

    console.log('POPULATED USER : ', populatedUser);
  }
}
