import 'reflect-metadata/lite';

export function Field(target: symbol | object, propertyKey: string) {
  const attributes = Reflect.getMetadata('modelFields', target) || [];
  attributes.push(propertyKey);
  Reflect.defineMetadata('modelFields', attributes, target);
}

// export interface BaseModelInterface {
//   id?: number; // Optional for auto-incrementing IDs
//   createdAt?: Date; // Optional for timestamps
//   updatedAt?: Date; // Optional for timestamps
// }

// export class BaseModel implements BaseModelInterface {

export class BaseModel {
  @Field static id?: number;
  @Field static createdAt?: Date;
  @Field static updatedAt?: Date;
}
