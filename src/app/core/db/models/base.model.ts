import 'reflect-metadata/lite';

export function Field(target: symbol | object, propertyKey: string) {
  const metaTarget = `${(target as { tableName: string }).tableName}ModelFields`;
  const attributes = Reflect.getMetadata(metaTarget, target) || [];
  attributes.push(propertyKey);
  console.log(
    `Registered simple '${propertyKey}' in table '`,
    target,
    "' (",
    attributes,
    ')'
  );
  Reflect.defineMetadata(metaTarget, attributes, target);
}

export function UniqueField(target: symbol | object, propertyKey: string) {
  const metaTarget = `${(target as { tableName: string }).tableName}ModelUniqueFields`;
  const attributes = Reflect.getMetadata(metaTarget, target) || [];
  attributes.push(propertyKey);
  console.log(
    `Registered unique '${propertyKey}' in table '`,
    target,
    `' with metadata : ${metaTarget} (`,
    attributes,
    ')'
  );
  Reflect.defineMetadata(metaTarget, attributes, target);
}

export function MultiField(target: symbol | object, propertyKey: string) {
  const metaTarget = `${(target as { tableName: string }).tableName}ModelMultiFields`;
  const attributes = Reflect.getMetadata(metaTarget, target) || [];
  attributes.push(propertyKey);
  console.log(
    `Registered multi '${propertyKey}' in table '`,
    target,
    "' (",
    attributes,
    ')'
  );
  Reflect.defineMetadata(metaTarget, attributes, target);
}

export function getAllMetadataKeys(
  metadataKey: string,
  target: object
): string[] {
  return Reflect.getMetadata(metadataKey, target);
}

// export interface BaseModelInterface {
//   id?: number; // Optional for auto-incrementing IDs
//   createdAt?: Date; // Optional for timestamps
//   updatedAt?: Date; // Optional for timestamps
// }

// export class BaseModel implements BaseModelInterface {

export class BaseModel {
  @Field static id?: number;
  @UniqueField static serverId?: number;
  @Field static createdAt?: Date;
  @Field static updatedAt?: Date;
}
