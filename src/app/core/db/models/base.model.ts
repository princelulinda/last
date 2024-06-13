import 'reflect-metadata/lite';

// export function Field(target: symbol | object, propertyKey: string) {
//   const attributes = Reflect.getMetadata('modelFields', target) || [];
//   attributes.push(propertyKey);
//   Reflect.defineMetadata('modelFields', attributes, target);
// }

// export interface BaseModelInterface {
//   id?: number; // Optional for auto-incrementing IDs
//   createdAt?: Date; // Optional for timestamps
//   updatedAt?: Date; // Optional for timestamps
// }

// export class BaseModel implements BaseModelInterface {

const baseModelFields = Symbol('baseModelFields');
const metadataKeyPrefix = 'metadataKey_';

export class BaseModel {
  static id?: number;
  static serverId?: number;
  static createdAt?: Date;
  static updatedAt?: Date;

  constructor() {
    const fields = Reflect.getMetadata(baseModelFields, this) || [];
    fields.push(...Object.getOwnPropertyNames(this));
    Reflect.defineMetadata(baseModelFields, fields, this);
  }
}

export function Field(key?: string): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const metadataKey = key || baseModelFields;

    const attributes = Reflect.getMetadata(metadataKey, target) || [];
    attributes.push(propertyKey);
    Reflect.defineMetadata(metadataKey, attributes, target);

    // Store the metadata key itself under a special key for later retrieval
    Reflect.defineMetadata(
      `${metadataKeyPrefix}${String(propertyKey)}`,
      metadataKey,
      target
    );
  };
}

export function getAllMetadataKeys(target: object): string[] {
  return Reflect.getMetadataKeys(target);
}

// export function getMetadataKeyForProperty(
//   target: object,
//   propertyKey: string | symbol
// ): string | undefined {
//   return Reflect.getMetadata(
//     `${metadataKeyPrefix}${String(propertyKey)}`,
//     target
//   );
// }

// export function getPropertiesForMetadataKey(
//   target: object,
//   metadataKey: string
// ): (string | symbol)[] {
//   return Reflect.getMetadata(metadataKey, target) || [];
// }
