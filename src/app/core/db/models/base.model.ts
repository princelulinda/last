// export interface BaseModelInterface {
//   id?: number; // Optional for auto-incrementing IDs
//   createdAt?: Date; // Optional for timestamps
//   updatedAt?: Date; // Optional for timestamps
// }

// export class BaseModel implements BaseModelInterface {

export class BaseModel {
  static id?: number;
  static createdAt?: Date;
  static updatedAt?: Date;
}
