export type ColumnType =
  | "INT"
  | "DECIMAL"
  | "VARCHAR"
  | "DATE"
  | "BOOLEAN"
  | "UUID"
  | "EMAIL"
  | "ADDRESS"
  | "PHONE";

export interface Column {
  name: string;
  type: ColumnType;
}

export interface ColumnFormProps {
  column: Column;
  index: number;
  updateColumn: (index: number, field: keyof Column, value: string) => void; // void means the function doesn't return anything
  removeColumn: (index: number) => void;
}
