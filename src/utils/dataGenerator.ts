import { faker } from "@faker-js/faker";
import type { Column, ColumnType } from "../types";

const generateValue = (type: ColumnType): string => {
  switch (type) {
    case "INT":
      return String(faker.number.int({ min: 1, max: 1000 }));

    case "DECIMAL":
      return String(faker.finance.amount());

    case "VARCHAR":
      return `'${faker.person.firstName()}'`;

    case "EMAIL":
      return `'${faker.internet.email()}'`;

    case "PHONE":
      return `'${faker.phone.number()}'`;

    case "DATE":
      return `'${faker.date.past().toISOString().split("T")[0]}'`;

    case "BOOLEAN":
      return faker.datatype.boolean() ? "1" : "0";

    case "UUID":
      return `'${faker.string.uuid()}'`;
    
    case "ADDRESS":
      return `'${faker.location.streetAddress()}'`;

    default:
      return "NULL";
  }
};

export const generateSQL = (
  tableName: string,
  columns: Column[],
  rowCount: number,
): string => {
  const safeTableName = tableName.trim() || "unknown_table";
  const fieldNames = columns.map((column) => column.name.trim() || "column");

  const rows = Array.from({ length: rowCount }, () => {
    const values = columns.map((column) => generateValue(column.type));
    return `(${values.join(", ")})`;
  });

  return `INSERT INTO ${safeTableName} (${fieldNames.join(", ")}) VALUES\n${rows.join(",\n")};`;
};
