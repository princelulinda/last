export interface DissectedDateModel {
  year: number;
  month: number;
  day: number;
}
export interface StatementModel {
  date_created: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  solde: number;
}
