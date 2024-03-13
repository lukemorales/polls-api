import { type $Type, type ColumnBuilderBase } from 'drizzle-orm';
import { customType } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

declare const brandedId: unique symbol;

export type BrandedId<Entity extends string> = string & {
  [brandedId]: `${Entity}_${string}`;
};

export type ExtractBrandedId<
  T extends { $ref: (...args: any[]) => $Type<ColumnBuilderBase, unknown> },
> = ReturnType<T['$ref']>['_']['$type'];

export function entityId<Prefix extends string>(prefix: Prefix) {
  const brandedIdType = customType<{
    data: string;
    notNull: true;
    default: false;
  }>({
    dataType() {
      return 'varchar';
    },
    fromDriver(value) {
      return `${prefix}_${value}`;
    },
    toDriver(value) {
      return value.split(/_/gi).slice(-1).join();
    },
  });

  function buildPrimary<ColumnName extends string>(columnName: ColumnName) {
    return brandedIdType(columnName)
      .primaryKey()
      .$default(ulid)
      .$type<BrandedId<Prefix>>();
  }

  buildPrimary.$ref = <ColumnName extends string>(columnName: ColumnName) =>
    brandedIdType(columnName).$type<BrandedId<Prefix>>();

  return buildPrimary;
}
