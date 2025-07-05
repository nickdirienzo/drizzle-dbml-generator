import type { AnyColumn, Table, Relations } from 'drizzle-orm';
import type { ForeignKey, Index, PgEnum, PrimaryKey, UniqueConstraint } from 'drizzle-orm/pg-core';
import type {
  AnyInlineForeignKeys,
  TableName,
  Schema as SchemaSymbol,
  ExtraConfigBuilder,
  ExtraConfigColumns
} from './symbols';

export type AnyTable = Table['_']['columns'] & {
  [AnyInlineForeignKeys]: ForeignKey[];
  [TableName]: string;
  [SchemaSymbol]: string | undefined;
  [ExtraConfigBuilder]:
    | ((self: Record<string, AnyColumn>) => Record<string, AnyBuilder>)
    | undefined;
  [ExtraConfigColumns]: Record<string, AnyColumn> | undefined;
};

type BuilderFn = (table: AnyTable) => UniqueConstraint | PrimaryKey | ForeignKey | Index;
export function isBuilderFn(val: unknown): val is BuilderFn {
  return typeof val === 'function';
}

type BuilderObj = { build: BuilderFn };
export function isBuilderObj(val: unknown): val is BuilderObj {
  return typeof val === 'object' && val !== null && typeof (val as any).build === 'function';
}

/** In drizzle-orm 0.40+, pgTable is now an array of keyed Builder objects. */
export type BuilderRecord = Record<string, BuilderObj>;
export function isBuilderRecord(val: unknown): val is BuilderRecord {
  if (typeof val !== 'object' || val === null) return false;

  // Make sure that every value in the record is a BuilderObj.
  return Object.values(val).every(
    (entry) =>
      typeof entry === 'object' && entry !== null && typeof (entry as any).build === 'function'
  );
}

export type AnyBuilder = BuilderObj | BuilderRecord;
export type Options<Schema> = {
  schema: Schema;
  out?: string;
  relational?: boolean;
};

type Schema<DialectTypes = NonNullable<unknown>> = Record<
  string,
  DialectTypes | Relations | AnyTable | Table
>;
export type AnySchema = Schema;
export type PgSchema = Schema<PgEnum<[string, ...string[]]>>;
export type MySqlSchema = Schema;
export type SQLiteSchema = Schema;
