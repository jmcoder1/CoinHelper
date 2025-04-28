
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Guild
 * 
 */
export type Guild = $Result.DefaultSelection<Prisma.$GuildPayload>
/**
 * Model GuildActivity
 * 
 */
export type GuildActivity = $Result.DefaultSelection<Prisma.$GuildActivityPayload>
/**
 * Model GuildChannel
 * 
 */
export type GuildChannel = $Result.DefaultSelection<Prisma.$GuildChannelPayload>
/**
 * Model GuildCurrency
 * 
 */
export type GuildCurrency = $Result.DefaultSelection<Prisma.$GuildCurrencyPayload>
/**
 * Model GuildRemovalReason
 * 
 */
export type GuildRemovalReason = $Result.DefaultSelection<Prisma.$GuildRemovalReasonPayload>
/**
 * Model GuildRole
 * 
 */
export type GuildRole = $Result.DefaultSelection<Prisma.$GuildRolePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Guilds
 * const guilds = await prisma.guild.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Guilds
   * const guilds = await prisma.guild.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.guild`: Exposes CRUD operations for the **Guild** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Guilds
    * const guilds = await prisma.guild.findMany()
    * ```
    */
  get guild(): Prisma.GuildDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.guildActivity`: Exposes CRUD operations for the **GuildActivity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GuildActivities
    * const guildActivities = await prisma.guildActivity.findMany()
    * ```
    */
  get guildActivity(): Prisma.GuildActivityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.guildChannel`: Exposes CRUD operations for the **GuildChannel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GuildChannels
    * const guildChannels = await prisma.guildChannel.findMany()
    * ```
    */
  get guildChannel(): Prisma.GuildChannelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.guildCurrency`: Exposes CRUD operations for the **GuildCurrency** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GuildCurrencies
    * const guildCurrencies = await prisma.guildCurrency.findMany()
    * ```
    */
  get guildCurrency(): Prisma.GuildCurrencyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.guildRemovalReason`: Exposes CRUD operations for the **GuildRemovalReason** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GuildRemovalReasons
    * const guildRemovalReasons = await prisma.guildRemovalReason.findMany()
    * ```
    */
  get guildRemovalReason(): Prisma.GuildRemovalReasonDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.guildRole`: Exposes CRUD operations for the **GuildRole** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GuildRoles
    * const guildRoles = await prisma.guildRole.findMany()
    * ```
    */
  get guildRole(): Prisma.GuildRoleDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Guild: 'Guild',
    GuildActivity: 'GuildActivity',
    GuildChannel: 'GuildChannel',
    GuildCurrency: 'GuildCurrency',
    GuildRemovalReason: 'GuildRemovalReason',
    GuildRole: 'GuildRole'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "guild" | "guildActivity" | "guildChannel" | "guildCurrency" | "guildRemovalReason" | "guildRole"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Guild: {
        payload: Prisma.$GuildPayload<ExtArgs>
        fields: Prisma.GuildFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuildFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuildFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>
          }
          findFirst: {
            args: Prisma.GuildFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuildFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>
          }
          findMany: {
            args: Prisma.GuildFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>[]
          }
          create: {
            args: Prisma.GuildCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>
          }
          createMany: {
            args: Prisma.GuildCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuildCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>[]
          }
          delete: {
            args: Prisma.GuildDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>
          }
          update: {
            args: Prisma.GuildUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>
          }
          deleteMany: {
            args: Prisma.GuildDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuildUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GuildUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>[]
          }
          upsert: {
            args: Prisma.GuildUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>
          }
          aggregate: {
            args: Prisma.GuildAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuild>
          }
          groupBy: {
            args: Prisma.GuildGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuildGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuildCountArgs<ExtArgs>
            result: $Utils.Optional<GuildCountAggregateOutputType> | number
          }
        }
      }
      GuildActivity: {
        payload: Prisma.$GuildActivityPayload<ExtArgs>
        fields: Prisma.GuildActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuildActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuildActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildActivityPayload>
          }
          findFirst: {
            args: Prisma.GuildActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuildActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildActivityPayload>
          }
          findMany: {
            args: Prisma.GuildActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildActivityPayload>[]
          }
          create: {
            args: Prisma.GuildActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildActivityPayload>
          }
          createMany: {
            args: Prisma.GuildActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuildActivityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildActivityPayload>[]
          }
          delete: {
            args: Prisma.GuildActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildActivityPayload>
          }
          update: {
            args: Prisma.GuildActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildActivityPayload>
          }
          deleteMany: {
            args: Prisma.GuildActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuildActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GuildActivityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildActivityPayload>[]
          }
          upsert: {
            args: Prisma.GuildActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildActivityPayload>
          }
          aggregate: {
            args: Prisma.GuildActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuildActivity>
          }
          groupBy: {
            args: Prisma.GuildActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuildActivityGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuildActivityCountArgs<ExtArgs>
            result: $Utils.Optional<GuildActivityCountAggregateOutputType> | number
          }
        }
      }
      GuildChannel: {
        payload: Prisma.$GuildChannelPayload<ExtArgs>
        fields: Prisma.GuildChannelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuildChannelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildChannelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuildChannelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildChannelPayload>
          }
          findFirst: {
            args: Prisma.GuildChannelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildChannelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuildChannelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildChannelPayload>
          }
          findMany: {
            args: Prisma.GuildChannelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildChannelPayload>[]
          }
          create: {
            args: Prisma.GuildChannelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildChannelPayload>
          }
          createMany: {
            args: Prisma.GuildChannelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuildChannelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildChannelPayload>[]
          }
          delete: {
            args: Prisma.GuildChannelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildChannelPayload>
          }
          update: {
            args: Prisma.GuildChannelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildChannelPayload>
          }
          deleteMany: {
            args: Prisma.GuildChannelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuildChannelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GuildChannelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildChannelPayload>[]
          }
          upsert: {
            args: Prisma.GuildChannelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildChannelPayload>
          }
          aggregate: {
            args: Prisma.GuildChannelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuildChannel>
          }
          groupBy: {
            args: Prisma.GuildChannelGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuildChannelGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuildChannelCountArgs<ExtArgs>
            result: $Utils.Optional<GuildChannelCountAggregateOutputType> | number
          }
        }
      }
      GuildCurrency: {
        payload: Prisma.$GuildCurrencyPayload<ExtArgs>
        fields: Prisma.GuildCurrencyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuildCurrencyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildCurrencyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuildCurrencyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildCurrencyPayload>
          }
          findFirst: {
            args: Prisma.GuildCurrencyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildCurrencyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuildCurrencyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildCurrencyPayload>
          }
          findMany: {
            args: Prisma.GuildCurrencyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildCurrencyPayload>[]
          }
          create: {
            args: Prisma.GuildCurrencyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildCurrencyPayload>
          }
          createMany: {
            args: Prisma.GuildCurrencyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuildCurrencyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildCurrencyPayload>[]
          }
          delete: {
            args: Prisma.GuildCurrencyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildCurrencyPayload>
          }
          update: {
            args: Prisma.GuildCurrencyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildCurrencyPayload>
          }
          deleteMany: {
            args: Prisma.GuildCurrencyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuildCurrencyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GuildCurrencyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildCurrencyPayload>[]
          }
          upsert: {
            args: Prisma.GuildCurrencyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildCurrencyPayload>
          }
          aggregate: {
            args: Prisma.GuildCurrencyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuildCurrency>
          }
          groupBy: {
            args: Prisma.GuildCurrencyGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuildCurrencyGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuildCurrencyCountArgs<ExtArgs>
            result: $Utils.Optional<GuildCurrencyCountAggregateOutputType> | number
          }
        }
      }
      GuildRemovalReason: {
        payload: Prisma.$GuildRemovalReasonPayload<ExtArgs>
        fields: Prisma.GuildRemovalReasonFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuildRemovalReasonFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRemovalReasonPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuildRemovalReasonFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRemovalReasonPayload>
          }
          findFirst: {
            args: Prisma.GuildRemovalReasonFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRemovalReasonPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuildRemovalReasonFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRemovalReasonPayload>
          }
          findMany: {
            args: Prisma.GuildRemovalReasonFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRemovalReasonPayload>[]
          }
          create: {
            args: Prisma.GuildRemovalReasonCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRemovalReasonPayload>
          }
          createMany: {
            args: Prisma.GuildRemovalReasonCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuildRemovalReasonCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRemovalReasonPayload>[]
          }
          delete: {
            args: Prisma.GuildRemovalReasonDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRemovalReasonPayload>
          }
          update: {
            args: Prisma.GuildRemovalReasonUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRemovalReasonPayload>
          }
          deleteMany: {
            args: Prisma.GuildRemovalReasonDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuildRemovalReasonUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GuildRemovalReasonUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRemovalReasonPayload>[]
          }
          upsert: {
            args: Prisma.GuildRemovalReasonUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRemovalReasonPayload>
          }
          aggregate: {
            args: Prisma.GuildRemovalReasonAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuildRemovalReason>
          }
          groupBy: {
            args: Prisma.GuildRemovalReasonGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuildRemovalReasonGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuildRemovalReasonCountArgs<ExtArgs>
            result: $Utils.Optional<GuildRemovalReasonCountAggregateOutputType> | number
          }
        }
      }
      GuildRole: {
        payload: Prisma.$GuildRolePayload<ExtArgs>
        fields: Prisma.GuildRoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuildRoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuildRoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRolePayload>
          }
          findFirst: {
            args: Prisma.GuildRoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuildRoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRolePayload>
          }
          findMany: {
            args: Prisma.GuildRoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRolePayload>[]
          }
          create: {
            args: Prisma.GuildRoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRolePayload>
          }
          createMany: {
            args: Prisma.GuildRoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuildRoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRolePayload>[]
          }
          delete: {
            args: Prisma.GuildRoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRolePayload>
          }
          update: {
            args: Prisma.GuildRoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRolePayload>
          }
          deleteMany: {
            args: Prisma.GuildRoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuildRoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GuildRoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRolePayload>[]
          }
          upsert: {
            args: Prisma.GuildRoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildRolePayload>
          }
          aggregate: {
            args: Prisma.GuildRoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuildRole>
          }
          groupBy: {
            args: Prisma.GuildRoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuildRoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuildRoleCountArgs<ExtArgs>
            result: $Utils.Optional<GuildRoleCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    guild?: GuildOmit
    guildActivity?: GuildActivityOmit
    guildChannel?: GuildChannelOmit
    guildCurrency?: GuildCurrencyOmit
    guildRemovalReason?: GuildRemovalReasonOmit
    guildRole?: GuildRoleOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type GuildCountOutputType
   */

  export type GuildCountOutputType = {
    guildChannels: number
    guildCurrencies: number
    guildRemovalReasons: number
    guildRoles: number
  }

  export type GuildCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guildChannels?: boolean | GuildCountOutputTypeCountGuildChannelsArgs
    guildCurrencies?: boolean | GuildCountOutputTypeCountGuildCurrenciesArgs
    guildRemovalReasons?: boolean | GuildCountOutputTypeCountGuildRemovalReasonsArgs
    guildRoles?: boolean | GuildCountOutputTypeCountGuildRolesArgs
  }

  // Custom InputTypes
  /**
   * GuildCountOutputType without action
   */
  export type GuildCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCountOutputType
     */
    select?: GuildCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GuildCountOutputType without action
   */
  export type GuildCountOutputTypeCountGuildChannelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildChannelWhereInput
  }

  /**
   * GuildCountOutputType without action
   */
  export type GuildCountOutputTypeCountGuildCurrenciesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildCurrencyWhereInput
  }

  /**
   * GuildCountOutputType without action
   */
  export type GuildCountOutputTypeCountGuildRemovalReasonsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildRemovalReasonWhereInput
  }

  /**
   * GuildCountOutputType without action
   */
  export type GuildCountOutputTypeCountGuildRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildRoleWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Guild
   */

  export type AggregateGuild = {
    _count: GuildCountAggregateOutputType | null
    _avg: GuildAvgAggregateOutputType | null
    _sum: GuildSumAggregateOutputType | null
    _min: GuildMinAggregateOutputType | null
    _max: GuildMaxAggregateOutputType | null
  }

  export type GuildAvgAggregateOutputType = {
    id: number | null
  }

  export type GuildSumAggregateOutputType = {
    id: number | null
  }

  export type GuildMinAggregateOutputType = {
    id: number | null
    discordId: string | null
    name: string | null
  }

  export type GuildMaxAggregateOutputType = {
    id: number | null
    discordId: string | null
    name: string | null
  }

  export type GuildCountAggregateOutputType = {
    id: number
    discordId: number
    name: number
    _all: number
  }


  export type GuildAvgAggregateInputType = {
    id?: true
  }

  export type GuildSumAggregateInputType = {
    id?: true
  }

  export type GuildMinAggregateInputType = {
    id?: true
    discordId?: true
    name?: true
  }

  export type GuildMaxAggregateInputType = {
    id?: true
    discordId?: true
    name?: true
  }

  export type GuildCountAggregateInputType = {
    id?: true
    discordId?: true
    name?: true
    _all?: true
  }

  export type GuildAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Guild to aggregate.
     */
    where?: GuildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guilds to fetch.
     */
    orderBy?: GuildOrderByWithRelationInput | GuildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Guilds
    **/
    _count?: true | GuildCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GuildAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GuildSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuildMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuildMaxAggregateInputType
  }

  export type GetGuildAggregateType<T extends GuildAggregateArgs> = {
        [P in keyof T & keyof AggregateGuild]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuild[P]>
      : GetScalarType<T[P], AggregateGuild[P]>
  }




  export type GuildGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildWhereInput
    orderBy?: GuildOrderByWithAggregationInput | GuildOrderByWithAggregationInput[]
    by: GuildScalarFieldEnum[] | GuildScalarFieldEnum
    having?: GuildScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuildCountAggregateInputType | true
    _avg?: GuildAvgAggregateInputType
    _sum?: GuildSumAggregateInputType
    _min?: GuildMinAggregateInputType
    _max?: GuildMaxAggregateInputType
  }

  export type GuildGroupByOutputType = {
    id: number
    discordId: string
    name: string
    _count: GuildCountAggregateOutputType | null
    _avg: GuildAvgAggregateOutputType | null
    _sum: GuildSumAggregateOutputType | null
    _min: GuildMinAggregateOutputType | null
    _max: GuildMaxAggregateOutputType | null
  }

  type GetGuildGroupByPayload<T extends GuildGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuildGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuildGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuildGroupByOutputType[P]>
            : GetScalarType<T[P], GuildGroupByOutputType[P]>
        }
      >
    >


  export type GuildSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    discordId?: boolean
    name?: boolean
    guildActivity?: boolean | Guild$guildActivityArgs<ExtArgs>
    guildChannels?: boolean | Guild$guildChannelsArgs<ExtArgs>
    guildCurrencies?: boolean | Guild$guildCurrenciesArgs<ExtArgs>
    guildRemovalReasons?: boolean | Guild$guildRemovalReasonsArgs<ExtArgs>
    guildRoles?: boolean | Guild$guildRolesArgs<ExtArgs>
    _count?: boolean | GuildCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guild"]>

  export type GuildSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    discordId?: boolean
    name?: boolean
  }, ExtArgs["result"]["guild"]>

  export type GuildSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    discordId?: boolean
    name?: boolean
  }, ExtArgs["result"]["guild"]>

  export type GuildSelectScalar = {
    id?: boolean
    discordId?: boolean
    name?: boolean
  }

  export type GuildOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "discordId" | "name", ExtArgs["result"]["guild"]>
  export type GuildInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guildActivity?: boolean | Guild$guildActivityArgs<ExtArgs>
    guildChannels?: boolean | Guild$guildChannelsArgs<ExtArgs>
    guildCurrencies?: boolean | Guild$guildCurrenciesArgs<ExtArgs>
    guildRemovalReasons?: boolean | Guild$guildRemovalReasonsArgs<ExtArgs>
    guildRoles?: boolean | Guild$guildRolesArgs<ExtArgs>
    _count?: boolean | GuildCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GuildIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type GuildIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GuildPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Guild"
    objects: {
      guildActivity: Prisma.$GuildActivityPayload<ExtArgs> | null
      guildChannels: Prisma.$GuildChannelPayload<ExtArgs>[]
      guildCurrencies: Prisma.$GuildCurrencyPayload<ExtArgs>[]
      guildRemovalReasons: Prisma.$GuildRemovalReasonPayload<ExtArgs>[]
      guildRoles: Prisma.$GuildRolePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      discordId: string
      name: string
    }, ExtArgs["result"]["guild"]>
    composites: {}
  }

  type GuildGetPayload<S extends boolean | null | undefined | GuildDefaultArgs> = $Result.GetResult<Prisma.$GuildPayload, S>

  type GuildCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GuildFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuildCountAggregateInputType | true
    }

  export interface GuildDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Guild'], meta: { name: 'Guild' } }
    /**
     * Find zero or one Guild that matches the filter.
     * @param {GuildFindUniqueArgs} args - Arguments to find a Guild
     * @example
     * // Get one Guild
     * const guild = await prisma.guild.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuildFindUniqueArgs>(args: SelectSubset<T, GuildFindUniqueArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Guild that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GuildFindUniqueOrThrowArgs} args - Arguments to find a Guild
     * @example
     * // Get one Guild
     * const guild = await prisma.guild.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuildFindUniqueOrThrowArgs>(args: SelectSubset<T, GuildFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Guild that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildFindFirstArgs} args - Arguments to find a Guild
     * @example
     * // Get one Guild
     * const guild = await prisma.guild.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuildFindFirstArgs>(args?: SelectSubset<T, GuildFindFirstArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Guild that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildFindFirstOrThrowArgs} args - Arguments to find a Guild
     * @example
     * // Get one Guild
     * const guild = await prisma.guild.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuildFindFirstOrThrowArgs>(args?: SelectSubset<T, GuildFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Guilds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Guilds
     * const guilds = await prisma.guild.findMany()
     * 
     * // Get first 10 Guilds
     * const guilds = await prisma.guild.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guildWithIdOnly = await prisma.guild.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuildFindManyArgs>(args?: SelectSubset<T, GuildFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Guild.
     * @param {GuildCreateArgs} args - Arguments to create a Guild.
     * @example
     * // Create one Guild
     * const Guild = await prisma.guild.create({
     *   data: {
     *     // ... data to create a Guild
     *   }
     * })
     * 
     */
    create<T extends GuildCreateArgs>(args: SelectSubset<T, GuildCreateArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Guilds.
     * @param {GuildCreateManyArgs} args - Arguments to create many Guilds.
     * @example
     * // Create many Guilds
     * const guild = await prisma.guild.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuildCreateManyArgs>(args?: SelectSubset<T, GuildCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Guilds and returns the data saved in the database.
     * @param {GuildCreateManyAndReturnArgs} args - Arguments to create many Guilds.
     * @example
     * // Create many Guilds
     * const guild = await prisma.guild.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Guilds and only return the `id`
     * const guildWithIdOnly = await prisma.guild.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuildCreateManyAndReturnArgs>(args?: SelectSubset<T, GuildCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Guild.
     * @param {GuildDeleteArgs} args - Arguments to delete one Guild.
     * @example
     * // Delete one Guild
     * const Guild = await prisma.guild.delete({
     *   where: {
     *     // ... filter to delete one Guild
     *   }
     * })
     * 
     */
    delete<T extends GuildDeleteArgs>(args: SelectSubset<T, GuildDeleteArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Guild.
     * @param {GuildUpdateArgs} args - Arguments to update one Guild.
     * @example
     * // Update one Guild
     * const guild = await prisma.guild.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuildUpdateArgs>(args: SelectSubset<T, GuildUpdateArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Guilds.
     * @param {GuildDeleteManyArgs} args - Arguments to filter Guilds to delete.
     * @example
     * // Delete a few Guilds
     * const { count } = await prisma.guild.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuildDeleteManyArgs>(args?: SelectSubset<T, GuildDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Guilds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Guilds
     * const guild = await prisma.guild.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuildUpdateManyArgs>(args: SelectSubset<T, GuildUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Guilds and returns the data updated in the database.
     * @param {GuildUpdateManyAndReturnArgs} args - Arguments to update many Guilds.
     * @example
     * // Update many Guilds
     * const guild = await prisma.guild.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Guilds and only return the `id`
     * const guildWithIdOnly = await prisma.guild.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GuildUpdateManyAndReturnArgs>(args: SelectSubset<T, GuildUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Guild.
     * @param {GuildUpsertArgs} args - Arguments to update or create a Guild.
     * @example
     * // Update or create a Guild
     * const guild = await prisma.guild.upsert({
     *   create: {
     *     // ... data to create a Guild
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Guild we want to update
     *   }
     * })
     */
    upsert<T extends GuildUpsertArgs>(args: SelectSubset<T, GuildUpsertArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Guilds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildCountArgs} args - Arguments to filter Guilds to count.
     * @example
     * // Count the number of Guilds
     * const count = await prisma.guild.count({
     *   where: {
     *     // ... the filter for the Guilds we want to count
     *   }
     * })
    **/
    count<T extends GuildCountArgs>(
      args?: Subset<T, GuildCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuildCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Guild.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GuildAggregateArgs>(args: Subset<T, GuildAggregateArgs>): Prisma.PrismaPromise<GetGuildAggregateType<T>>

    /**
     * Group by Guild.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GuildGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuildGroupByArgs['orderBy'] }
        : { orderBy?: GuildGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GuildGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuildGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Guild model
   */
  readonly fields: GuildFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Guild.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuildClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    guildActivity<T extends Guild$guildActivityArgs<ExtArgs> = {}>(args?: Subset<T, Guild$guildActivityArgs<ExtArgs>>): Prisma__GuildActivityClient<$Result.GetResult<Prisma.$GuildActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    guildChannels<T extends Guild$guildChannelsArgs<ExtArgs> = {}>(args?: Subset<T, Guild$guildChannelsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildChannelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    guildCurrencies<T extends Guild$guildCurrenciesArgs<ExtArgs> = {}>(args?: Subset<T, Guild$guildCurrenciesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildCurrencyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    guildRemovalReasons<T extends Guild$guildRemovalReasonsArgs<ExtArgs> = {}>(args?: Subset<T, Guild$guildRemovalReasonsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildRemovalReasonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    guildRoles<T extends Guild$guildRolesArgs<ExtArgs> = {}>(args?: Subset<T, Guild$guildRolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Guild model
   */
  interface GuildFieldRefs {
    readonly id: FieldRef<"Guild", 'Int'>
    readonly discordId: FieldRef<"Guild", 'String'>
    readonly name: FieldRef<"Guild", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Guild findUnique
   */
  export type GuildFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * Filter, which Guild to fetch.
     */
    where: GuildWhereUniqueInput
  }

  /**
   * Guild findUniqueOrThrow
   */
  export type GuildFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * Filter, which Guild to fetch.
     */
    where: GuildWhereUniqueInput
  }

  /**
   * Guild findFirst
   */
  export type GuildFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * Filter, which Guild to fetch.
     */
    where?: GuildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guilds to fetch.
     */
    orderBy?: GuildOrderByWithRelationInput | GuildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Guilds.
     */
    cursor?: GuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Guilds.
     */
    distinct?: GuildScalarFieldEnum | GuildScalarFieldEnum[]
  }

  /**
   * Guild findFirstOrThrow
   */
  export type GuildFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * Filter, which Guild to fetch.
     */
    where?: GuildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guilds to fetch.
     */
    orderBy?: GuildOrderByWithRelationInput | GuildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Guilds.
     */
    cursor?: GuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Guilds.
     */
    distinct?: GuildScalarFieldEnum | GuildScalarFieldEnum[]
  }

  /**
   * Guild findMany
   */
  export type GuildFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * Filter, which Guilds to fetch.
     */
    where?: GuildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guilds to fetch.
     */
    orderBy?: GuildOrderByWithRelationInput | GuildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Guilds.
     */
    cursor?: GuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guilds.
     */
    skip?: number
    distinct?: GuildScalarFieldEnum | GuildScalarFieldEnum[]
  }

  /**
   * Guild create
   */
  export type GuildCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * The data needed to create a Guild.
     */
    data: XOR<GuildCreateInput, GuildUncheckedCreateInput>
  }

  /**
   * Guild createMany
   */
  export type GuildCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Guilds.
     */
    data: GuildCreateManyInput | GuildCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Guild createManyAndReturn
   */
  export type GuildCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * The data used to create many Guilds.
     */
    data: GuildCreateManyInput | GuildCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Guild update
   */
  export type GuildUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * The data needed to update a Guild.
     */
    data: XOR<GuildUpdateInput, GuildUncheckedUpdateInput>
    /**
     * Choose, which Guild to update.
     */
    where: GuildWhereUniqueInput
  }

  /**
   * Guild updateMany
   */
  export type GuildUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Guilds.
     */
    data: XOR<GuildUpdateManyMutationInput, GuildUncheckedUpdateManyInput>
    /**
     * Filter which Guilds to update
     */
    where?: GuildWhereInput
    /**
     * Limit how many Guilds to update.
     */
    limit?: number
  }

  /**
   * Guild updateManyAndReturn
   */
  export type GuildUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * The data used to update Guilds.
     */
    data: XOR<GuildUpdateManyMutationInput, GuildUncheckedUpdateManyInput>
    /**
     * Filter which Guilds to update
     */
    where?: GuildWhereInput
    /**
     * Limit how many Guilds to update.
     */
    limit?: number
  }

  /**
   * Guild upsert
   */
  export type GuildUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * The filter to search for the Guild to update in case it exists.
     */
    where: GuildWhereUniqueInput
    /**
     * In case the Guild found by the `where` argument doesn't exist, create a new Guild with this data.
     */
    create: XOR<GuildCreateInput, GuildUncheckedCreateInput>
    /**
     * In case the Guild was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuildUpdateInput, GuildUncheckedUpdateInput>
  }

  /**
   * Guild delete
   */
  export type GuildDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * Filter which Guild to delete.
     */
    where: GuildWhereUniqueInput
  }

  /**
   * Guild deleteMany
   */
  export type GuildDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Guilds to delete
     */
    where?: GuildWhereInput
    /**
     * Limit how many Guilds to delete.
     */
    limit?: number
  }

  /**
   * Guild.guildActivity
   */
  export type Guild$guildActivityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildActivity
     */
    select?: GuildActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildActivity
     */
    omit?: GuildActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildActivityInclude<ExtArgs> | null
    where?: GuildActivityWhereInput
  }

  /**
   * Guild.guildChannels
   */
  export type Guild$guildChannelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildChannel
     */
    select?: GuildChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildChannel
     */
    omit?: GuildChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildChannelInclude<ExtArgs> | null
    where?: GuildChannelWhereInput
    orderBy?: GuildChannelOrderByWithRelationInput | GuildChannelOrderByWithRelationInput[]
    cursor?: GuildChannelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GuildChannelScalarFieldEnum | GuildChannelScalarFieldEnum[]
  }

  /**
   * Guild.guildCurrencies
   */
  export type Guild$guildCurrenciesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCurrency
     */
    select?: GuildCurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildCurrency
     */
    omit?: GuildCurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildCurrencyInclude<ExtArgs> | null
    where?: GuildCurrencyWhereInput
    orderBy?: GuildCurrencyOrderByWithRelationInput | GuildCurrencyOrderByWithRelationInput[]
    cursor?: GuildCurrencyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GuildCurrencyScalarFieldEnum | GuildCurrencyScalarFieldEnum[]
  }

  /**
   * Guild.guildRemovalReasons
   */
  export type Guild$guildRemovalReasonsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRemovalReason
     */
    select?: GuildRemovalReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRemovalReason
     */
    omit?: GuildRemovalReasonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRemovalReasonInclude<ExtArgs> | null
    where?: GuildRemovalReasonWhereInput
    orderBy?: GuildRemovalReasonOrderByWithRelationInput | GuildRemovalReasonOrderByWithRelationInput[]
    cursor?: GuildRemovalReasonWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GuildRemovalReasonScalarFieldEnum | GuildRemovalReasonScalarFieldEnum[]
  }

  /**
   * Guild.guildRoles
   */
  export type Guild$guildRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRole
     */
    select?: GuildRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRole
     */
    omit?: GuildRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRoleInclude<ExtArgs> | null
    where?: GuildRoleWhereInput
    orderBy?: GuildRoleOrderByWithRelationInput | GuildRoleOrderByWithRelationInput[]
    cursor?: GuildRoleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GuildRoleScalarFieldEnum | GuildRoleScalarFieldEnum[]
  }

  /**
   * Guild without action
   */
  export type GuildDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
  }


  /**
   * Model GuildActivity
   */

  export type AggregateGuildActivity = {
    _count: GuildActivityCountAggregateOutputType | null
    _avg: GuildActivityAvgAggregateOutputType | null
    _sum: GuildActivitySumAggregateOutputType | null
    _min: GuildActivityMinAggregateOutputType | null
    _max: GuildActivityMaxAggregateOutputType | null
  }

  export type GuildActivityAvgAggregateOutputType = {
    id: number | null
    guildId: number | null
    numGuildChannels: number | null
    numGuildCurrencies: number | null
    numGuildRoles: number | null
    numRemovalReasons: number | null
  }

  export type GuildActivitySumAggregateOutputType = {
    id: number | null
    guildId: number | null
    numGuildChannels: number | null
    numGuildCurrencies: number | null
    numGuildRoles: number | null
    numRemovalReasons: number | null
  }

  export type GuildActivityMinAggregateOutputType = {
    id: number | null
    guildId: number | null
    numGuildChannels: number | null
    numGuildCurrencies: number | null
    numGuildRoles: number | null
    numRemovalReasons: number | null
  }

  export type GuildActivityMaxAggregateOutputType = {
    id: number | null
    guildId: number | null
    numGuildChannels: number | null
    numGuildCurrencies: number | null
    numGuildRoles: number | null
    numRemovalReasons: number | null
  }

  export type GuildActivityCountAggregateOutputType = {
    id: number
    guildId: number
    numGuildChannels: number
    numGuildCurrencies: number
    numGuildRoles: number
    numRemovalReasons: number
    _all: number
  }


  export type GuildActivityAvgAggregateInputType = {
    id?: true
    guildId?: true
    numGuildChannels?: true
    numGuildCurrencies?: true
    numGuildRoles?: true
    numRemovalReasons?: true
  }

  export type GuildActivitySumAggregateInputType = {
    id?: true
    guildId?: true
    numGuildChannels?: true
    numGuildCurrencies?: true
    numGuildRoles?: true
    numRemovalReasons?: true
  }

  export type GuildActivityMinAggregateInputType = {
    id?: true
    guildId?: true
    numGuildChannels?: true
    numGuildCurrencies?: true
    numGuildRoles?: true
    numRemovalReasons?: true
  }

  export type GuildActivityMaxAggregateInputType = {
    id?: true
    guildId?: true
    numGuildChannels?: true
    numGuildCurrencies?: true
    numGuildRoles?: true
    numRemovalReasons?: true
  }

  export type GuildActivityCountAggregateInputType = {
    id?: true
    guildId?: true
    numGuildChannels?: true
    numGuildCurrencies?: true
    numGuildRoles?: true
    numRemovalReasons?: true
    _all?: true
  }

  export type GuildActivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildActivity to aggregate.
     */
    where?: GuildActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildActivities to fetch.
     */
    orderBy?: GuildActivityOrderByWithRelationInput | GuildActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuildActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GuildActivities
    **/
    _count?: true | GuildActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GuildActivityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GuildActivitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuildActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuildActivityMaxAggregateInputType
  }

  export type GetGuildActivityAggregateType<T extends GuildActivityAggregateArgs> = {
        [P in keyof T & keyof AggregateGuildActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuildActivity[P]>
      : GetScalarType<T[P], AggregateGuildActivity[P]>
  }




  export type GuildActivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildActivityWhereInput
    orderBy?: GuildActivityOrderByWithAggregationInput | GuildActivityOrderByWithAggregationInput[]
    by: GuildActivityScalarFieldEnum[] | GuildActivityScalarFieldEnum
    having?: GuildActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuildActivityCountAggregateInputType | true
    _avg?: GuildActivityAvgAggregateInputType
    _sum?: GuildActivitySumAggregateInputType
    _min?: GuildActivityMinAggregateInputType
    _max?: GuildActivityMaxAggregateInputType
  }

  export type GuildActivityGroupByOutputType = {
    id: number
    guildId: number
    numGuildChannels: number
    numGuildCurrencies: number
    numGuildRoles: number
    numRemovalReasons: number
    _count: GuildActivityCountAggregateOutputType | null
    _avg: GuildActivityAvgAggregateOutputType | null
    _sum: GuildActivitySumAggregateOutputType | null
    _min: GuildActivityMinAggregateOutputType | null
    _max: GuildActivityMaxAggregateOutputType | null
  }

  type GetGuildActivityGroupByPayload<T extends GuildActivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuildActivityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuildActivityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuildActivityGroupByOutputType[P]>
            : GetScalarType<T[P], GuildActivityGroupByOutputType[P]>
        }
      >
    >


  export type GuildActivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    numGuildChannels?: boolean
    numGuildCurrencies?: boolean
    numGuildRoles?: boolean
    numRemovalReasons?: boolean
    guild?: boolean | GuildActivity$guildArgs<ExtArgs>
  }, ExtArgs["result"]["guildActivity"]>

  export type GuildActivitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    numGuildChannels?: boolean
    numGuildCurrencies?: boolean
    numGuildRoles?: boolean
    numRemovalReasons?: boolean
    guild?: boolean | GuildActivity$guildArgs<ExtArgs>
  }, ExtArgs["result"]["guildActivity"]>

  export type GuildActivitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    numGuildChannels?: boolean
    numGuildCurrencies?: boolean
    numGuildRoles?: boolean
    numRemovalReasons?: boolean
    guild?: boolean | GuildActivity$guildArgs<ExtArgs>
  }, ExtArgs["result"]["guildActivity"]>

  export type GuildActivitySelectScalar = {
    id?: boolean
    guildId?: boolean
    numGuildChannels?: boolean
    numGuildCurrencies?: boolean
    numGuildRoles?: boolean
    numRemovalReasons?: boolean
  }

  export type GuildActivityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "guildId" | "numGuildChannels" | "numGuildCurrencies" | "numGuildRoles" | "numRemovalReasons", ExtArgs["result"]["guildActivity"]>
  export type GuildActivityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildActivity$guildArgs<ExtArgs>
  }
  export type GuildActivityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildActivity$guildArgs<ExtArgs>
  }
  export type GuildActivityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildActivity$guildArgs<ExtArgs>
  }

  export type $GuildActivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GuildActivity"
    objects: {
      guild: Prisma.$GuildPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      guildId: number
      numGuildChannels: number
      numGuildCurrencies: number
      numGuildRoles: number
      numRemovalReasons: number
    }, ExtArgs["result"]["guildActivity"]>
    composites: {}
  }

  type GuildActivityGetPayload<S extends boolean | null | undefined | GuildActivityDefaultArgs> = $Result.GetResult<Prisma.$GuildActivityPayload, S>

  type GuildActivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GuildActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuildActivityCountAggregateInputType | true
    }

  export interface GuildActivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GuildActivity'], meta: { name: 'GuildActivity' } }
    /**
     * Find zero or one GuildActivity that matches the filter.
     * @param {GuildActivityFindUniqueArgs} args - Arguments to find a GuildActivity
     * @example
     * // Get one GuildActivity
     * const guildActivity = await prisma.guildActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuildActivityFindUniqueArgs>(args: SelectSubset<T, GuildActivityFindUniqueArgs<ExtArgs>>): Prisma__GuildActivityClient<$Result.GetResult<Prisma.$GuildActivityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GuildActivity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GuildActivityFindUniqueOrThrowArgs} args - Arguments to find a GuildActivity
     * @example
     * // Get one GuildActivity
     * const guildActivity = await prisma.guildActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuildActivityFindUniqueOrThrowArgs>(args: SelectSubset<T, GuildActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuildActivityClient<$Result.GetResult<Prisma.$GuildActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuildActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildActivityFindFirstArgs} args - Arguments to find a GuildActivity
     * @example
     * // Get one GuildActivity
     * const guildActivity = await prisma.guildActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuildActivityFindFirstArgs>(args?: SelectSubset<T, GuildActivityFindFirstArgs<ExtArgs>>): Prisma__GuildActivityClient<$Result.GetResult<Prisma.$GuildActivityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuildActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildActivityFindFirstOrThrowArgs} args - Arguments to find a GuildActivity
     * @example
     * // Get one GuildActivity
     * const guildActivity = await prisma.guildActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuildActivityFindFirstOrThrowArgs>(args?: SelectSubset<T, GuildActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuildActivityClient<$Result.GetResult<Prisma.$GuildActivityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GuildActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GuildActivities
     * const guildActivities = await prisma.guildActivity.findMany()
     * 
     * // Get first 10 GuildActivities
     * const guildActivities = await prisma.guildActivity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guildActivityWithIdOnly = await prisma.guildActivity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuildActivityFindManyArgs>(args?: SelectSubset<T, GuildActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GuildActivity.
     * @param {GuildActivityCreateArgs} args - Arguments to create a GuildActivity.
     * @example
     * // Create one GuildActivity
     * const GuildActivity = await prisma.guildActivity.create({
     *   data: {
     *     // ... data to create a GuildActivity
     *   }
     * })
     * 
     */
    create<T extends GuildActivityCreateArgs>(args: SelectSubset<T, GuildActivityCreateArgs<ExtArgs>>): Prisma__GuildActivityClient<$Result.GetResult<Prisma.$GuildActivityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GuildActivities.
     * @param {GuildActivityCreateManyArgs} args - Arguments to create many GuildActivities.
     * @example
     * // Create many GuildActivities
     * const guildActivity = await prisma.guildActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuildActivityCreateManyArgs>(args?: SelectSubset<T, GuildActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GuildActivities and returns the data saved in the database.
     * @param {GuildActivityCreateManyAndReturnArgs} args - Arguments to create many GuildActivities.
     * @example
     * // Create many GuildActivities
     * const guildActivity = await prisma.guildActivity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GuildActivities and only return the `id`
     * const guildActivityWithIdOnly = await prisma.guildActivity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuildActivityCreateManyAndReturnArgs>(args?: SelectSubset<T, GuildActivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildActivityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GuildActivity.
     * @param {GuildActivityDeleteArgs} args - Arguments to delete one GuildActivity.
     * @example
     * // Delete one GuildActivity
     * const GuildActivity = await prisma.guildActivity.delete({
     *   where: {
     *     // ... filter to delete one GuildActivity
     *   }
     * })
     * 
     */
    delete<T extends GuildActivityDeleteArgs>(args: SelectSubset<T, GuildActivityDeleteArgs<ExtArgs>>): Prisma__GuildActivityClient<$Result.GetResult<Prisma.$GuildActivityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GuildActivity.
     * @param {GuildActivityUpdateArgs} args - Arguments to update one GuildActivity.
     * @example
     * // Update one GuildActivity
     * const guildActivity = await prisma.guildActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuildActivityUpdateArgs>(args: SelectSubset<T, GuildActivityUpdateArgs<ExtArgs>>): Prisma__GuildActivityClient<$Result.GetResult<Prisma.$GuildActivityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GuildActivities.
     * @param {GuildActivityDeleteManyArgs} args - Arguments to filter GuildActivities to delete.
     * @example
     * // Delete a few GuildActivities
     * const { count } = await prisma.guildActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuildActivityDeleteManyArgs>(args?: SelectSubset<T, GuildActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuildActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GuildActivities
     * const guildActivity = await prisma.guildActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuildActivityUpdateManyArgs>(args: SelectSubset<T, GuildActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuildActivities and returns the data updated in the database.
     * @param {GuildActivityUpdateManyAndReturnArgs} args - Arguments to update many GuildActivities.
     * @example
     * // Update many GuildActivities
     * const guildActivity = await prisma.guildActivity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GuildActivities and only return the `id`
     * const guildActivityWithIdOnly = await prisma.guildActivity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GuildActivityUpdateManyAndReturnArgs>(args: SelectSubset<T, GuildActivityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildActivityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GuildActivity.
     * @param {GuildActivityUpsertArgs} args - Arguments to update or create a GuildActivity.
     * @example
     * // Update or create a GuildActivity
     * const guildActivity = await prisma.guildActivity.upsert({
     *   create: {
     *     // ... data to create a GuildActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GuildActivity we want to update
     *   }
     * })
     */
    upsert<T extends GuildActivityUpsertArgs>(args: SelectSubset<T, GuildActivityUpsertArgs<ExtArgs>>): Prisma__GuildActivityClient<$Result.GetResult<Prisma.$GuildActivityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GuildActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildActivityCountArgs} args - Arguments to filter GuildActivities to count.
     * @example
     * // Count the number of GuildActivities
     * const count = await prisma.guildActivity.count({
     *   where: {
     *     // ... the filter for the GuildActivities we want to count
     *   }
     * })
    **/
    count<T extends GuildActivityCountArgs>(
      args?: Subset<T, GuildActivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuildActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GuildActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GuildActivityAggregateArgs>(args: Subset<T, GuildActivityAggregateArgs>): Prisma.PrismaPromise<GetGuildActivityAggregateType<T>>

    /**
     * Group by GuildActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GuildActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuildActivityGroupByArgs['orderBy'] }
        : { orderBy?: GuildActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GuildActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuildActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GuildActivity model
   */
  readonly fields: GuildActivityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GuildActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuildActivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    guild<T extends GuildActivity$guildArgs<ExtArgs> = {}>(args?: Subset<T, GuildActivity$guildArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GuildActivity model
   */
  interface GuildActivityFieldRefs {
    readonly id: FieldRef<"GuildActivity", 'Int'>
    readonly guildId: FieldRef<"GuildActivity", 'Int'>
    readonly numGuildChannels: FieldRef<"GuildActivity", 'Int'>
    readonly numGuildCurrencies: FieldRef<"GuildActivity", 'Int'>
    readonly numGuildRoles: FieldRef<"GuildActivity", 'Int'>
    readonly numRemovalReasons: FieldRef<"GuildActivity", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * GuildActivity findUnique
   */
  export type GuildActivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildActivity
     */
    select?: GuildActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildActivity
     */
    omit?: GuildActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildActivityInclude<ExtArgs> | null
    /**
     * Filter, which GuildActivity to fetch.
     */
    where: GuildActivityWhereUniqueInput
  }

  /**
   * GuildActivity findUniqueOrThrow
   */
  export type GuildActivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildActivity
     */
    select?: GuildActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildActivity
     */
    omit?: GuildActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildActivityInclude<ExtArgs> | null
    /**
     * Filter, which GuildActivity to fetch.
     */
    where: GuildActivityWhereUniqueInput
  }

  /**
   * GuildActivity findFirst
   */
  export type GuildActivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildActivity
     */
    select?: GuildActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildActivity
     */
    omit?: GuildActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildActivityInclude<ExtArgs> | null
    /**
     * Filter, which GuildActivity to fetch.
     */
    where?: GuildActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildActivities to fetch.
     */
    orderBy?: GuildActivityOrderByWithRelationInput | GuildActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildActivities.
     */
    cursor?: GuildActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildActivities.
     */
    distinct?: GuildActivityScalarFieldEnum | GuildActivityScalarFieldEnum[]
  }

  /**
   * GuildActivity findFirstOrThrow
   */
  export type GuildActivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildActivity
     */
    select?: GuildActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildActivity
     */
    omit?: GuildActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildActivityInclude<ExtArgs> | null
    /**
     * Filter, which GuildActivity to fetch.
     */
    where?: GuildActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildActivities to fetch.
     */
    orderBy?: GuildActivityOrderByWithRelationInput | GuildActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildActivities.
     */
    cursor?: GuildActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildActivities.
     */
    distinct?: GuildActivityScalarFieldEnum | GuildActivityScalarFieldEnum[]
  }

  /**
   * GuildActivity findMany
   */
  export type GuildActivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildActivity
     */
    select?: GuildActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildActivity
     */
    omit?: GuildActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildActivityInclude<ExtArgs> | null
    /**
     * Filter, which GuildActivities to fetch.
     */
    where?: GuildActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildActivities to fetch.
     */
    orderBy?: GuildActivityOrderByWithRelationInput | GuildActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GuildActivities.
     */
    cursor?: GuildActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildActivities.
     */
    skip?: number
    distinct?: GuildActivityScalarFieldEnum | GuildActivityScalarFieldEnum[]
  }

  /**
   * GuildActivity create
   */
  export type GuildActivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildActivity
     */
    select?: GuildActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildActivity
     */
    omit?: GuildActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a GuildActivity.
     */
    data: XOR<GuildActivityCreateInput, GuildActivityUncheckedCreateInput>
  }

  /**
   * GuildActivity createMany
   */
  export type GuildActivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GuildActivities.
     */
    data: GuildActivityCreateManyInput | GuildActivityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuildActivity createManyAndReturn
   */
  export type GuildActivityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildActivity
     */
    select?: GuildActivitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuildActivity
     */
    omit?: GuildActivityOmit<ExtArgs> | null
    /**
     * The data used to create many GuildActivities.
     */
    data: GuildActivityCreateManyInput | GuildActivityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildActivityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuildActivity update
   */
  export type GuildActivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildActivity
     */
    select?: GuildActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildActivity
     */
    omit?: GuildActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a GuildActivity.
     */
    data: XOR<GuildActivityUpdateInput, GuildActivityUncheckedUpdateInput>
    /**
     * Choose, which GuildActivity to update.
     */
    where: GuildActivityWhereUniqueInput
  }

  /**
   * GuildActivity updateMany
   */
  export type GuildActivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GuildActivities.
     */
    data: XOR<GuildActivityUpdateManyMutationInput, GuildActivityUncheckedUpdateManyInput>
    /**
     * Filter which GuildActivities to update
     */
    where?: GuildActivityWhereInput
    /**
     * Limit how many GuildActivities to update.
     */
    limit?: number
  }

  /**
   * GuildActivity updateManyAndReturn
   */
  export type GuildActivityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildActivity
     */
    select?: GuildActivitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuildActivity
     */
    omit?: GuildActivityOmit<ExtArgs> | null
    /**
     * The data used to update GuildActivities.
     */
    data: XOR<GuildActivityUpdateManyMutationInput, GuildActivityUncheckedUpdateManyInput>
    /**
     * Filter which GuildActivities to update
     */
    where?: GuildActivityWhereInput
    /**
     * Limit how many GuildActivities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildActivityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuildActivity upsert
   */
  export type GuildActivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildActivity
     */
    select?: GuildActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildActivity
     */
    omit?: GuildActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the GuildActivity to update in case it exists.
     */
    where: GuildActivityWhereUniqueInput
    /**
     * In case the GuildActivity found by the `where` argument doesn't exist, create a new GuildActivity with this data.
     */
    create: XOR<GuildActivityCreateInput, GuildActivityUncheckedCreateInput>
    /**
     * In case the GuildActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuildActivityUpdateInput, GuildActivityUncheckedUpdateInput>
  }

  /**
   * GuildActivity delete
   */
  export type GuildActivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildActivity
     */
    select?: GuildActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildActivity
     */
    omit?: GuildActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildActivityInclude<ExtArgs> | null
    /**
     * Filter which GuildActivity to delete.
     */
    where: GuildActivityWhereUniqueInput
  }

  /**
   * GuildActivity deleteMany
   */
  export type GuildActivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildActivities to delete
     */
    where?: GuildActivityWhereInput
    /**
     * Limit how many GuildActivities to delete.
     */
    limit?: number
  }

  /**
   * GuildActivity.guild
   */
  export type GuildActivity$guildArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    where?: GuildWhereInput
  }

  /**
   * GuildActivity without action
   */
  export type GuildActivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildActivity
     */
    select?: GuildActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildActivity
     */
    omit?: GuildActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildActivityInclude<ExtArgs> | null
  }


  /**
   * Model GuildChannel
   */

  export type AggregateGuildChannel = {
    _count: GuildChannelCountAggregateOutputType | null
    _avg: GuildChannelAvgAggregateOutputType | null
    _sum: GuildChannelSumAggregateOutputType | null
    _min: GuildChannelMinAggregateOutputType | null
    _max: GuildChannelMaxAggregateOutputType | null
  }

  export type GuildChannelAvgAggregateOutputType = {
    id: number | null
    guildId: number | null
  }

  export type GuildChannelSumAggregateOutputType = {
    id: number | null
    guildId: number | null
  }

  export type GuildChannelMinAggregateOutputType = {
    id: number | null
    guildId: number | null
    name: string | null
  }

  export type GuildChannelMaxAggregateOutputType = {
    id: number | null
    guildId: number | null
    name: string | null
  }

  export type GuildChannelCountAggregateOutputType = {
    id: number
    guildId: number
    name: number
    _all: number
  }


  export type GuildChannelAvgAggregateInputType = {
    id?: true
    guildId?: true
  }

  export type GuildChannelSumAggregateInputType = {
    id?: true
    guildId?: true
  }

  export type GuildChannelMinAggregateInputType = {
    id?: true
    guildId?: true
    name?: true
  }

  export type GuildChannelMaxAggregateInputType = {
    id?: true
    guildId?: true
    name?: true
  }

  export type GuildChannelCountAggregateInputType = {
    id?: true
    guildId?: true
    name?: true
    _all?: true
  }

  export type GuildChannelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildChannel to aggregate.
     */
    where?: GuildChannelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildChannels to fetch.
     */
    orderBy?: GuildChannelOrderByWithRelationInput | GuildChannelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuildChannelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildChannels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildChannels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GuildChannels
    **/
    _count?: true | GuildChannelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GuildChannelAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GuildChannelSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuildChannelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuildChannelMaxAggregateInputType
  }

  export type GetGuildChannelAggregateType<T extends GuildChannelAggregateArgs> = {
        [P in keyof T & keyof AggregateGuildChannel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuildChannel[P]>
      : GetScalarType<T[P], AggregateGuildChannel[P]>
  }




  export type GuildChannelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildChannelWhereInput
    orderBy?: GuildChannelOrderByWithAggregationInput | GuildChannelOrderByWithAggregationInput[]
    by: GuildChannelScalarFieldEnum[] | GuildChannelScalarFieldEnum
    having?: GuildChannelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuildChannelCountAggregateInputType | true
    _avg?: GuildChannelAvgAggregateInputType
    _sum?: GuildChannelSumAggregateInputType
    _min?: GuildChannelMinAggregateInputType
    _max?: GuildChannelMaxAggregateInputType
  }

  export type GuildChannelGroupByOutputType = {
    id: number
    guildId: number
    name: string
    _count: GuildChannelCountAggregateOutputType | null
    _avg: GuildChannelAvgAggregateOutputType | null
    _sum: GuildChannelSumAggregateOutputType | null
    _min: GuildChannelMinAggregateOutputType | null
    _max: GuildChannelMaxAggregateOutputType | null
  }

  type GetGuildChannelGroupByPayload<T extends GuildChannelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuildChannelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuildChannelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuildChannelGroupByOutputType[P]>
            : GetScalarType<T[P], GuildChannelGroupByOutputType[P]>
        }
      >
    >


  export type GuildChannelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    name?: boolean
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildChannel"]>

  export type GuildChannelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    name?: boolean
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildChannel"]>

  export type GuildChannelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    name?: boolean
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildChannel"]>

  export type GuildChannelSelectScalar = {
    id?: boolean
    guildId?: boolean
    name?: boolean
  }

  export type GuildChannelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "guildId" | "name", ExtArgs["result"]["guildChannel"]>
  export type GuildChannelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }
  export type GuildChannelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }
  export type GuildChannelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }

  export type $GuildChannelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GuildChannel"
    objects: {
      guild: Prisma.$GuildPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      guildId: number
      name: string
    }, ExtArgs["result"]["guildChannel"]>
    composites: {}
  }

  type GuildChannelGetPayload<S extends boolean | null | undefined | GuildChannelDefaultArgs> = $Result.GetResult<Prisma.$GuildChannelPayload, S>

  type GuildChannelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GuildChannelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuildChannelCountAggregateInputType | true
    }

  export interface GuildChannelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GuildChannel'], meta: { name: 'GuildChannel' } }
    /**
     * Find zero or one GuildChannel that matches the filter.
     * @param {GuildChannelFindUniqueArgs} args - Arguments to find a GuildChannel
     * @example
     * // Get one GuildChannel
     * const guildChannel = await prisma.guildChannel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuildChannelFindUniqueArgs>(args: SelectSubset<T, GuildChannelFindUniqueArgs<ExtArgs>>): Prisma__GuildChannelClient<$Result.GetResult<Prisma.$GuildChannelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GuildChannel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GuildChannelFindUniqueOrThrowArgs} args - Arguments to find a GuildChannel
     * @example
     * // Get one GuildChannel
     * const guildChannel = await prisma.guildChannel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuildChannelFindUniqueOrThrowArgs>(args: SelectSubset<T, GuildChannelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuildChannelClient<$Result.GetResult<Prisma.$GuildChannelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuildChannel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildChannelFindFirstArgs} args - Arguments to find a GuildChannel
     * @example
     * // Get one GuildChannel
     * const guildChannel = await prisma.guildChannel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuildChannelFindFirstArgs>(args?: SelectSubset<T, GuildChannelFindFirstArgs<ExtArgs>>): Prisma__GuildChannelClient<$Result.GetResult<Prisma.$GuildChannelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuildChannel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildChannelFindFirstOrThrowArgs} args - Arguments to find a GuildChannel
     * @example
     * // Get one GuildChannel
     * const guildChannel = await prisma.guildChannel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuildChannelFindFirstOrThrowArgs>(args?: SelectSubset<T, GuildChannelFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuildChannelClient<$Result.GetResult<Prisma.$GuildChannelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GuildChannels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildChannelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GuildChannels
     * const guildChannels = await prisma.guildChannel.findMany()
     * 
     * // Get first 10 GuildChannels
     * const guildChannels = await prisma.guildChannel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guildChannelWithIdOnly = await prisma.guildChannel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuildChannelFindManyArgs>(args?: SelectSubset<T, GuildChannelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildChannelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GuildChannel.
     * @param {GuildChannelCreateArgs} args - Arguments to create a GuildChannel.
     * @example
     * // Create one GuildChannel
     * const GuildChannel = await prisma.guildChannel.create({
     *   data: {
     *     // ... data to create a GuildChannel
     *   }
     * })
     * 
     */
    create<T extends GuildChannelCreateArgs>(args: SelectSubset<T, GuildChannelCreateArgs<ExtArgs>>): Prisma__GuildChannelClient<$Result.GetResult<Prisma.$GuildChannelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GuildChannels.
     * @param {GuildChannelCreateManyArgs} args - Arguments to create many GuildChannels.
     * @example
     * // Create many GuildChannels
     * const guildChannel = await prisma.guildChannel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuildChannelCreateManyArgs>(args?: SelectSubset<T, GuildChannelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GuildChannels and returns the data saved in the database.
     * @param {GuildChannelCreateManyAndReturnArgs} args - Arguments to create many GuildChannels.
     * @example
     * // Create many GuildChannels
     * const guildChannel = await prisma.guildChannel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GuildChannels and only return the `id`
     * const guildChannelWithIdOnly = await prisma.guildChannel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuildChannelCreateManyAndReturnArgs>(args?: SelectSubset<T, GuildChannelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildChannelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GuildChannel.
     * @param {GuildChannelDeleteArgs} args - Arguments to delete one GuildChannel.
     * @example
     * // Delete one GuildChannel
     * const GuildChannel = await prisma.guildChannel.delete({
     *   where: {
     *     // ... filter to delete one GuildChannel
     *   }
     * })
     * 
     */
    delete<T extends GuildChannelDeleteArgs>(args: SelectSubset<T, GuildChannelDeleteArgs<ExtArgs>>): Prisma__GuildChannelClient<$Result.GetResult<Prisma.$GuildChannelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GuildChannel.
     * @param {GuildChannelUpdateArgs} args - Arguments to update one GuildChannel.
     * @example
     * // Update one GuildChannel
     * const guildChannel = await prisma.guildChannel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuildChannelUpdateArgs>(args: SelectSubset<T, GuildChannelUpdateArgs<ExtArgs>>): Prisma__GuildChannelClient<$Result.GetResult<Prisma.$GuildChannelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GuildChannels.
     * @param {GuildChannelDeleteManyArgs} args - Arguments to filter GuildChannels to delete.
     * @example
     * // Delete a few GuildChannels
     * const { count } = await prisma.guildChannel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuildChannelDeleteManyArgs>(args?: SelectSubset<T, GuildChannelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuildChannels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildChannelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GuildChannels
     * const guildChannel = await prisma.guildChannel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuildChannelUpdateManyArgs>(args: SelectSubset<T, GuildChannelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuildChannels and returns the data updated in the database.
     * @param {GuildChannelUpdateManyAndReturnArgs} args - Arguments to update many GuildChannels.
     * @example
     * // Update many GuildChannels
     * const guildChannel = await prisma.guildChannel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GuildChannels and only return the `id`
     * const guildChannelWithIdOnly = await prisma.guildChannel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GuildChannelUpdateManyAndReturnArgs>(args: SelectSubset<T, GuildChannelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildChannelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GuildChannel.
     * @param {GuildChannelUpsertArgs} args - Arguments to update or create a GuildChannel.
     * @example
     * // Update or create a GuildChannel
     * const guildChannel = await prisma.guildChannel.upsert({
     *   create: {
     *     // ... data to create a GuildChannel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GuildChannel we want to update
     *   }
     * })
     */
    upsert<T extends GuildChannelUpsertArgs>(args: SelectSubset<T, GuildChannelUpsertArgs<ExtArgs>>): Prisma__GuildChannelClient<$Result.GetResult<Prisma.$GuildChannelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GuildChannels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildChannelCountArgs} args - Arguments to filter GuildChannels to count.
     * @example
     * // Count the number of GuildChannels
     * const count = await prisma.guildChannel.count({
     *   where: {
     *     // ... the filter for the GuildChannels we want to count
     *   }
     * })
    **/
    count<T extends GuildChannelCountArgs>(
      args?: Subset<T, GuildChannelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuildChannelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GuildChannel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildChannelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GuildChannelAggregateArgs>(args: Subset<T, GuildChannelAggregateArgs>): Prisma.PrismaPromise<GetGuildChannelAggregateType<T>>

    /**
     * Group by GuildChannel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildChannelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GuildChannelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuildChannelGroupByArgs['orderBy'] }
        : { orderBy?: GuildChannelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GuildChannelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuildChannelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GuildChannel model
   */
  readonly fields: GuildChannelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GuildChannel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuildChannelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    guild<T extends GuildDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GuildDefaultArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GuildChannel model
   */
  interface GuildChannelFieldRefs {
    readonly id: FieldRef<"GuildChannel", 'Int'>
    readonly guildId: FieldRef<"GuildChannel", 'Int'>
    readonly name: FieldRef<"GuildChannel", 'String'>
  }
    

  // Custom InputTypes
  /**
   * GuildChannel findUnique
   */
  export type GuildChannelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildChannel
     */
    select?: GuildChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildChannel
     */
    omit?: GuildChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildChannelInclude<ExtArgs> | null
    /**
     * Filter, which GuildChannel to fetch.
     */
    where: GuildChannelWhereUniqueInput
  }

  /**
   * GuildChannel findUniqueOrThrow
   */
  export type GuildChannelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildChannel
     */
    select?: GuildChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildChannel
     */
    omit?: GuildChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildChannelInclude<ExtArgs> | null
    /**
     * Filter, which GuildChannel to fetch.
     */
    where: GuildChannelWhereUniqueInput
  }

  /**
   * GuildChannel findFirst
   */
  export type GuildChannelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildChannel
     */
    select?: GuildChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildChannel
     */
    omit?: GuildChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildChannelInclude<ExtArgs> | null
    /**
     * Filter, which GuildChannel to fetch.
     */
    where?: GuildChannelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildChannels to fetch.
     */
    orderBy?: GuildChannelOrderByWithRelationInput | GuildChannelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildChannels.
     */
    cursor?: GuildChannelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildChannels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildChannels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildChannels.
     */
    distinct?: GuildChannelScalarFieldEnum | GuildChannelScalarFieldEnum[]
  }

  /**
   * GuildChannel findFirstOrThrow
   */
  export type GuildChannelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildChannel
     */
    select?: GuildChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildChannel
     */
    omit?: GuildChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildChannelInclude<ExtArgs> | null
    /**
     * Filter, which GuildChannel to fetch.
     */
    where?: GuildChannelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildChannels to fetch.
     */
    orderBy?: GuildChannelOrderByWithRelationInput | GuildChannelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildChannels.
     */
    cursor?: GuildChannelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildChannels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildChannels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildChannels.
     */
    distinct?: GuildChannelScalarFieldEnum | GuildChannelScalarFieldEnum[]
  }

  /**
   * GuildChannel findMany
   */
  export type GuildChannelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildChannel
     */
    select?: GuildChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildChannel
     */
    omit?: GuildChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildChannelInclude<ExtArgs> | null
    /**
     * Filter, which GuildChannels to fetch.
     */
    where?: GuildChannelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildChannels to fetch.
     */
    orderBy?: GuildChannelOrderByWithRelationInput | GuildChannelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GuildChannels.
     */
    cursor?: GuildChannelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildChannels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildChannels.
     */
    skip?: number
    distinct?: GuildChannelScalarFieldEnum | GuildChannelScalarFieldEnum[]
  }

  /**
   * GuildChannel create
   */
  export type GuildChannelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildChannel
     */
    select?: GuildChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildChannel
     */
    omit?: GuildChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildChannelInclude<ExtArgs> | null
    /**
     * The data needed to create a GuildChannel.
     */
    data: XOR<GuildChannelCreateInput, GuildChannelUncheckedCreateInput>
  }

  /**
   * GuildChannel createMany
   */
  export type GuildChannelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GuildChannels.
     */
    data: GuildChannelCreateManyInput | GuildChannelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuildChannel createManyAndReturn
   */
  export type GuildChannelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildChannel
     */
    select?: GuildChannelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuildChannel
     */
    omit?: GuildChannelOmit<ExtArgs> | null
    /**
     * The data used to create many GuildChannels.
     */
    data: GuildChannelCreateManyInput | GuildChannelCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildChannelIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuildChannel update
   */
  export type GuildChannelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildChannel
     */
    select?: GuildChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildChannel
     */
    omit?: GuildChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildChannelInclude<ExtArgs> | null
    /**
     * The data needed to update a GuildChannel.
     */
    data: XOR<GuildChannelUpdateInput, GuildChannelUncheckedUpdateInput>
    /**
     * Choose, which GuildChannel to update.
     */
    where: GuildChannelWhereUniqueInput
  }

  /**
   * GuildChannel updateMany
   */
  export type GuildChannelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GuildChannels.
     */
    data: XOR<GuildChannelUpdateManyMutationInput, GuildChannelUncheckedUpdateManyInput>
    /**
     * Filter which GuildChannels to update
     */
    where?: GuildChannelWhereInput
    /**
     * Limit how many GuildChannels to update.
     */
    limit?: number
  }

  /**
   * GuildChannel updateManyAndReturn
   */
  export type GuildChannelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildChannel
     */
    select?: GuildChannelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuildChannel
     */
    omit?: GuildChannelOmit<ExtArgs> | null
    /**
     * The data used to update GuildChannels.
     */
    data: XOR<GuildChannelUpdateManyMutationInput, GuildChannelUncheckedUpdateManyInput>
    /**
     * Filter which GuildChannels to update
     */
    where?: GuildChannelWhereInput
    /**
     * Limit how many GuildChannels to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildChannelIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuildChannel upsert
   */
  export type GuildChannelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildChannel
     */
    select?: GuildChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildChannel
     */
    omit?: GuildChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildChannelInclude<ExtArgs> | null
    /**
     * The filter to search for the GuildChannel to update in case it exists.
     */
    where: GuildChannelWhereUniqueInput
    /**
     * In case the GuildChannel found by the `where` argument doesn't exist, create a new GuildChannel with this data.
     */
    create: XOR<GuildChannelCreateInput, GuildChannelUncheckedCreateInput>
    /**
     * In case the GuildChannel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuildChannelUpdateInput, GuildChannelUncheckedUpdateInput>
  }

  /**
   * GuildChannel delete
   */
  export type GuildChannelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildChannel
     */
    select?: GuildChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildChannel
     */
    omit?: GuildChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildChannelInclude<ExtArgs> | null
    /**
     * Filter which GuildChannel to delete.
     */
    where: GuildChannelWhereUniqueInput
  }

  /**
   * GuildChannel deleteMany
   */
  export type GuildChannelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildChannels to delete
     */
    where?: GuildChannelWhereInput
    /**
     * Limit how many GuildChannels to delete.
     */
    limit?: number
  }

  /**
   * GuildChannel without action
   */
  export type GuildChannelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildChannel
     */
    select?: GuildChannelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildChannel
     */
    omit?: GuildChannelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildChannelInclude<ExtArgs> | null
  }


  /**
   * Model GuildCurrency
   */

  export type AggregateGuildCurrency = {
    _count: GuildCurrencyCountAggregateOutputType | null
    _avg: GuildCurrencyAvgAggregateOutputType | null
    _sum: GuildCurrencySumAggregateOutputType | null
    _min: GuildCurrencyMinAggregateOutputType | null
    _max: GuildCurrencyMaxAggregateOutputType | null
  }

  export type GuildCurrencyAvgAggregateOutputType = {
    id: number | null
    guildId: number | null
    value: number | null
  }

  export type GuildCurrencySumAggregateOutputType = {
    id: number | null
    guildId: number | null
    value: number | null
  }

  export type GuildCurrencyMinAggregateOutputType = {
    id: number | null
    guildId: number | null
    name: string | null
    value: number | null
  }

  export type GuildCurrencyMaxAggregateOutputType = {
    id: number | null
    guildId: number | null
    name: string | null
    value: number | null
  }

  export type GuildCurrencyCountAggregateOutputType = {
    id: number
    guildId: number
    name: number
    value: number
    _all: number
  }


  export type GuildCurrencyAvgAggregateInputType = {
    id?: true
    guildId?: true
    value?: true
  }

  export type GuildCurrencySumAggregateInputType = {
    id?: true
    guildId?: true
    value?: true
  }

  export type GuildCurrencyMinAggregateInputType = {
    id?: true
    guildId?: true
    name?: true
    value?: true
  }

  export type GuildCurrencyMaxAggregateInputType = {
    id?: true
    guildId?: true
    name?: true
    value?: true
  }

  export type GuildCurrencyCountAggregateInputType = {
    id?: true
    guildId?: true
    name?: true
    value?: true
    _all?: true
  }

  export type GuildCurrencyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildCurrency to aggregate.
     */
    where?: GuildCurrencyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildCurrencies to fetch.
     */
    orderBy?: GuildCurrencyOrderByWithRelationInput | GuildCurrencyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuildCurrencyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildCurrencies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildCurrencies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GuildCurrencies
    **/
    _count?: true | GuildCurrencyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GuildCurrencyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GuildCurrencySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuildCurrencyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuildCurrencyMaxAggregateInputType
  }

  export type GetGuildCurrencyAggregateType<T extends GuildCurrencyAggregateArgs> = {
        [P in keyof T & keyof AggregateGuildCurrency]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuildCurrency[P]>
      : GetScalarType<T[P], AggregateGuildCurrency[P]>
  }




  export type GuildCurrencyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildCurrencyWhereInput
    orderBy?: GuildCurrencyOrderByWithAggregationInput | GuildCurrencyOrderByWithAggregationInput[]
    by: GuildCurrencyScalarFieldEnum[] | GuildCurrencyScalarFieldEnum
    having?: GuildCurrencyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuildCurrencyCountAggregateInputType | true
    _avg?: GuildCurrencyAvgAggregateInputType
    _sum?: GuildCurrencySumAggregateInputType
    _min?: GuildCurrencyMinAggregateInputType
    _max?: GuildCurrencyMaxAggregateInputType
  }

  export type GuildCurrencyGroupByOutputType = {
    id: number
    guildId: number
    name: string
    value: number
    _count: GuildCurrencyCountAggregateOutputType | null
    _avg: GuildCurrencyAvgAggregateOutputType | null
    _sum: GuildCurrencySumAggregateOutputType | null
    _min: GuildCurrencyMinAggregateOutputType | null
    _max: GuildCurrencyMaxAggregateOutputType | null
  }

  type GetGuildCurrencyGroupByPayload<T extends GuildCurrencyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuildCurrencyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuildCurrencyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuildCurrencyGroupByOutputType[P]>
            : GetScalarType<T[P], GuildCurrencyGroupByOutputType[P]>
        }
      >
    >


  export type GuildCurrencySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    name?: boolean
    value?: boolean
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildCurrency"]>

  export type GuildCurrencySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    name?: boolean
    value?: boolean
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildCurrency"]>

  export type GuildCurrencySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    name?: boolean
    value?: boolean
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildCurrency"]>

  export type GuildCurrencySelectScalar = {
    id?: boolean
    guildId?: boolean
    name?: boolean
    value?: boolean
  }

  export type GuildCurrencyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "guildId" | "name" | "value", ExtArgs["result"]["guildCurrency"]>
  export type GuildCurrencyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }
  export type GuildCurrencyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }
  export type GuildCurrencyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }

  export type $GuildCurrencyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GuildCurrency"
    objects: {
      guild: Prisma.$GuildPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      guildId: number
      name: string
      value: number
    }, ExtArgs["result"]["guildCurrency"]>
    composites: {}
  }

  type GuildCurrencyGetPayload<S extends boolean | null | undefined | GuildCurrencyDefaultArgs> = $Result.GetResult<Prisma.$GuildCurrencyPayload, S>

  type GuildCurrencyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GuildCurrencyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuildCurrencyCountAggregateInputType | true
    }

  export interface GuildCurrencyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GuildCurrency'], meta: { name: 'GuildCurrency' } }
    /**
     * Find zero or one GuildCurrency that matches the filter.
     * @param {GuildCurrencyFindUniqueArgs} args - Arguments to find a GuildCurrency
     * @example
     * // Get one GuildCurrency
     * const guildCurrency = await prisma.guildCurrency.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuildCurrencyFindUniqueArgs>(args: SelectSubset<T, GuildCurrencyFindUniqueArgs<ExtArgs>>): Prisma__GuildCurrencyClient<$Result.GetResult<Prisma.$GuildCurrencyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GuildCurrency that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GuildCurrencyFindUniqueOrThrowArgs} args - Arguments to find a GuildCurrency
     * @example
     * // Get one GuildCurrency
     * const guildCurrency = await prisma.guildCurrency.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuildCurrencyFindUniqueOrThrowArgs>(args: SelectSubset<T, GuildCurrencyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuildCurrencyClient<$Result.GetResult<Prisma.$GuildCurrencyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuildCurrency that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildCurrencyFindFirstArgs} args - Arguments to find a GuildCurrency
     * @example
     * // Get one GuildCurrency
     * const guildCurrency = await prisma.guildCurrency.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuildCurrencyFindFirstArgs>(args?: SelectSubset<T, GuildCurrencyFindFirstArgs<ExtArgs>>): Prisma__GuildCurrencyClient<$Result.GetResult<Prisma.$GuildCurrencyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuildCurrency that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildCurrencyFindFirstOrThrowArgs} args - Arguments to find a GuildCurrency
     * @example
     * // Get one GuildCurrency
     * const guildCurrency = await prisma.guildCurrency.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuildCurrencyFindFirstOrThrowArgs>(args?: SelectSubset<T, GuildCurrencyFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuildCurrencyClient<$Result.GetResult<Prisma.$GuildCurrencyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GuildCurrencies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildCurrencyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GuildCurrencies
     * const guildCurrencies = await prisma.guildCurrency.findMany()
     * 
     * // Get first 10 GuildCurrencies
     * const guildCurrencies = await prisma.guildCurrency.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guildCurrencyWithIdOnly = await prisma.guildCurrency.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuildCurrencyFindManyArgs>(args?: SelectSubset<T, GuildCurrencyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildCurrencyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GuildCurrency.
     * @param {GuildCurrencyCreateArgs} args - Arguments to create a GuildCurrency.
     * @example
     * // Create one GuildCurrency
     * const GuildCurrency = await prisma.guildCurrency.create({
     *   data: {
     *     // ... data to create a GuildCurrency
     *   }
     * })
     * 
     */
    create<T extends GuildCurrencyCreateArgs>(args: SelectSubset<T, GuildCurrencyCreateArgs<ExtArgs>>): Prisma__GuildCurrencyClient<$Result.GetResult<Prisma.$GuildCurrencyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GuildCurrencies.
     * @param {GuildCurrencyCreateManyArgs} args - Arguments to create many GuildCurrencies.
     * @example
     * // Create many GuildCurrencies
     * const guildCurrency = await prisma.guildCurrency.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuildCurrencyCreateManyArgs>(args?: SelectSubset<T, GuildCurrencyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GuildCurrencies and returns the data saved in the database.
     * @param {GuildCurrencyCreateManyAndReturnArgs} args - Arguments to create many GuildCurrencies.
     * @example
     * // Create many GuildCurrencies
     * const guildCurrency = await prisma.guildCurrency.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GuildCurrencies and only return the `id`
     * const guildCurrencyWithIdOnly = await prisma.guildCurrency.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuildCurrencyCreateManyAndReturnArgs>(args?: SelectSubset<T, GuildCurrencyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildCurrencyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GuildCurrency.
     * @param {GuildCurrencyDeleteArgs} args - Arguments to delete one GuildCurrency.
     * @example
     * // Delete one GuildCurrency
     * const GuildCurrency = await prisma.guildCurrency.delete({
     *   where: {
     *     // ... filter to delete one GuildCurrency
     *   }
     * })
     * 
     */
    delete<T extends GuildCurrencyDeleteArgs>(args: SelectSubset<T, GuildCurrencyDeleteArgs<ExtArgs>>): Prisma__GuildCurrencyClient<$Result.GetResult<Prisma.$GuildCurrencyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GuildCurrency.
     * @param {GuildCurrencyUpdateArgs} args - Arguments to update one GuildCurrency.
     * @example
     * // Update one GuildCurrency
     * const guildCurrency = await prisma.guildCurrency.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuildCurrencyUpdateArgs>(args: SelectSubset<T, GuildCurrencyUpdateArgs<ExtArgs>>): Prisma__GuildCurrencyClient<$Result.GetResult<Prisma.$GuildCurrencyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GuildCurrencies.
     * @param {GuildCurrencyDeleteManyArgs} args - Arguments to filter GuildCurrencies to delete.
     * @example
     * // Delete a few GuildCurrencies
     * const { count } = await prisma.guildCurrency.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuildCurrencyDeleteManyArgs>(args?: SelectSubset<T, GuildCurrencyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuildCurrencies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildCurrencyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GuildCurrencies
     * const guildCurrency = await prisma.guildCurrency.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuildCurrencyUpdateManyArgs>(args: SelectSubset<T, GuildCurrencyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuildCurrencies and returns the data updated in the database.
     * @param {GuildCurrencyUpdateManyAndReturnArgs} args - Arguments to update many GuildCurrencies.
     * @example
     * // Update many GuildCurrencies
     * const guildCurrency = await prisma.guildCurrency.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GuildCurrencies and only return the `id`
     * const guildCurrencyWithIdOnly = await prisma.guildCurrency.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GuildCurrencyUpdateManyAndReturnArgs>(args: SelectSubset<T, GuildCurrencyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildCurrencyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GuildCurrency.
     * @param {GuildCurrencyUpsertArgs} args - Arguments to update or create a GuildCurrency.
     * @example
     * // Update or create a GuildCurrency
     * const guildCurrency = await prisma.guildCurrency.upsert({
     *   create: {
     *     // ... data to create a GuildCurrency
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GuildCurrency we want to update
     *   }
     * })
     */
    upsert<T extends GuildCurrencyUpsertArgs>(args: SelectSubset<T, GuildCurrencyUpsertArgs<ExtArgs>>): Prisma__GuildCurrencyClient<$Result.GetResult<Prisma.$GuildCurrencyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GuildCurrencies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildCurrencyCountArgs} args - Arguments to filter GuildCurrencies to count.
     * @example
     * // Count the number of GuildCurrencies
     * const count = await prisma.guildCurrency.count({
     *   where: {
     *     // ... the filter for the GuildCurrencies we want to count
     *   }
     * })
    **/
    count<T extends GuildCurrencyCountArgs>(
      args?: Subset<T, GuildCurrencyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuildCurrencyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GuildCurrency.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildCurrencyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GuildCurrencyAggregateArgs>(args: Subset<T, GuildCurrencyAggregateArgs>): Prisma.PrismaPromise<GetGuildCurrencyAggregateType<T>>

    /**
     * Group by GuildCurrency.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildCurrencyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GuildCurrencyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuildCurrencyGroupByArgs['orderBy'] }
        : { orderBy?: GuildCurrencyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GuildCurrencyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuildCurrencyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GuildCurrency model
   */
  readonly fields: GuildCurrencyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GuildCurrency.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuildCurrencyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    guild<T extends GuildDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GuildDefaultArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GuildCurrency model
   */
  interface GuildCurrencyFieldRefs {
    readonly id: FieldRef<"GuildCurrency", 'Int'>
    readonly guildId: FieldRef<"GuildCurrency", 'Int'>
    readonly name: FieldRef<"GuildCurrency", 'String'>
    readonly value: FieldRef<"GuildCurrency", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * GuildCurrency findUnique
   */
  export type GuildCurrencyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCurrency
     */
    select?: GuildCurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildCurrency
     */
    omit?: GuildCurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildCurrencyInclude<ExtArgs> | null
    /**
     * Filter, which GuildCurrency to fetch.
     */
    where: GuildCurrencyWhereUniqueInput
  }

  /**
   * GuildCurrency findUniqueOrThrow
   */
  export type GuildCurrencyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCurrency
     */
    select?: GuildCurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildCurrency
     */
    omit?: GuildCurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildCurrencyInclude<ExtArgs> | null
    /**
     * Filter, which GuildCurrency to fetch.
     */
    where: GuildCurrencyWhereUniqueInput
  }

  /**
   * GuildCurrency findFirst
   */
  export type GuildCurrencyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCurrency
     */
    select?: GuildCurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildCurrency
     */
    omit?: GuildCurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildCurrencyInclude<ExtArgs> | null
    /**
     * Filter, which GuildCurrency to fetch.
     */
    where?: GuildCurrencyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildCurrencies to fetch.
     */
    orderBy?: GuildCurrencyOrderByWithRelationInput | GuildCurrencyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildCurrencies.
     */
    cursor?: GuildCurrencyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildCurrencies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildCurrencies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildCurrencies.
     */
    distinct?: GuildCurrencyScalarFieldEnum | GuildCurrencyScalarFieldEnum[]
  }

  /**
   * GuildCurrency findFirstOrThrow
   */
  export type GuildCurrencyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCurrency
     */
    select?: GuildCurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildCurrency
     */
    omit?: GuildCurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildCurrencyInclude<ExtArgs> | null
    /**
     * Filter, which GuildCurrency to fetch.
     */
    where?: GuildCurrencyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildCurrencies to fetch.
     */
    orderBy?: GuildCurrencyOrderByWithRelationInput | GuildCurrencyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildCurrencies.
     */
    cursor?: GuildCurrencyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildCurrencies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildCurrencies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildCurrencies.
     */
    distinct?: GuildCurrencyScalarFieldEnum | GuildCurrencyScalarFieldEnum[]
  }

  /**
   * GuildCurrency findMany
   */
  export type GuildCurrencyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCurrency
     */
    select?: GuildCurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildCurrency
     */
    omit?: GuildCurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildCurrencyInclude<ExtArgs> | null
    /**
     * Filter, which GuildCurrencies to fetch.
     */
    where?: GuildCurrencyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildCurrencies to fetch.
     */
    orderBy?: GuildCurrencyOrderByWithRelationInput | GuildCurrencyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GuildCurrencies.
     */
    cursor?: GuildCurrencyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildCurrencies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildCurrencies.
     */
    skip?: number
    distinct?: GuildCurrencyScalarFieldEnum | GuildCurrencyScalarFieldEnum[]
  }

  /**
   * GuildCurrency create
   */
  export type GuildCurrencyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCurrency
     */
    select?: GuildCurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildCurrency
     */
    omit?: GuildCurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildCurrencyInclude<ExtArgs> | null
    /**
     * The data needed to create a GuildCurrency.
     */
    data: XOR<GuildCurrencyCreateInput, GuildCurrencyUncheckedCreateInput>
  }

  /**
   * GuildCurrency createMany
   */
  export type GuildCurrencyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GuildCurrencies.
     */
    data: GuildCurrencyCreateManyInput | GuildCurrencyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuildCurrency createManyAndReturn
   */
  export type GuildCurrencyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCurrency
     */
    select?: GuildCurrencySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuildCurrency
     */
    omit?: GuildCurrencyOmit<ExtArgs> | null
    /**
     * The data used to create many GuildCurrencies.
     */
    data: GuildCurrencyCreateManyInput | GuildCurrencyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildCurrencyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuildCurrency update
   */
  export type GuildCurrencyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCurrency
     */
    select?: GuildCurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildCurrency
     */
    omit?: GuildCurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildCurrencyInclude<ExtArgs> | null
    /**
     * The data needed to update a GuildCurrency.
     */
    data: XOR<GuildCurrencyUpdateInput, GuildCurrencyUncheckedUpdateInput>
    /**
     * Choose, which GuildCurrency to update.
     */
    where: GuildCurrencyWhereUniqueInput
  }

  /**
   * GuildCurrency updateMany
   */
  export type GuildCurrencyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GuildCurrencies.
     */
    data: XOR<GuildCurrencyUpdateManyMutationInput, GuildCurrencyUncheckedUpdateManyInput>
    /**
     * Filter which GuildCurrencies to update
     */
    where?: GuildCurrencyWhereInput
    /**
     * Limit how many GuildCurrencies to update.
     */
    limit?: number
  }

  /**
   * GuildCurrency updateManyAndReturn
   */
  export type GuildCurrencyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCurrency
     */
    select?: GuildCurrencySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuildCurrency
     */
    omit?: GuildCurrencyOmit<ExtArgs> | null
    /**
     * The data used to update GuildCurrencies.
     */
    data: XOR<GuildCurrencyUpdateManyMutationInput, GuildCurrencyUncheckedUpdateManyInput>
    /**
     * Filter which GuildCurrencies to update
     */
    where?: GuildCurrencyWhereInput
    /**
     * Limit how many GuildCurrencies to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildCurrencyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuildCurrency upsert
   */
  export type GuildCurrencyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCurrency
     */
    select?: GuildCurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildCurrency
     */
    omit?: GuildCurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildCurrencyInclude<ExtArgs> | null
    /**
     * The filter to search for the GuildCurrency to update in case it exists.
     */
    where: GuildCurrencyWhereUniqueInput
    /**
     * In case the GuildCurrency found by the `where` argument doesn't exist, create a new GuildCurrency with this data.
     */
    create: XOR<GuildCurrencyCreateInput, GuildCurrencyUncheckedCreateInput>
    /**
     * In case the GuildCurrency was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuildCurrencyUpdateInput, GuildCurrencyUncheckedUpdateInput>
  }

  /**
   * GuildCurrency delete
   */
  export type GuildCurrencyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCurrency
     */
    select?: GuildCurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildCurrency
     */
    omit?: GuildCurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildCurrencyInclude<ExtArgs> | null
    /**
     * Filter which GuildCurrency to delete.
     */
    where: GuildCurrencyWhereUniqueInput
  }

  /**
   * GuildCurrency deleteMany
   */
  export type GuildCurrencyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildCurrencies to delete
     */
    where?: GuildCurrencyWhereInput
    /**
     * Limit how many GuildCurrencies to delete.
     */
    limit?: number
  }

  /**
   * GuildCurrency without action
   */
  export type GuildCurrencyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCurrency
     */
    select?: GuildCurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildCurrency
     */
    omit?: GuildCurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildCurrencyInclude<ExtArgs> | null
  }


  /**
   * Model GuildRemovalReason
   */

  export type AggregateGuildRemovalReason = {
    _count: GuildRemovalReasonCountAggregateOutputType | null
    _avg: GuildRemovalReasonAvgAggregateOutputType | null
    _sum: GuildRemovalReasonSumAggregateOutputType | null
    _min: GuildRemovalReasonMinAggregateOutputType | null
    _max: GuildRemovalReasonMaxAggregateOutputType | null
  }

  export type GuildRemovalReasonAvgAggregateOutputType = {
    id: number | null
    guildId: number | null
  }

  export type GuildRemovalReasonSumAggregateOutputType = {
    id: number | null
    guildId: number | null
  }

  export type GuildRemovalReasonMinAggregateOutputType = {
    id: number | null
    guildId: number | null
    reason: string | null
  }

  export type GuildRemovalReasonMaxAggregateOutputType = {
    id: number | null
    guildId: number | null
    reason: string | null
  }

  export type GuildRemovalReasonCountAggregateOutputType = {
    id: number
    guildId: number
    reason: number
    _all: number
  }


  export type GuildRemovalReasonAvgAggregateInputType = {
    id?: true
    guildId?: true
  }

  export type GuildRemovalReasonSumAggregateInputType = {
    id?: true
    guildId?: true
  }

  export type GuildRemovalReasonMinAggregateInputType = {
    id?: true
    guildId?: true
    reason?: true
  }

  export type GuildRemovalReasonMaxAggregateInputType = {
    id?: true
    guildId?: true
    reason?: true
  }

  export type GuildRemovalReasonCountAggregateInputType = {
    id?: true
    guildId?: true
    reason?: true
    _all?: true
  }

  export type GuildRemovalReasonAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildRemovalReason to aggregate.
     */
    where?: GuildRemovalReasonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildRemovalReasons to fetch.
     */
    orderBy?: GuildRemovalReasonOrderByWithRelationInput | GuildRemovalReasonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuildRemovalReasonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildRemovalReasons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildRemovalReasons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GuildRemovalReasons
    **/
    _count?: true | GuildRemovalReasonCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GuildRemovalReasonAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GuildRemovalReasonSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuildRemovalReasonMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuildRemovalReasonMaxAggregateInputType
  }

  export type GetGuildRemovalReasonAggregateType<T extends GuildRemovalReasonAggregateArgs> = {
        [P in keyof T & keyof AggregateGuildRemovalReason]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuildRemovalReason[P]>
      : GetScalarType<T[P], AggregateGuildRemovalReason[P]>
  }




  export type GuildRemovalReasonGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildRemovalReasonWhereInput
    orderBy?: GuildRemovalReasonOrderByWithAggregationInput | GuildRemovalReasonOrderByWithAggregationInput[]
    by: GuildRemovalReasonScalarFieldEnum[] | GuildRemovalReasonScalarFieldEnum
    having?: GuildRemovalReasonScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuildRemovalReasonCountAggregateInputType | true
    _avg?: GuildRemovalReasonAvgAggregateInputType
    _sum?: GuildRemovalReasonSumAggregateInputType
    _min?: GuildRemovalReasonMinAggregateInputType
    _max?: GuildRemovalReasonMaxAggregateInputType
  }

  export type GuildRemovalReasonGroupByOutputType = {
    id: number
    guildId: number
    reason: string
    _count: GuildRemovalReasonCountAggregateOutputType | null
    _avg: GuildRemovalReasonAvgAggregateOutputType | null
    _sum: GuildRemovalReasonSumAggregateOutputType | null
    _min: GuildRemovalReasonMinAggregateOutputType | null
    _max: GuildRemovalReasonMaxAggregateOutputType | null
  }

  type GetGuildRemovalReasonGroupByPayload<T extends GuildRemovalReasonGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuildRemovalReasonGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuildRemovalReasonGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuildRemovalReasonGroupByOutputType[P]>
            : GetScalarType<T[P], GuildRemovalReasonGroupByOutputType[P]>
        }
      >
    >


  export type GuildRemovalReasonSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    reason?: boolean
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildRemovalReason"]>

  export type GuildRemovalReasonSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    reason?: boolean
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildRemovalReason"]>

  export type GuildRemovalReasonSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    reason?: boolean
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildRemovalReason"]>

  export type GuildRemovalReasonSelectScalar = {
    id?: boolean
    guildId?: boolean
    reason?: boolean
  }

  export type GuildRemovalReasonOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "guildId" | "reason", ExtArgs["result"]["guildRemovalReason"]>
  export type GuildRemovalReasonInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }
  export type GuildRemovalReasonIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }
  export type GuildRemovalReasonIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }

  export type $GuildRemovalReasonPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GuildRemovalReason"
    objects: {
      guild: Prisma.$GuildPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      guildId: number
      reason: string
    }, ExtArgs["result"]["guildRemovalReason"]>
    composites: {}
  }

  type GuildRemovalReasonGetPayload<S extends boolean | null | undefined | GuildRemovalReasonDefaultArgs> = $Result.GetResult<Prisma.$GuildRemovalReasonPayload, S>

  type GuildRemovalReasonCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GuildRemovalReasonFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuildRemovalReasonCountAggregateInputType | true
    }

  export interface GuildRemovalReasonDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GuildRemovalReason'], meta: { name: 'GuildRemovalReason' } }
    /**
     * Find zero or one GuildRemovalReason that matches the filter.
     * @param {GuildRemovalReasonFindUniqueArgs} args - Arguments to find a GuildRemovalReason
     * @example
     * // Get one GuildRemovalReason
     * const guildRemovalReason = await prisma.guildRemovalReason.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuildRemovalReasonFindUniqueArgs>(args: SelectSubset<T, GuildRemovalReasonFindUniqueArgs<ExtArgs>>): Prisma__GuildRemovalReasonClient<$Result.GetResult<Prisma.$GuildRemovalReasonPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GuildRemovalReason that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GuildRemovalReasonFindUniqueOrThrowArgs} args - Arguments to find a GuildRemovalReason
     * @example
     * // Get one GuildRemovalReason
     * const guildRemovalReason = await prisma.guildRemovalReason.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuildRemovalReasonFindUniqueOrThrowArgs>(args: SelectSubset<T, GuildRemovalReasonFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuildRemovalReasonClient<$Result.GetResult<Prisma.$GuildRemovalReasonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuildRemovalReason that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRemovalReasonFindFirstArgs} args - Arguments to find a GuildRemovalReason
     * @example
     * // Get one GuildRemovalReason
     * const guildRemovalReason = await prisma.guildRemovalReason.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuildRemovalReasonFindFirstArgs>(args?: SelectSubset<T, GuildRemovalReasonFindFirstArgs<ExtArgs>>): Prisma__GuildRemovalReasonClient<$Result.GetResult<Prisma.$GuildRemovalReasonPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuildRemovalReason that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRemovalReasonFindFirstOrThrowArgs} args - Arguments to find a GuildRemovalReason
     * @example
     * // Get one GuildRemovalReason
     * const guildRemovalReason = await prisma.guildRemovalReason.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuildRemovalReasonFindFirstOrThrowArgs>(args?: SelectSubset<T, GuildRemovalReasonFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuildRemovalReasonClient<$Result.GetResult<Prisma.$GuildRemovalReasonPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GuildRemovalReasons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRemovalReasonFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GuildRemovalReasons
     * const guildRemovalReasons = await prisma.guildRemovalReason.findMany()
     * 
     * // Get first 10 GuildRemovalReasons
     * const guildRemovalReasons = await prisma.guildRemovalReason.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guildRemovalReasonWithIdOnly = await prisma.guildRemovalReason.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuildRemovalReasonFindManyArgs>(args?: SelectSubset<T, GuildRemovalReasonFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildRemovalReasonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GuildRemovalReason.
     * @param {GuildRemovalReasonCreateArgs} args - Arguments to create a GuildRemovalReason.
     * @example
     * // Create one GuildRemovalReason
     * const GuildRemovalReason = await prisma.guildRemovalReason.create({
     *   data: {
     *     // ... data to create a GuildRemovalReason
     *   }
     * })
     * 
     */
    create<T extends GuildRemovalReasonCreateArgs>(args: SelectSubset<T, GuildRemovalReasonCreateArgs<ExtArgs>>): Prisma__GuildRemovalReasonClient<$Result.GetResult<Prisma.$GuildRemovalReasonPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GuildRemovalReasons.
     * @param {GuildRemovalReasonCreateManyArgs} args - Arguments to create many GuildRemovalReasons.
     * @example
     * // Create many GuildRemovalReasons
     * const guildRemovalReason = await prisma.guildRemovalReason.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuildRemovalReasonCreateManyArgs>(args?: SelectSubset<T, GuildRemovalReasonCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GuildRemovalReasons and returns the data saved in the database.
     * @param {GuildRemovalReasonCreateManyAndReturnArgs} args - Arguments to create many GuildRemovalReasons.
     * @example
     * // Create many GuildRemovalReasons
     * const guildRemovalReason = await prisma.guildRemovalReason.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GuildRemovalReasons and only return the `id`
     * const guildRemovalReasonWithIdOnly = await prisma.guildRemovalReason.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuildRemovalReasonCreateManyAndReturnArgs>(args?: SelectSubset<T, GuildRemovalReasonCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildRemovalReasonPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GuildRemovalReason.
     * @param {GuildRemovalReasonDeleteArgs} args - Arguments to delete one GuildRemovalReason.
     * @example
     * // Delete one GuildRemovalReason
     * const GuildRemovalReason = await prisma.guildRemovalReason.delete({
     *   where: {
     *     // ... filter to delete one GuildRemovalReason
     *   }
     * })
     * 
     */
    delete<T extends GuildRemovalReasonDeleteArgs>(args: SelectSubset<T, GuildRemovalReasonDeleteArgs<ExtArgs>>): Prisma__GuildRemovalReasonClient<$Result.GetResult<Prisma.$GuildRemovalReasonPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GuildRemovalReason.
     * @param {GuildRemovalReasonUpdateArgs} args - Arguments to update one GuildRemovalReason.
     * @example
     * // Update one GuildRemovalReason
     * const guildRemovalReason = await prisma.guildRemovalReason.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuildRemovalReasonUpdateArgs>(args: SelectSubset<T, GuildRemovalReasonUpdateArgs<ExtArgs>>): Prisma__GuildRemovalReasonClient<$Result.GetResult<Prisma.$GuildRemovalReasonPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GuildRemovalReasons.
     * @param {GuildRemovalReasonDeleteManyArgs} args - Arguments to filter GuildRemovalReasons to delete.
     * @example
     * // Delete a few GuildRemovalReasons
     * const { count } = await prisma.guildRemovalReason.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuildRemovalReasonDeleteManyArgs>(args?: SelectSubset<T, GuildRemovalReasonDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuildRemovalReasons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRemovalReasonUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GuildRemovalReasons
     * const guildRemovalReason = await prisma.guildRemovalReason.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuildRemovalReasonUpdateManyArgs>(args: SelectSubset<T, GuildRemovalReasonUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuildRemovalReasons and returns the data updated in the database.
     * @param {GuildRemovalReasonUpdateManyAndReturnArgs} args - Arguments to update many GuildRemovalReasons.
     * @example
     * // Update many GuildRemovalReasons
     * const guildRemovalReason = await prisma.guildRemovalReason.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GuildRemovalReasons and only return the `id`
     * const guildRemovalReasonWithIdOnly = await prisma.guildRemovalReason.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GuildRemovalReasonUpdateManyAndReturnArgs>(args: SelectSubset<T, GuildRemovalReasonUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildRemovalReasonPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GuildRemovalReason.
     * @param {GuildRemovalReasonUpsertArgs} args - Arguments to update or create a GuildRemovalReason.
     * @example
     * // Update or create a GuildRemovalReason
     * const guildRemovalReason = await prisma.guildRemovalReason.upsert({
     *   create: {
     *     // ... data to create a GuildRemovalReason
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GuildRemovalReason we want to update
     *   }
     * })
     */
    upsert<T extends GuildRemovalReasonUpsertArgs>(args: SelectSubset<T, GuildRemovalReasonUpsertArgs<ExtArgs>>): Prisma__GuildRemovalReasonClient<$Result.GetResult<Prisma.$GuildRemovalReasonPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GuildRemovalReasons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRemovalReasonCountArgs} args - Arguments to filter GuildRemovalReasons to count.
     * @example
     * // Count the number of GuildRemovalReasons
     * const count = await prisma.guildRemovalReason.count({
     *   where: {
     *     // ... the filter for the GuildRemovalReasons we want to count
     *   }
     * })
    **/
    count<T extends GuildRemovalReasonCountArgs>(
      args?: Subset<T, GuildRemovalReasonCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuildRemovalReasonCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GuildRemovalReason.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRemovalReasonAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GuildRemovalReasonAggregateArgs>(args: Subset<T, GuildRemovalReasonAggregateArgs>): Prisma.PrismaPromise<GetGuildRemovalReasonAggregateType<T>>

    /**
     * Group by GuildRemovalReason.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRemovalReasonGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GuildRemovalReasonGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuildRemovalReasonGroupByArgs['orderBy'] }
        : { orderBy?: GuildRemovalReasonGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GuildRemovalReasonGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuildRemovalReasonGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GuildRemovalReason model
   */
  readonly fields: GuildRemovalReasonFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GuildRemovalReason.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuildRemovalReasonClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    guild<T extends GuildDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GuildDefaultArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GuildRemovalReason model
   */
  interface GuildRemovalReasonFieldRefs {
    readonly id: FieldRef<"GuildRemovalReason", 'Int'>
    readonly guildId: FieldRef<"GuildRemovalReason", 'Int'>
    readonly reason: FieldRef<"GuildRemovalReason", 'String'>
  }
    

  // Custom InputTypes
  /**
   * GuildRemovalReason findUnique
   */
  export type GuildRemovalReasonFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRemovalReason
     */
    select?: GuildRemovalReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRemovalReason
     */
    omit?: GuildRemovalReasonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRemovalReasonInclude<ExtArgs> | null
    /**
     * Filter, which GuildRemovalReason to fetch.
     */
    where: GuildRemovalReasonWhereUniqueInput
  }

  /**
   * GuildRemovalReason findUniqueOrThrow
   */
  export type GuildRemovalReasonFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRemovalReason
     */
    select?: GuildRemovalReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRemovalReason
     */
    omit?: GuildRemovalReasonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRemovalReasonInclude<ExtArgs> | null
    /**
     * Filter, which GuildRemovalReason to fetch.
     */
    where: GuildRemovalReasonWhereUniqueInput
  }

  /**
   * GuildRemovalReason findFirst
   */
  export type GuildRemovalReasonFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRemovalReason
     */
    select?: GuildRemovalReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRemovalReason
     */
    omit?: GuildRemovalReasonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRemovalReasonInclude<ExtArgs> | null
    /**
     * Filter, which GuildRemovalReason to fetch.
     */
    where?: GuildRemovalReasonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildRemovalReasons to fetch.
     */
    orderBy?: GuildRemovalReasonOrderByWithRelationInput | GuildRemovalReasonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildRemovalReasons.
     */
    cursor?: GuildRemovalReasonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildRemovalReasons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildRemovalReasons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildRemovalReasons.
     */
    distinct?: GuildRemovalReasonScalarFieldEnum | GuildRemovalReasonScalarFieldEnum[]
  }

  /**
   * GuildRemovalReason findFirstOrThrow
   */
  export type GuildRemovalReasonFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRemovalReason
     */
    select?: GuildRemovalReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRemovalReason
     */
    omit?: GuildRemovalReasonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRemovalReasonInclude<ExtArgs> | null
    /**
     * Filter, which GuildRemovalReason to fetch.
     */
    where?: GuildRemovalReasonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildRemovalReasons to fetch.
     */
    orderBy?: GuildRemovalReasonOrderByWithRelationInput | GuildRemovalReasonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildRemovalReasons.
     */
    cursor?: GuildRemovalReasonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildRemovalReasons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildRemovalReasons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildRemovalReasons.
     */
    distinct?: GuildRemovalReasonScalarFieldEnum | GuildRemovalReasonScalarFieldEnum[]
  }

  /**
   * GuildRemovalReason findMany
   */
  export type GuildRemovalReasonFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRemovalReason
     */
    select?: GuildRemovalReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRemovalReason
     */
    omit?: GuildRemovalReasonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRemovalReasonInclude<ExtArgs> | null
    /**
     * Filter, which GuildRemovalReasons to fetch.
     */
    where?: GuildRemovalReasonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildRemovalReasons to fetch.
     */
    orderBy?: GuildRemovalReasonOrderByWithRelationInput | GuildRemovalReasonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GuildRemovalReasons.
     */
    cursor?: GuildRemovalReasonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildRemovalReasons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildRemovalReasons.
     */
    skip?: number
    distinct?: GuildRemovalReasonScalarFieldEnum | GuildRemovalReasonScalarFieldEnum[]
  }

  /**
   * GuildRemovalReason create
   */
  export type GuildRemovalReasonCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRemovalReason
     */
    select?: GuildRemovalReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRemovalReason
     */
    omit?: GuildRemovalReasonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRemovalReasonInclude<ExtArgs> | null
    /**
     * The data needed to create a GuildRemovalReason.
     */
    data: XOR<GuildRemovalReasonCreateInput, GuildRemovalReasonUncheckedCreateInput>
  }

  /**
   * GuildRemovalReason createMany
   */
  export type GuildRemovalReasonCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GuildRemovalReasons.
     */
    data: GuildRemovalReasonCreateManyInput | GuildRemovalReasonCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuildRemovalReason createManyAndReturn
   */
  export type GuildRemovalReasonCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRemovalReason
     */
    select?: GuildRemovalReasonSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRemovalReason
     */
    omit?: GuildRemovalReasonOmit<ExtArgs> | null
    /**
     * The data used to create many GuildRemovalReasons.
     */
    data: GuildRemovalReasonCreateManyInput | GuildRemovalReasonCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRemovalReasonIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuildRemovalReason update
   */
  export type GuildRemovalReasonUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRemovalReason
     */
    select?: GuildRemovalReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRemovalReason
     */
    omit?: GuildRemovalReasonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRemovalReasonInclude<ExtArgs> | null
    /**
     * The data needed to update a GuildRemovalReason.
     */
    data: XOR<GuildRemovalReasonUpdateInput, GuildRemovalReasonUncheckedUpdateInput>
    /**
     * Choose, which GuildRemovalReason to update.
     */
    where: GuildRemovalReasonWhereUniqueInput
  }

  /**
   * GuildRemovalReason updateMany
   */
  export type GuildRemovalReasonUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GuildRemovalReasons.
     */
    data: XOR<GuildRemovalReasonUpdateManyMutationInput, GuildRemovalReasonUncheckedUpdateManyInput>
    /**
     * Filter which GuildRemovalReasons to update
     */
    where?: GuildRemovalReasonWhereInput
    /**
     * Limit how many GuildRemovalReasons to update.
     */
    limit?: number
  }

  /**
   * GuildRemovalReason updateManyAndReturn
   */
  export type GuildRemovalReasonUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRemovalReason
     */
    select?: GuildRemovalReasonSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRemovalReason
     */
    omit?: GuildRemovalReasonOmit<ExtArgs> | null
    /**
     * The data used to update GuildRemovalReasons.
     */
    data: XOR<GuildRemovalReasonUpdateManyMutationInput, GuildRemovalReasonUncheckedUpdateManyInput>
    /**
     * Filter which GuildRemovalReasons to update
     */
    where?: GuildRemovalReasonWhereInput
    /**
     * Limit how many GuildRemovalReasons to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRemovalReasonIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuildRemovalReason upsert
   */
  export type GuildRemovalReasonUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRemovalReason
     */
    select?: GuildRemovalReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRemovalReason
     */
    omit?: GuildRemovalReasonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRemovalReasonInclude<ExtArgs> | null
    /**
     * The filter to search for the GuildRemovalReason to update in case it exists.
     */
    where: GuildRemovalReasonWhereUniqueInput
    /**
     * In case the GuildRemovalReason found by the `where` argument doesn't exist, create a new GuildRemovalReason with this data.
     */
    create: XOR<GuildRemovalReasonCreateInput, GuildRemovalReasonUncheckedCreateInput>
    /**
     * In case the GuildRemovalReason was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuildRemovalReasonUpdateInput, GuildRemovalReasonUncheckedUpdateInput>
  }

  /**
   * GuildRemovalReason delete
   */
  export type GuildRemovalReasonDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRemovalReason
     */
    select?: GuildRemovalReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRemovalReason
     */
    omit?: GuildRemovalReasonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRemovalReasonInclude<ExtArgs> | null
    /**
     * Filter which GuildRemovalReason to delete.
     */
    where: GuildRemovalReasonWhereUniqueInput
  }

  /**
   * GuildRemovalReason deleteMany
   */
  export type GuildRemovalReasonDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildRemovalReasons to delete
     */
    where?: GuildRemovalReasonWhereInput
    /**
     * Limit how many GuildRemovalReasons to delete.
     */
    limit?: number
  }

  /**
   * GuildRemovalReason without action
   */
  export type GuildRemovalReasonDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRemovalReason
     */
    select?: GuildRemovalReasonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRemovalReason
     */
    omit?: GuildRemovalReasonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRemovalReasonInclude<ExtArgs> | null
  }


  /**
   * Model GuildRole
   */

  export type AggregateGuildRole = {
    _count: GuildRoleCountAggregateOutputType | null
    _avg: GuildRoleAvgAggregateOutputType | null
    _sum: GuildRoleSumAggregateOutputType | null
    _min: GuildRoleMinAggregateOutputType | null
    _max: GuildRoleMaxAggregateOutputType | null
  }

  export type GuildRoleAvgAggregateOutputType = {
    id: number | null
    guildId: number | null
  }

  export type GuildRoleSumAggregateOutputType = {
    id: number | null
    guildId: number | null
  }

  export type GuildRoleMinAggregateOutputType = {
    id: number | null
    guildId: number | null
    name: string | null
  }

  export type GuildRoleMaxAggregateOutputType = {
    id: number | null
    guildId: number | null
    name: string | null
  }

  export type GuildRoleCountAggregateOutputType = {
    id: number
    guildId: number
    name: number
    _all: number
  }


  export type GuildRoleAvgAggregateInputType = {
    id?: true
    guildId?: true
  }

  export type GuildRoleSumAggregateInputType = {
    id?: true
    guildId?: true
  }

  export type GuildRoleMinAggregateInputType = {
    id?: true
    guildId?: true
    name?: true
  }

  export type GuildRoleMaxAggregateInputType = {
    id?: true
    guildId?: true
    name?: true
  }

  export type GuildRoleCountAggregateInputType = {
    id?: true
    guildId?: true
    name?: true
    _all?: true
  }

  export type GuildRoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildRole to aggregate.
     */
    where?: GuildRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildRoles to fetch.
     */
    orderBy?: GuildRoleOrderByWithRelationInput | GuildRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuildRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GuildRoles
    **/
    _count?: true | GuildRoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GuildRoleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GuildRoleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuildRoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuildRoleMaxAggregateInputType
  }

  export type GetGuildRoleAggregateType<T extends GuildRoleAggregateArgs> = {
        [P in keyof T & keyof AggregateGuildRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuildRole[P]>
      : GetScalarType<T[P], AggregateGuildRole[P]>
  }




  export type GuildRoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildRoleWhereInput
    orderBy?: GuildRoleOrderByWithAggregationInput | GuildRoleOrderByWithAggregationInput[]
    by: GuildRoleScalarFieldEnum[] | GuildRoleScalarFieldEnum
    having?: GuildRoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuildRoleCountAggregateInputType | true
    _avg?: GuildRoleAvgAggregateInputType
    _sum?: GuildRoleSumAggregateInputType
    _min?: GuildRoleMinAggregateInputType
    _max?: GuildRoleMaxAggregateInputType
  }

  export type GuildRoleGroupByOutputType = {
    id: number
    guildId: number
    name: string
    _count: GuildRoleCountAggregateOutputType | null
    _avg: GuildRoleAvgAggregateOutputType | null
    _sum: GuildRoleSumAggregateOutputType | null
    _min: GuildRoleMinAggregateOutputType | null
    _max: GuildRoleMaxAggregateOutputType | null
  }

  type GetGuildRoleGroupByPayload<T extends GuildRoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuildRoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuildRoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuildRoleGroupByOutputType[P]>
            : GetScalarType<T[P], GuildRoleGroupByOutputType[P]>
        }
      >
    >


  export type GuildRoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    name?: boolean
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildRole"]>

  export type GuildRoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    name?: boolean
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildRole"]>

  export type GuildRoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    name?: boolean
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildRole"]>

  export type GuildRoleSelectScalar = {
    id?: boolean
    guildId?: boolean
    name?: boolean
  }

  export type GuildRoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "guildId" | "name", ExtArgs["result"]["guildRole"]>
  export type GuildRoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }
  export type GuildRoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }
  export type GuildRoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }

  export type $GuildRolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GuildRole"
    objects: {
      guild: Prisma.$GuildPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      guildId: number
      name: string
    }, ExtArgs["result"]["guildRole"]>
    composites: {}
  }

  type GuildRoleGetPayload<S extends boolean | null | undefined | GuildRoleDefaultArgs> = $Result.GetResult<Prisma.$GuildRolePayload, S>

  type GuildRoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GuildRoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuildRoleCountAggregateInputType | true
    }

  export interface GuildRoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GuildRole'], meta: { name: 'GuildRole' } }
    /**
     * Find zero or one GuildRole that matches the filter.
     * @param {GuildRoleFindUniqueArgs} args - Arguments to find a GuildRole
     * @example
     * // Get one GuildRole
     * const guildRole = await prisma.guildRole.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuildRoleFindUniqueArgs>(args: SelectSubset<T, GuildRoleFindUniqueArgs<ExtArgs>>): Prisma__GuildRoleClient<$Result.GetResult<Prisma.$GuildRolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GuildRole that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GuildRoleFindUniqueOrThrowArgs} args - Arguments to find a GuildRole
     * @example
     * // Get one GuildRole
     * const guildRole = await prisma.guildRole.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuildRoleFindUniqueOrThrowArgs>(args: SelectSubset<T, GuildRoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuildRoleClient<$Result.GetResult<Prisma.$GuildRolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuildRole that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRoleFindFirstArgs} args - Arguments to find a GuildRole
     * @example
     * // Get one GuildRole
     * const guildRole = await prisma.guildRole.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuildRoleFindFirstArgs>(args?: SelectSubset<T, GuildRoleFindFirstArgs<ExtArgs>>): Prisma__GuildRoleClient<$Result.GetResult<Prisma.$GuildRolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuildRole that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRoleFindFirstOrThrowArgs} args - Arguments to find a GuildRole
     * @example
     * // Get one GuildRole
     * const guildRole = await prisma.guildRole.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuildRoleFindFirstOrThrowArgs>(args?: SelectSubset<T, GuildRoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuildRoleClient<$Result.GetResult<Prisma.$GuildRolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GuildRoles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GuildRoles
     * const guildRoles = await prisma.guildRole.findMany()
     * 
     * // Get first 10 GuildRoles
     * const guildRoles = await prisma.guildRole.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guildRoleWithIdOnly = await prisma.guildRole.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuildRoleFindManyArgs>(args?: SelectSubset<T, GuildRoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GuildRole.
     * @param {GuildRoleCreateArgs} args - Arguments to create a GuildRole.
     * @example
     * // Create one GuildRole
     * const GuildRole = await prisma.guildRole.create({
     *   data: {
     *     // ... data to create a GuildRole
     *   }
     * })
     * 
     */
    create<T extends GuildRoleCreateArgs>(args: SelectSubset<T, GuildRoleCreateArgs<ExtArgs>>): Prisma__GuildRoleClient<$Result.GetResult<Prisma.$GuildRolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GuildRoles.
     * @param {GuildRoleCreateManyArgs} args - Arguments to create many GuildRoles.
     * @example
     * // Create many GuildRoles
     * const guildRole = await prisma.guildRole.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuildRoleCreateManyArgs>(args?: SelectSubset<T, GuildRoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GuildRoles and returns the data saved in the database.
     * @param {GuildRoleCreateManyAndReturnArgs} args - Arguments to create many GuildRoles.
     * @example
     * // Create many GuildRoles
     * const guildRole = await prisma.guildRole.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GuildRoles and only return the `id`
     * const guildRoleWithIdOnly = await prisma.guildRole.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuildRoleCreateManyAndReturnArgs>(args?: SelectSubset<T, GuildRoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildRolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GuildRole.
     * @param {GuildRoleDeleteArgs} args - Arguments to delete one GuildRole.
     * @example
     * // Delete one GuildRole
     * const GuildRole = await prisma.guildRole.delete({
     *   where: {
     *     // ... filter to delete one GuildRole
     *   }
     * })
     * 
     */
    delete<T extends GuildRoleDeleteArgs>(args: SelectSubset<T, GuildRoleDeleteArgs<ExtArgs>>): Prisma__GuildRoleClient<$Result.GetResult<Prisma.$GuildRolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GuildRole.
     * @param {GuildRoleUpdateArgs} args - Arguments to update one GuildRole.
     * @example
     * // Update one GuildRole
     * const guildRole = await prisma.guildRole.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuildRoleUpdateArgs>(args: SelectSubset<T, GuildRoleUpdateArgs<ExtArgs>>): Prisma__GuildRoleClient<$Result.GetResult<Prisma.$GuildRolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GuildRoles.
     * @param {GuildRoleDeleteManyArgs} args - Arguments to filter GuildRoles to delete.
     * @example
     * // Delete a few GuildRoles
     * const { count } = await prisma.guildRole.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuildRoleDeleteManyArgs>(args?: SelectSubset<T, GuildRoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuildRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GuildRoles
     * const guildRole = await prisma.guildRole.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuildRoleUpdateManyArgs>(args: SelectSubset<T, GuildRoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuildRoles and returns the data updated in the database.
     * @param {GuildRoleUpdateManyAndReturnArgs} args - Arguments to update many GuildRoles.
     * @example
     * // Update many GuildRoles
     * const guildRole = await prisma.guildRole.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GuildRoles and only return the `id`
     * const guildRoleWithIdOnly = await prisma.guildRole.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GuildRoleUpdateManyAndReturnArgs>(args: SelectSubset<T, GuildRoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildRolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GuildRole.
     * @param {GuildRoleUpsertArgs} args - Arguments to update or create a GuildRole.
     * @example
     * // Update or create a GuildRole
     * const guildRole = await prisma.guildRole.upsert({
     *   create: {
     *     // ... data to create a GuildRole
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GuildRole we want to update
     *   }
     * })
     */
    upsert<T extends GuildRoleUpsertArgs>(args: SelectSubset<T, GuildRoleUpsertArgs<ExtArgs>>): Prisma__GuildRoleClient<$Result.GetResult<Prisma.$GuildRolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GuildRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRoleCountArgs} args - Arguments to filter GuildRoles to count.
     * @example
     * // Count the number of GuildRoles
     * const count = await prisma.guildRole.count({
     *   where: {
     *     // ... the filter for the GuildRoles we want to count
     *   }
     * })
    **/
    count<T extends GuildRoleCountArgs>(
      args?: Subset<T, GuildRoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuildRoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GuildRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GuildRoleAggregateArgs>(args: Subset<T, GuildRoleAggregateArgs>): Prisma.PrismaPromise<GetGuildRoleAggregateType<T>>

    /**
     * Group by GuildRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildRoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GuildRoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuildRoleGroupByArgs['orderBy'] }
        : { orderBy?: GuildRoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GuildRoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuildRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GuildRole model
   */
  readonly fields: GuildRoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GuildRole.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuildRoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    guild<T extends GuildDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GuildDefaultArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GuildRole model
   */
  interface GuildRoleFieldRefs {
    readonly id: FieldRef<"GuildRole", 'Int'>
    readonly guildId: FieldRef<"GuildRole", 'Int'>
    readonly name: FieldRef<"GuildRole", 'String'>
  }
    

  // Custom InputTypes
  /**
   * GuildRole findUnique
   */
  export type GuildRoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRole
     */
    select?: GuildRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRole
     */
    omit?: GuildRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRoleInclude<ExtArgs> | null
    /**
     * Filter, which GuildRole to fetch.
     */
    where: GuildRoleWhereUniqueInput
  }

  /**
   * GuildRole findUniqueOrThrow
   */
  export type GuildRoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRole
     */
    select?: GuildRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRole
     */
    omit?: GuildRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRoleInclude<ExtArgs> | null
    /**
     * Filter, which GuildRole to fetch.
     */
    where: GuildRoleWhereUniqueInput
  }

  /**
   * GuildRole findFirst
   */
  export type GuildRoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRole
     */
    select?: GuildRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRole
     */
    omit?: GuildRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRoleInclude<ExtArgs> | null
    /**
     * Filter, which GuildRole to fetch.
     */
    where?: GuildRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildRoles to fetch.
     */
    orderBy?: GuildRoleOrderByWithRelationInput | GuildRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildRoles.
     */
    cursor?: GuildRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildRoles.
     */
    distinct?: GuildRoleScalarFieldEnum | GuildRoleScalarFieldEnum[]
  }

  /**
   * GuildRole findFirstOrThrow
   */
  export type GuildRoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRole
     */
    select?: GuildRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRole
     */
    omit?: GuildRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRoleInclude<ExtArgs> | null
    /**
     * Filter, which GuildRole to fetch.
     */
    where?: GuildRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildRoles to fetch.
     */
    orderBy?: GuildRoleOrderByWithRelationInput | GuildRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildRoles.
     */
    cursor?: GuildRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildRoles.
     */
    distinct?: GuildRoleScalarFieldEnum | GuildRoleScalarFieldEnum[]
  }

  /**
   * GuildRole findMany
   */
  export type GuildRoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRole
     */
    select?: GuildRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRole
     */
    omit?: GuildRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRoleInclude<ExtArgs> | null
    /**
     * Filter, which GuildRoles to fetch.
     */
    where?: GuildRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildRoles to fetch.
     */
    orderBy?: GuildRoleOrderByWithRelationInput | GuildRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GuildRoles.
     */
    cursor?: GuildRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildRoles.
     */
    skip?: number
    distinct?: GuildRoleScalarFieldEnum | GuildRoleScalarFieldEnum[]
  }

  /**
   * GuildRole create
   */
  export type GuildRoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRole
     */
    select?: GuildRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRole
     */
    omit?: GuildRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRoleInclude<ExtArgs> | null
    /**
     * The data needed to create a GuildRole.
     */
    data: XOR<GuildRoleCreateInput, GuildRoleUncheckedCreateInput>
  }

  /**
   * GuildRole createMany
   */
  export type GuildRoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GuildRoles.
     */
    data: GuildRoleCreateManyInput | GuildRoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuildRole createManyAndReturn
   */
  export type GuildRoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRole
     */
    select?: GuildRoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRole
     */
    omit?: GuildRoleOmit<ExtArgs> | null
    /**
     * The data used to create many GuildRoles.
     */
    data: GuildRoleCreateManyInput | GuildRoleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRoleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuildRole update
   */
  export type GuildRoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRole
     */
    select?: GuildRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRole
     */
    omit?: GuildRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRoleInclude<ExtArgs> | null
    /**
     * The data needed to update a GuildRole.
     */
    data: XOR<GuildRoleUpdateInput, GuildRoleUncheckedUpdateInput>
    /**
     * Choose, which GuildRole to update.
     */
    where: GuildRoleWhereUniqueInput
  }

  /**
   * GuildRole updateMany
   */
  export type GuildRoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GuildRoles.
     */
    data: XOR<GuildRoleUpdateManyMutationInput, GuildRoleUncheckedUpdateManyInput>
    /**
     * Filter which GuildRoles to update
     */
    where?: GuildRoleWhereInput
    /**
     * Limit how many GuildRoles to update.
     */
    limit?: number
  }

  /**
   * GuildRole updateManyAndReturn
   */
  export type GuildRoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRole
     */
    select?: GuildRoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRole
     */
    omit?: GuildRoleOmit<ExtArgs> | null
    /**
     * The data used to update GuildRoles.
     */
    data: XOR<GuildRoleUpdateManyMutationInput, GuildRoleUncheckedUpdateManyInput>
    /**
     * Filter which GuildRoles to update
     */
    where?: GuildRoleWhereInput
    /**
     * Limit how many GuildRoles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRoleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuildRole upsert
   */
  export type GuildRoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRole
     */
    select?: GuildRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRole
     */
    omit?: GuildRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRoleInclude<ExtArgs> | null
    /**
     * The filter to search for the GuildRole to update in case it exists.
     */
    where: GuildRoleWhereUniqueInput
    /**
     * In case the GuildRole found by the `where` argument doesn't exist, create a new GuildRole with this data.
     */
    create: XOR<GuildRoleCreateInput, GuildRoleUncheckedCreateInput>
    /**
     * In case the GuildRole was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuildRoleUpdateInput, GuildRoleUncheckedUpdateInput>
  }

  /**
   * GuildRole delete
   */
  export type GuildRoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRole
     */
    select?: GuildRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRole
     */
    omit?: GuildRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRoleInclude<ExtArgs> | null
    /**
     * Filter which GuildRole to delete.
     */
    where: GuildRoleWhereUniqueInput
  }

  /**
   * GuildRole deleteMany
   */
  export type GuildRoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildRoles to delete
     */
    where?: GuildRoleWhereInput
    /**
     * Limit how many GuildRoles to delete.
     */
    limit?: number
  }

  /**
   * GuildRole without action
   */
  export type GuildRoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildRole
     */
    select?: GuildRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildRole
     */
    omit?: GuildRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildRoleInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const GuildScalarFieldEnum: {
    id: 'id',
    discordId: 'discordId',
    name: 'name'
  };

  export type GuildScalarFieldEnum = (typeof GuildScalarFieldEnum)[keyof typeof GuildScalarFieldEnum]


  export const GuildActivityScalarFieldEnum: {
    id: 'id',
    guildId: 'guildId',
    numGuildChannels: 'numGuildChannels',
    numGuildCurrencies: 'numGuildCurrencies',
    numGuildRoles: 'numGuildRoles',
    numRemovalReasons: 'numRemovalReasons'
  };

  export type GuildActivityScalarFieldEnum = (typeof GuildActivityScalarFieldEnum)[keyof typeof GuildActivityScalarFieldEnum]


  export const GuildChannelScalarFieldEnum: {
    id: 'id',
    guildId: 'guildId',
    name: 'name'
  };

  export type GuildChannelScalarFieldEnum = (typeof GuildChannelScalarFieldEnum)[keyof typeof GuildChannelScalarFieldEnum]


  export const GuildCurrencyScalarFieldEnum: {
    id: 'id',
    guildId: 'guildId',
    name: 'name',
    value: 'value'
  };

  export type GuildCurrencyScalarFieldEnum = (typeof GuildCurrencyScalarFieldEnum)[keyof typeof GuildCurrencyScalarFieldEnum]


  export const GuildRemovalReasonScalarFieldEnum: {
    id: 'id',
    guildId: 'guildId',
    reason: 'reason'
  };

  export type GuildRemovalReasonScalarFieldEnum = (typeof GuildRemovalReasonScalarFieldEnum)[keyof typeof GuildRemovalReasonScalarFieldEnum]


  export const GuildRoleScalarFieldEnum: {
    id: 'id',
    guildId: 'guildId',
    name: 'name'
  };

  export type GuildRoleScalarFieldEnum = (typeof GuildRoleScalarFieldEnum)[keyof typeof GuildRoleScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type GuildWhereInput = {
    AND?: GuildWhereInput | GuildWhereInput[]
    OR?: GuildWhereInput[]
    NOT?: GuildWhereInput | GuildWhereInput[]
    id?: IntFilter<"Guild"> | number
    discordId?: StringFilter<"Guild"> | string
    name?: StringFilter<"Guild"> | string
    guildActivity?: XOR<GuildActivityNullableScalarRelationFilter, GuildActivityWhereInput> | null
    guildChannels?: GuildChannelListRelationFilter
    guildCurrencies?: GuildCurrencyListRelationFilter
    guildRemovalReasons?: GuildRemovalReasonListRelationFilter
    guildRoles?: GuildRoleListRelationFilter
  }

  export type GuildOrderByWithRelationInput = {
    id?: SortOrder
    discordId?: SortOrder
    name?: SortOrder
    guildActivity?: GuildActivityOrderByWithRelationInput
    guildChannels?: GuildChannelOrderByRelationAggregateInput
    guildCurrencies?: GuildCurrencyOrderByRelationAggregateInput
    guildRemovalReasons?: GuildRemovalReasonOrderByRelationAggregateInput
    guildRoles?: GuildRoleOrderByRelationAggregateInput
  }

  export type GuildWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    discordId?: string
    AND?: GuildWhereInput | GuildWhereInput[]
    OR?: GuildWhereInput[]
    NOT?: GuildWhereInput | GuildWhereInput[]
    name?: StringFilter<"Guild"> | string
    guildActivity?: XOR<GuildActivityNullableScalarRelationFilter, GuildActivityWhereInput> | null
    guildChannels?: GuildChannelListRelationFilter
    guildCurrencies?: GuildCurrencyListRelationFilter
    guildRemovalReasons?: GuildRemovalReasonListRelationFilter
    guildRoles?: GuildRoleListRelationFilter
  }, "id" | "discordId">

  export type GuildOrderByWithAggregationInput = {
    id?: SortOrder
    discordId?: SortOrder
    name?: SortOrder
    _count?: GuildCountOrderByAggregateInput
    _avg?: GuildAvgOrderByAggregateInput
    _max?: GuildMaxOrderByAggregateInput
    _min?: GuildMinOrderByAggregateInput
    _sum?: GuildSumOrderByAggregateInput
  }

  export type GuildScalarWhereWithAggregatesInput = {
    AND?: GuildScalarWhereWithAggregatesInput | GuildScalarWhereWithAggregatesInput[]
    OR?: GuildScalarWhereWithAggregatesInput[]
    NOT?: GuildScalarWhereWithAggregatesInput | GuildScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Guild"> | number
    discordId?: StringWithAggregatesFilter<"Guild"> | string
    name?: StringWithAggregatesFilter<"Guild"> | string
  }

  export type GuildActivityWhereInput = {
    AND?: GuildActivityWhereInput | GuildActivityWhereInput[]
    OR?: GuildActivityWhereInput[]
    NOT?: GuildActivityWhereInput | GuildActivityWhereInput[]
    id?: IntFilter<"GuildActivity"> | number
    guildId?: IntFilter<"GuildActivity"> | number
    numGuildChannels?: IntFilter<"GuildActivity"> | number
    numGuildCurrencies?: IntFilter<"GuildActivity"> | number
    numGuildRoles?: IntFilter<"GuildActivity"> | number
    numRemovalReasons?: IntFilter<"GuildActivity"> | number
    guild?: XOR<GuildNullableScalarRelationFilter, GuildWhereInput> | null
  }

  export type GuildActivityOrderByWithRelationInput = {
    id?: SortOrder
    guildId?: SortOrder
    numGuildChannels?: SortOrder
    numGuildCurrencies?: SortOrder
    numGuildRoles?: SortOrder
    numRemovalReasons?: SortOrder
    guild?: GuildOrderByWithRelationInput
  }

  export type GuildActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    guildId?: number
    AND?: GuildActivityWhereInput | GuildActivityWhereInput[]
    OR?: GuildActivityWhereInput[]
    NOT?: GuildActivityWhereInput | GuildActivityWhereInput[]
    numGuildChannels?: IntFilter<"GuildActivity"> | number
    numGuildCurrencies?: IntFilter<"GuildActivity"> | number
    numGuildRoles?: IntFilter<"GuildActivity"> | number
    numRemovalReasons?: IntFilter<"GuildActivity"> | number
    guild?: XOR<GuildNullableScalarRelationFilter, GuildWhereInput> | null
  }, "id" | "guildId">

  export type GuildActivityOrderByWithAggregationInput = {
    id?: SortOrder
    guildId?: SortOrder
    numGuildChannels?: SortOrder
    numGuildCurrencies?: SortOrder
    numGuildRoles?: SortOrder
    numRemovalReasons?: SortOrder
    _count?: GuildActivityCountOrderByAggregateInput
    _avg?: GuildActivityAvgOrderByAggregateInput
    _max?: GuildActivityMaxOrderByAggregateInput
    _min?: GuildActivityMinOrderByAggregateInput
    _sum?: GuildActivitySumOrderByAggregateInput
  }

  export type GuildActivityScalarWhereWithAggregatesInput = {
    AND?: GuildActivityScalarWhereWithAggregatesInput | GuildActivityScalarWhereWithAggregatesInput[]
    OR?: GuildActivityScalarWhereWithAggregatesInput[]
    NOT?: GuildActivityScalarWhereWithAggregatesInput | GuildActivityScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"GuildActivity"> | number
    guildId?: IntWithAggregatesFilter<"GuildActivity"> | number
    numGuildChannels?: IntWithAggregatesFilter<"GuildActivity"> | number
    numGuildCurrencies?: IntWithAggregatesFilter<"GuildActivity"> | number
    numGuildRoles?: IntWithAggregatesFilter<"GuildActivity"> | number
    numRemovalReasons?: IntWithAggregatesFilter<"GuildActivity"> | number
  }

  export type GuildChannelWhereInput = {
    AND?: GuildChannelWhereInput | GuildChannelWhereInput[]
    OR?: GuildChannelWhereInput[]
    NOT?: GuildChannelWhereInput | GuildChannelWhereInput[]
    id?: IntFilter<"GuildChannel"> | number
    guildId?: IntFilter<"GuildChannel"> | number
    name?: StringFilter<"GuildChannel"> | string
    guild?: XOR<GuildScalarRelationFilter, GuildWhereInput>
  }

  export type GuildChannelOrderByWithRelationInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
    guild?: GuildOrderByWithRelationInput
  }

  export type GuildChannelWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: GuildChannelWhereInput | GuildChannelWhereInput[]
    OR?: GuildChannelWhereInput[]
    NOT?: GuildChannelWhereInput | GuildChannelWhereInput[]
    guildId?: IntFilter<"GuildChannel"> | number
    name?: StringFilter<"GuildChannel"> | string
    guild?: XOR<GuildScalarRelationFilter, GuildWhereInput>
  }, "id">

  export type GuildChannelOrderByWithAggregationInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
    _count?: GuildChannelCountOrderByAggregateInput
    _avg?: GuildChannelAvgOrderByAggregateInput
    _max?: GuildChannelMaxOrderByAggregateInput
    _min?: GuildChannelMinOrderByAggregateInput
    _sum?: GuildChannelSumOrderByAggregateInput
  }

  export type GuildChannelScalarWhereWithAggregatesInput = {
    AND?: GuildChannelScalarWhereWithAggregatesInput | GuildChannelScalarWhereWithAggregatesInput[]
    OR?: GuildChannelScalarWhereWithAggregatesInput[]
    NOT?: GuildChannelScalarWhereWithAggregatesInput | GuildChannelScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"GuildChannel"> | number
    guildId?: IntWithAggregatesFilter<"GuildChannel"> | number
    name?: StringWithAggregatesFilter<"GuildChannel"> | string
  }

  export type GuildCurrencyWhereInput = {
    AND?: GuildCurrencyWhereInput | GuildCurrencyWhereInput[]
    OR?: GuildCurrencyWhereInput[]
    NOT?: GuildCurrencyWhereInput | GuildCurrencyWhereInput[]
    id?: IntFilter<"GuildCurrency"> | number
    guildId?: IntFilter<"GuildCurrency"> | number
    name?: StringFilter<"GuildCurrency"> | string
    value?: FloatFilter<"GuildCurrency"> | number
    guild?: XOR<GuildScalarRelationFilter, GuildWhereInput>
  }

  export type GuildCurrencyOrderByWithRelationInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
    value?: SortOrder
    guild?: GuildOrderByWithRelationInput
  }

  export type GuildCurrencyWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: GuildCurrencyWhereInput | GuildCurrencyWhereInput[]
    OR?: GuildCurrencyWhereInput[]
    NOT?: GuildCurrencyWhereInput | GuildCurrencyWhereInput[]
    guildId?: IntFilter<"GuildCurrency"> | number
    name?: StringFilter<"GuildCurrency"> | string
    value?: FloatFilter<"GuildCurrency"> | number
    guild?: XOR<GuildScalarRelationFilter, GuildWhereInput>
  }, "id">

  export type GuildCurrencyOrderByWithAggregationInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
    value?: SortOrder
    _count?: GuildCurrencyCountOrderByAggregateInput
    _avg?: GuildCurrencyAvgOrderByAggregateInput
    _max?: GuildCurrencyMaxOrderByAggregateInput
    _min?: GuildCurrencyMinOrderByAggregateInput
    _sum?: GuildCurrencySumOrderByAggregateInput
  }

  export type GuildCurrencyScalarWhereWithAggregatesInput = {
    AND?: GuildCurrencyScalarWhereWithAggregatesInput | GuildCurrencyScalarWhereWithAggregatesInput[]
    OR?: GuildCurrencyScalarWhereWithAggregatesInput[]
    NOT?: GuildCurrencyScalarWhereWithAggregatesInput | GuildCurrencyScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"GuildCurrency"> | number
    guildId?: IntWithAggregatesFilter<"GuildCurrency"> | number
    name?: StringWithAggregatesFilter<"GuildCurrency"> | string
    value?: FloatWithAggregatesFilter<"GuildCurrency"> | number
  }

  export type GuildRemovalReasonWhereInput = {
    AND?: GuildRemovalReasonWhereInput | GuildRemovalReasonWhereInput[]
    OR?: GuildRemovalReasonWhereInput[]
    NOT?: GuildRemovalReasonWhereInput | GuildRemovalReasonWhereInput[]
    id?: IntFilter<"GuildRemovalReason"> | number
    guildId?: IntFilter<"GuildRemovalReason"> | number
    reason?: StringFilter<"GuildRemovalReason"> | string
    guild?: XOR<GuildScalarRelationFilter, GuildWhereInput>
  }

  export type GuildRemovalReasonOrderByWithRelationInput = {
    id?: SortOrder
    guildId?: SortOrder
    reason?: SortOrder
    guild?: GuildOrderByWithRelationInput
  }

  export type GuildRemovalReasonWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: GuildRemovalReasonWhereInput | GuildRemovalReasonWhereInput[]
    OR?: GuildRemovalReasonWhereInput[]
    NOT?: GuildRemovalReasonWhereInput | GuildRemovalReasonWhereInput[]
    guildId?: IntFilter<"GuildRemovalReason"> | number
    reason?: StringFilter<"GuildRemovalReason"> | string
    guild?: XOR<GuildScalarRelationFilter, GuildWhereInput>
  }, "id">

  export type GuildRemovalReasonOrderByWithAggregationInput = {
    id?: SortOrder
    guildId?: SortOrder
    reason?: SortOrder
    _count?: GuildRemovalReasonCountOrderByAggregateInput
    _avg?: GuildRemovalReasonAvgOrderByAggregateInput
    _max?: GuildRemovalReasonMaxOrderByAggregateInput
    _min?: GuildRemovalReasonMinOrderByAggregateInput
    _sum?: GuildRemovalReasonSumOrderByAggregateInput
  }

  export type GuildRemovalReasonScalarWhereWithAggregatesInput = {
    AND?: GuildRemovalReasonScalarWhereWithAggregatesInput | GuildRemovalReasonScalarWhereWithAggregatesInput[]
    OR?: GuildRemovalReasonScalarWhereWithAggregatesInput[]
    NOT?: GuildRemovalReasonScalarWhereWithAggregatesInput | GuildRemovalReasonScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"GuildRemovalReason"> | number
    guildId?: IntWithAggregatesFilter<"GuildRemovalReason"> | number
    reason?: StringWithAggregatesFilter<"GuildRemovalReason"> | string
  }

  export type GuildRoleWhereInput = {
    AND?: GuildRoleWhereInput | GuildRoleWhereInput[]
    OR?: GuildRoleWhereInput[]
    NOT?: GuildRoleWhereInput | GuildRoleWhereInput[]
    id?: IntFilter<"GuildRole"> | number
    guildId?: IntFilter<"GuildRole"> | number
    name?: StringFilter<"GuildRole"> | string
    guild?: XOR<GuildScalarRelationFilter, GuildWhereInput>
  }

  export type GuildRoleOrderByWithRelationInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
    guild?: GuildOrderByWithRelationInput
  }

  export type GuildRoleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: GuildRoleWhereInput | GuildRoleWhereInput[]
    OR?: GuildRoleWhereInput[]
    NOT?: GuildRoleWhereInput | GuildRoleWhereInput[]
    guildId?: IntFilter<"GuildRole"> | number
    name?: StringFilter<"GuildRole"> | string
    guild?: XOR<GuildScalarRelationFilter, GuildWhereInput>
  }, "id">

  export type GuildRoleOrderByWithAggregationInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
    _count?: GuildRoleCountOrderByAggregateInput
    _avg?: GuildRoleAvgOrderByAggregateInput
    _max?: GuildRoleMaxOrderByAggregateInput
    _min?: GuildRoleMinOrderByAggregateInput
    _sum?: GuildRoleSumOrderByAggregateInput
  }

  export type GuildRoleScalarWhereWithAggregatesInput = {
    AND?: GuildRoleScalarWhereWithAggregatesInput | GuildRoleScalarWhereWithAggregatesInput[]
    OR?: GuildRoleScalarWhereWithAggregatesInput[]
    NOT?: GuildRoleScalarWhereWithAggregatesInput | GuildRoleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"GuildRole"> | number
    guildId?: IntWithAggregatesFilter<"GuildRole"> | number
    name?: StringWithAggregatesFilter<"GuildRole"> | string
  }

  export type GuildCreateInput = {
    discordId: string
    name: string
    guildActivity?: GuildActivityCreateNestedOneWithoutGuildInput
    guildChannels?: GuildChannelCreateNestedManyWithoutGuildInput
    guildCurrencies?: GuildCurrencyCreateNestedManyWithoutGuildInput
    guildRemovalReasons?: GuildRemovalReasonCreateNestedManyWithoutGuildInput
    guildRoles?: GuildRoleCreateNestedManyWithoutGuildInput
  }

  export type GuildUncheckedCreateInput = {
    id?: number
    discordId: string
    name: string
    guildActivity?: GuildActivityUncheckedCreateNestedOneWithoutGuildInput
    guildChannels?: GuildChannelUncheckedCreateNestedManyWithoutGuildInput
    guildCurrencies?: GuildCurrencyUncheckedCreateNestedManyWithoutGuildInput
    guildRemovalReasons?: GuildRemovalReasonUncheckedCreateNestedManyWithoutGuildInput
    guildRoles?: GuildRoleUncheckedCreateNestedManyWithoutGuildInput
  }

  export type GuildUpdateInput = {
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    guildActivity?: GuildActivityUpdateOneWithoutGuildNestedInput
    guildChannels?: GuildChannelUpdateManyWithoutGuildNestedInput
    guildCurrencies?: GuildCurrencyUpdateManyWithoutGuildNestedInput
    guildRemovalReasons?: GuildRemovalReasonUpdateManyWithoutGuildNestedInput
    guildRoles?: GuildRoleUpdateManyWithoutGuildNestedInput
  }

  export type GuildUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    guildActivity?: GuildActivityUncheckedUpdateOneWithoutGuildNestedInput
    guildChannels?: GuildChannelUncheckedUpdateManyWithoutGuildNestedInput
    guildCurrencies?: GuildCurrencyUncheckedUpdateManyWithoutGuildNestedInput
    guildRemovalReasons?: GuildRemovalReasonUncheckedUpdateManyWithoutGuildNestedInput
    guildRoles?: GuildRoleUncheckedUpdateManyWithoutGuildNestedInput
  }

  export type GuildCreateManyInput = {
    id?: number
    discordId: string
    name: string
  }

  export type GuildUpdateManyMutationInput = {
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type GuildUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type GuildActivityCreateInput = {
    numGuildChannels?: number
    numGuildCurrencies?: number
    numGuildRoles?: number
    numRemovalReasons?: number
    guild?: GuildCreateNestedOneWithoutGuildActivityInput
  }

  export type GuildActivityUncheckedCreateInput = {
    id?: number
    guildId: number
    numGuildChannels?: number
    numGuildCurrencies?: number
    numGuildRoles?: number
    numRemovalReasons?: number
  }

  export type GuildActivityUpdateInput = {
    numGuildChannels?: IntFieldUpdateOperationsInput | number
    numGuildCurrencies?: IntFieldUpdateOperationsInput | number
    numGuildRoles?: IntFieldUpdateOperationsInput | number
    numRemovalReasons?: IntFieldUpdateOperationsInput | number
    guild?: GuildUpdateOneWithoutGuildActivityNestedInput
  }

  export type GuildActivityUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    guildId?: IntFieldUpdateOperationsInput | number
    numGuildChannels?: IntFieldUpdateOperationsInput | number
    numGuildCurrencies?: IntFieldUpdateOperationsInput | number
    numGuildRoles?: IntFieldUpdateOperationsInput | number
    numRemovalReasons?: IntFieldUpdateOperationsInput | number
  }

  export type GuildActivityCreateManyInput = {
    id?: number
    guildId: number
    numGuildChannels?: number
    numGuildCurrencies?: number
    numGuildRoles?: number
    numRemovalReasons?: number
  }

  export type GuildActivityUpdateManyMutationInput = {
    numGuildChannels?: IntFieldUpdateOperationsInput | number
    numGuildCurrencies?: IntFieldUpdateOperationsInput | number
    numGuildRoles?: IntFieldUpdateOperationsInput | number
    numRemovalReasons?: IntFieldUpdateOperationsInput | number
  }

  export type GuildActivityUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    guildId?: IntFieldUpdateOperationsInput | number
    numGuildChannels?: IntFieldUpdateOperationsInput | number
    numGuildCurrencies?: IntFieldUpdateOperationsInput | number
    numGuildRoles?: IntFieldUpdateOperationsInput | number
    numRemovalReasons?: IntFieldUpdateOperationsInput | number
  }

  export type GuildChannelCreateInput = {
    name: string
    guild: GuildCreateNestedOneWithoutGuildChannelsInput
  }

  export type GuildChannelUncheckedCreateInput = {
    id?: number
    guildId: number
    name: string
  }

  export type GuildChannelUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    guild?: GuildUpdateOneRequiredWithoutGuildChannelsNestedInput
  }

  export type GuildChannelUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    guildId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type GuildChannelCreateManyInput = {
    id?: number
    guildId: number
    name: string
  }

  export type GuildChannelUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type GuildChannelUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    guildId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type GuildCurrencyCreateInput = {
    name: string
    value: number
    guild: GuildCreateNestedOneWithoutGuildCurrenciesInput
  }

  export type GuildCurrencyUncheckedCreateInput = {
    id?: number
    guildId: number
    name: string
    value: number
  }

  export type GuildCurrencyUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    guild?: GuildUpdateOneRequiredWithoutGuildCurrenciesNestedInput
  }

  export type GuildCurrencyUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    guildId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
  }

  export type GuildCurrencyCreateManyInput = {
    id?: number
    guildId: number
    name: string
    value: number
  }

  export type GuildCurrencyUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
  }

  export type GuildCurrencyUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    guildId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
  }

  export type GuildRemovalReasonCreateInput = {
    reason: string
    guild: GuildCreateNestedOneWithoutGuildRemovalReasonsInput
  }

  export type GuildRemovalReasonUncheckedCreateInput = {
    id?: number
    guildId: number
    reason: string
  }

  export type GuildRemovalReasonUpdateInput = {
    reason?: StringFieldUpdateOperationsInput | string
    guild?: GuildUpdateOneRequiredWithoutGuildRemovalReasonsNestedInput
  }

  export type GuildRemovalReasonUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    guildId?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
  }

  export type GuildRemovalReasonCreateManyInput = {
    id?: number
    guildId: number
    reason: string
  }

  export type GuildRemovalReasonUpdateManyMutationInput = {
    reason?: StringFieldUpdateOperationsInput | string
  }

  export type GuildRemovalReasonUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    guildId?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
  }

  export type GuildRoleCreateInput = {
    name: string
    guild: GuildCreateNestedOneWithoutGuildRolesInput
  }

  export type GuildRoleUncheckedCreateInput = {
    id?: number
    guildId: number
    name: string
  }

  export type GuildRoleUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    guild?: GuildUpdateOneRequiredWithoutGuildRolesNestedInput
  }

  export type GuildRoleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    guildId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type GuildRoleCreateManyInput = {
    id?: number
    guildId: number
    name: string
  }

  export type GuildRoleUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type GuildRoleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    guildId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type GuildActivityNullableScalarRelationFilter = {
    is?: GuildActivityWhereInput | null
    isNot?: GuildActivityWhereInput | null
  }

  export type GuildChannelListRelationFilter = {
    every?: GuildChannelWhereInput
    some?: GuildChannelWhereInput
    none?: GuildChannelWhereInput
  }

  export type GuildCurrencyListRelationFilter = {
    every?: GuildCurrencyWhereInput
    some?: GuildCurrencyWhereInput
    none?: GuildCurrencyWhereInput
  }

  export type GuildRemovalReasonListRelationFilter = {
    every?: GuildRemovalReasonWhereInput
    some?: GuildRemovalReasonWhereInput
    none?: GuildRemovalReasonWhereInput
  }

  export type GuildRoleListRelationFilter = {
    every?: GuildRoleWhereInput
    some?: GuildRoleWhereInput
    none?: GuildRoleWhereInput
  }

  export type GuildChannelOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GuildCurrencyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GuildRemovalReasonOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GuildRoleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GuildCountOrderByAggregateInput = {
    id?: SortOrder
    discordId?: SortOrder
    name?: SortOrder
  }

  export type GuildAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type GuildMaxOrderByAggregateInput = {
    id?: SortOrder
    discordId?: SortOrder
    name?: SortOrder
  }

  export type GuildMinOrderByAggregateInput = {
    id?: SortOrder
    discordId?: SortOrder
    name?: SortOrder
  }

  export type GuildSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type GuildNullableScalarRelationFilter = {
    is?: GuildWhereInput | null
    isNot?: GuildWhereInput | null
  }

  export type GuildActivityCountOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    numGuildChannels?: SortOrder
    numGuildCurrencies?: SortOrder
    numGuildRoles?: SortOrder
    numRemovalReasons?: SortOrder
  }

  export type GuildActivityAvgOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    numGuildChannels?: SortOrder
    numGuildCurrencies?: SortOrder
    numGuildRoles?: SortOrder
    numRemovalReasons?: SortOrder
  }

  export type GuildActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    numGuildChannels?: SortOrder
    numGuildCurrencies?: SortOrder
    numGuildRoles?: SortOrder
    numRemovalReasons?: SortOrder
  }

  export type GuildActivityMinOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    numGuildChannels?: SortOrder
    numGuildCurrencies?: SortOrder
    numGuildRoles?: SortOrder
    numRemovalReasons?: SortOrder
  }

  export type GuildActivitySumOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    numGuildChannels?: SortOrder
    numGuildCurrencies?: SortOrder
    numGuildRoles?: SortOrder
    numRemovalReasons?: SortOrder
  }

  export type GuildScalarRelationFilter = {
    is?: GuildWhereInput
    isNot?: GuildWhereInput
  }

  export type GuildChannelCountOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
  }

  export type GuildChannelAvgOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
  }

  export type GuildChannelMaxOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
  }

  export type GuildChannelMinOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
  }

  export type GuildChannelSumOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type GuildCurrencyCountOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
    value?: SortOrder
  }

  export type GuildCurrencyAvgOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    value?: SortOrder
  }

  export type GuildCurrencyMaxOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
    value?: SortOrder
  }

  export type GuildCurrencyMinOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
    value?: SortOrder
  }

  export type GuildCurrencySumOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    value?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type GuildRemovalReasonCountOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    reason?: SortOrder
  }

  export type GuildRemovalReasonAvgOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
  }

  export type GuildRemovalReasonMaxOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    reason?: SortOrder
  }

  export type GuildRemovalReasonMinOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    reason?: SortOrder
  }

  export type GuildRemovalReasonSumOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
  }

  export type GuildRoleCountOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
  }

  export type GuildRoleAvgOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
  }

  export type GuildRoleMaxOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
  }

  export type GuildRoleMinOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    name?: SortOrder
  }

  export type GuildRoleSumOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
  }

  export type GuildActivityCreateNestedOneWithoutGuildInput = {
    create?: XOR<GuildActivityCreateWithoutGuildInput, GuildActivityUncheckedCreateWithoutGuildInput>
    connectOrCreate?: GuildActivityCreateOrConnectWithoutGuildInput
    connect?: GuildActivityWhereUniqueInput
  }

  export type GuildChannelCreateNestedManyWithoutGuildInput = {
    create?: XOR<GuildChannelCreateWithoutGuildInput, GuildChannelUncheckedCreateWithoutGuildInput> | GuildChannelCreateWithoutGuildInput[] | GuildChannelUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildChannelCreateOrConnectWithoutGuildInput | GuildChannelCreateOrConnectWithoutGuildInput[]
    createMany?: GuildChannelCreateManyGuildInputEnvelope
    connect?: GuildChannelWhereUniqueInput | GuildChannelWhereUniqueInput[]
  }

  export type GuildCurrencyCreateNestedManyWithoutGuildInput = {
    create?: XOR<GuildCurrencyCreateWithoutGuildInput, GuildCurrencyUncheckedCreateWithoutGuildInput> | GuildCurrencyCreateWithoutGuildInput[] | GuildCurrencyUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildCurrencyCreateOrConnectWithoutGuildInput | GuildCurrencyCreateOrConnectWithoutGuildInput[]
    createMany?: GuildCurrencyCreateManyGuildInputEnvelope
    connect?: GuildCurrencyWhereUniqueInput | GuildCurrencyWhereUniqueInput[]
  }

  export type GuildRemovalReasonCreateNestedManyWithoutGuildInput = {
    create?: XOR<GuildRemovalReasonCreateWithoutGuildInput, GuildRemovalReasonUncheckedCreateWithoutGuildInput> | GuildRemovalReasonCreateWithoutGuildInput[] | GuildRemovalReasonUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildRemovalReasonCreateOrConnectWithoutGuildInput | GuildRemovalReasonCreateOrConnectWithoutGuildInput[]
    createMany?: GuildRemovalReasonCreateManyGuildInputEnvelope
    connect?: GuildRemovalReasonWhereUniqueInput | GuildRemovalReasonWhereUniqueInput[]
  }

  export type GuildRoleCreateNestedManyWithoutGuildInput = {
    create?: XOR<GuildRoleCreateWithoutGuildInput, GuildRoleUncheckedCreateWithoutGuildInput> | GuildRoleCreateWithoutGuildInput[] | GuildRoleUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildRoleCreateOrConnectWithoutGuildInput | GuildRoleCreateOrConnectWithoutGuildInput[]
    createMany?: GuildRoleCreateManyGuildInputEnvelope
    connect?: GuildRoleWhereUniqueInput | GuildRoleWhereUniqueInput[]
  }

  export type GuildActivityUncheckedCreateNestedOneWithoutGuildInput = {
    create?: XOR<GuildActivityCreateWithoutGuildInput, GuildActivityUncheckedCreateWithoutGuildInput>
    connectOrCreate?: GuildActivityCreateOrConnectWithoutGuildInput
    connect?: GuildActivityWhereUniqueInput
  }

  export type GuildChannelUncheckedCreateNestedManyWithoutGuildInput = {
    create?: XOR<GuildChannelCreateWithoutGuildInput, GuildChannelUncheckedCreateWithoutGuildInput> | GuildChannelCreateWithoutGuildInput[] | GuildChannelUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildChannelCreateOrConnectWithoutGuildInput | GuildChannelCreateOrConnectWithoutGuildInput[]
    createMany?: GuildChannelCreateManyGuildInputEnvelope
    connect?: GuildChannelWhereUniqueInput | GuildChannelWhereUniqueInput[]
  }

  export type GuildCurrencyUncheckedCreateNestedManyWithoutGuildInput = {
    create?: XOR<GuildCurrencyCreateWithoutGuildInput, GuildCurrencyUncheckedCreateWithoutGuildInput> | GuildCurrencyCreateWithoutGuildInput[] | GuildCurrencyUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildCurrencyCreateOrConnectWithoutGuildInput | GuildCurrencyCreateOrConnectWithoutGuildInput[]
    createMany?: GuildCurrencyCreateManyGuildInputEnvelope
    connect?: GuildCurrencyWhereUniqueInput | GuildCurrencyWhereUniqueInput[]
  }

  export type GuildRemovalReasonUncheckedCreateNestedManyWithoutGuildInput = {
    create?: XOR<GuildRemovalReasonCreateWithoutGuildInput, GuildRemovalReasonUncheckedCreateWithoutGuildInput> | GuildRemovalReasonCreateWithoutGuildInput[] | GuildRemovalReasonUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildRemovalReasonCreateOrConnectWithoutGuildInput | GuildRemovalReasonCreateOrConnectWithoutGuildInput[]
    createMany?: GuildRemovalReasonCreateManyGuildInputEnvelope
    connect?: GuildRemovalReasonWhereUniqueInput | GuildRemovalReasonWhereUniqueInput[]
  }

  export type GuildRoleUncheckedCreateNestedManyWithoutGuildInput = {
    create?: XOR<GuildRoleCreateWithoutGuildInput, GuildRoleUncheckedCreateWithoutGuildInput> | GuildRoleCreateWithoutGuildInput[] | GuildRoleUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildRoleCreateOrConnectWithoutGuildInput | GuildRoleCreateOrConnectWithoutGuildInput[]
    createMany?: GuildRoleCreateManyGuildInputEnvelope
    connect?: GuildRoleWhereUniqueInput | GuildRoleWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type GuildActivityUpdateOneWithoutGuildNestedInput = {
    create?: XOR<GuildActivityCreateWithoutGuildInput, GuildActivityUncheckedCreateWithoutGuildInput>
    connectOrCreate?: GuildActivityCreateOrConnectWithoutGuildInput
    upsert?: GuildActivityUpsertWithoutGuildInput
    disconnect?: GuildActivityWhereInput | boolean
    delete?: GuildActivityWhereInput | boolean
    connect?: GuildActivityWhereUniqueInput
    update?: XOR<XOR<GuildActivityUpdateToOneWithWhereWithoutGuildInput, GuildActivityUpdateWithoutGuildInput>, GuildActivityUncheckedUpdateWithoutGuildInput>
  }

  export type GuildChannelUpdateManyWithoutGuildNestedInput = {
    create?: XOR<GuildChannelCreateWithoutGuildInput, GuildChannelUncheckedCreateWithoutGuildInput> | GuildChannelCreateWithoutGuildInput[] | GuildChannelUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildChannelCreateOrConnectWithoutGuildInput | GuildChannelCreateOrConnectWithoutGuildInput[]
    upsert?: GuildChannelUpsertWithWhereUniqueWithoutGuildInput | GuildChannelUpsertWithWhereUniqueWithoutGuildInput[]
    createMany?: GuildChannelCreateManyGuildInputEnvelope
    set?: GuildChannelWhereUniqueInput | GuildChannelWhereUniqueInput[]
    disconnect?: GuildChannelWhereUniqueInput | GuildChannelWhereUniqueInput[]
    delete?: GuildChannelWhereUniqueInput | GuildChannelWhereUniqueInput[]
    connect?: GuildChannelWhereUniqueInput | GuildChannelWhereUniqueInput[]
    update?: GuildChannelUpdateWithWhereUniqueWithoutGuildInput | GuildChannelUpdateWithWhereUniqueWithoutGuildInput[]
    updateMany?: GuildChannelUpdateManyWithWhereWithoutGuildInput | GuildChannelUpdateManyWithWhereWithoutGuildInput[]
    deleteMany?: GuildChannelScalarWhereInput | GuildChannelScalarWhereInput[]
  }

  export type GuildCurrencyUpdateManyWithoutGuildNestedInput = {
    create?: XOR<GuildCurrencyCreateWithoutGuildInput, GuildCurrencyUncheckedCreateWithoutGuildInput> | GuildCurrencyCreateWithoutGuildInput[] | GuildCurrencyUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildCurrencyCreateOrConnectWithoutGuildInput | GuildCurrencyCreateOrConnectWithoutGuildInput[]
    upsert?: GuildCurrencyUpsertWithWhereUniqueWithoutGuildInput | GuildCurrencyUpsertWithWhereUniqueWithoutGuildInput[]
    createMany?: GuildCurrencyCreateManyGuildInputEnvelope
    set?: GuildCurrencyWhereUniqueInput | GuildCurrencyWhereUniqueInput[]
    disconnect?: GuildCurrencyWhereUniqueInput | GuildCurrencyWhereUniqueInput[]
    delete?: GuildCurrencyWhereUniqueInput | GuildCurrencyWhereUniqueInput[]
    connect?: GuildCurrencyWhereUniqueInput | GuildCurrencyWhereUniqueInput[]
    update?: GuildCurrencyUpdateWithWhereUniqueWithoutGuildInput | GuildCurrencyUpdateWithWhereUniqueWithoutGuildInput[]
    updateMany?: GuildCurrencyUpdateManyWithWhereWithoutGuildInput | GuildCurrencyUpdateManyWithWhereWithoutGuildInput[]
    deleteMany?: GuildCurrencyScalarWhereInput | GuildCurrencyScalarWhereInput[]
  }

  export type GuildRemovalReasonUpdateManyWithoutGuildNestedInput = {
    create?: XOR<GuildRemovalReasonCreateWithoutGuildInput, GuildRemovalReasonUncheckedCreateWithoutGuildInput> | GuildRemovalReasonCreateWithoutGuildInput[] | GuildRemovalReasonUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildRemovalReasonCreateOrConnectWithoutGuildInput | GuildRemovalReasonCreateOrConnectWithoutGuildInput[]
    upsert?: GuildRemovalReasonUpsertWithWhereUniqueWithoutGuildInput | GuildRemovalReasonUpsertWithWhereUniqueWithoutGuildInput[]
    createMany?: GuildRemovalReasonCreateManyGuildInputEnvelope
    set?: GuildRemovalReasonWhereUniqueInput | GuildRemovalReasonWhereUniqueInput[]
    disconnect?: GuildRemovalReasonWhereUniqueInput | GuildRemovalReasonWhereUniqueInput[]
    delete?: GuildRemovalReasonWhereUniqueInput | GuildRemovalReasonWhereUniqueInput[]
    connect?: GuildRemovalReasonWhereUniqueInput | GuildRemovalReasonWhereUniqueInput[]
    update?: GuildRemovalReasonUpdateWithWhereUniqueWithoutGuildInput | GuildRemovalReasonUpdateWithWhereUniqueWithoutGuildInput[]
    updateMany?: GuildRemovalReasonUpdateManyWithWhereWithoutGuildInput | GuildRemovalReasonUpdateManyWithWhereWithoutGuildInput[]
    deleteMany?: GuildRemovalReasonScalarWhereInput | GuildRemovalReasonScalarWhereInput[]
  }

  export type GuildRoleUpdateManyWithoutGuildNestedInput = {
    create?: XOR<GuildRoleCreateWithoutGuildInput, GuildRoleUncheckedCreateWithoutGuildInput> | GuildRoleCreateWithoutGuildInput[] | GuildRoleUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildRoleCreateOrConnectWithoutGuildInput | GuildRoleCreateOrConnectWithoutGuildInput[]
    upsert?: GuildRoleUpsertWithWhereUniqueWithoutGuildInput | GuildRoleUpsertWithWhereUniqueWithoutGuildInput[]
    createMany?: GuildRoleCreateManyGuildInputEnvelope
    set?: GuildRoleWhereUniqueInput | GuildRoleWhereUniqueInput[]
    disconnect?: GuildRoleWhereUniqueInput | GuildRoleWhereUniqueInput[]
    delete?: GuildRoleWhereUniqueInput | GuildRoleWhereUniqueInput[]
    connect?: GuildRoleWhereUniqueInput | GuildRoleWhereUniqueInput[]
    update?: GuildRoleUpdateWithWhereUniqueWithoutGuildInput | GuildRoleUpdateWithWhereUniqueWithoutGuildInput[]
    updateMany?: GuildRoleUpdateManyWithWhereWithoutGuildInput | GuildRoleUpdateManyWithWhereWithoutGuildInput[]
    deleteMany?: GuildRoleScalarWhereInput | GuildRoleScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type GuildActivityUncheckedUpdateOneWithoutGuildNestedInput = {
    create?: XOR<GuildActivityCreateWithoutGuildInput, GuildActivityUncheckedCreateWithoutGuildInput>
    connectOrCreate?: GuildActivityCreateOrConnectWithoutGuildInput
    upsert?: GuildActivityUpsertWithoutGuildInput
    disconnect?: GuildActivityWhereInput | boolean
    delete?: GuildActivityWhereInput | boolean
    connect?: GuildActivityWhereUniqueInput
    update?: XOR<XOR<GuildActivityUpdateToOneWithWhereWithoutGuildInput, GuildActivityUpdateWithoutGuildInput>, GuildActivityUncheckedUpdateWithoutGuildInput>
  }

  export type GuildChannelUncheckedUpdateManyWithoutGuildNestedInput = {
    create?: XOR<GuildChannelCreateWithoutGuildInput, GuildChannelUncheckedCreateWithoutGuildInput> | GuildChannelCreateWithoutGuildInput[] | GuildChannelUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildChannelCreateOrConnectWithoutGuildInput | GuildChannelCreateOrConnectWithoutGuildInput[]
    upsert?: GuildChannelUpsertWithWhereUniqueWithoutGuildInput | GuildChannelUpsertWithWhereUniqueWithoutGuildInput[]
    createMany?: GuildChannelCreateManyGuildInputEnvelope
    set?: GuildChannelWhereUniqueInput | GuildChannelWhereUniqueInput[]
    disconnect?: GuildChannelWhereUniqueInput | GuildChannelWhereUniqueInput[]
    delete?: GuildChannelWhereUniqueInput | GuildChannelWhereUniqueInput[]
    connect?: GuildChannelWhereUniqueInput | GuildChannelWhereUniqueInput[]
    update?: GuildChannelUpdateWithWhereUniqueWithoutGuildInput | GuildChannelUpdateWithWhereUniqueWithoutGuildInput[]
    updateMany?: GuildChannelUpdateManyWithWhereWithoutGuildInput | GuildChannelUpdateManyWithWhereWithoutGuildInput[]
    deleteMany?: GuildChannelScalarWhereInput | GuildChannelScalarWhereInput[]
  }

  export type GuildCurrencyUncheckedUpdateManyWithoutGuildNestedInput = {
    create?: XOR<GuildCurrencyCreateWithoutGuildInput, GuildCurrencyUncheckedCreateWithoutGuildInput> | GuildCurrencyCreateWithoutGuildInput[] | GuildCurrencyUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildCurrencyCreateOrConnectWithoutGuildInput | GuildCurrencyCreateOrConnectWithoutGuildInput[]
    upsert?: GuildCurrencyUpsertWithWhereUniqueWithoutGuildInput | GuildCurrencyUpsertWithWhereUniqueWithoutGuildInput[]
    createMany?: GuildCurrencyCreateManyGuildInputEnvelope
    set?: GuildCurrencyWhereUniqueInput | GuildCurrencyWhereUniqueInput[]
    disconnect?: GuildCurrencyWhereUniqueInput | GuildCurrencyWhereUniqueInput[]
    delete?: GuildCurrencyWhereUniqueInput | GuildCurrencyWhereUniqueInput[]
    connect?: GuildCurrencyWhereUniqueInput | GuildCurrencyWhereUniqueInput[]
    update?: GuildCurrencyUpdateWithWhereUniqueWithoutGuildInput | GuildCurrencyUpdateWithWhereUniqueWithoutGuildInput[]
    updateMany?: GuildCurrencyUpdateManyWithWhereWithoutGuildInput | GuildCurrencyUpdateManyWithWhereWithoutGuildInput[]
    deleteMany?: GuildCurrencyScalarWhereInput | GuildCurrencyScalarWhereInput[]
  }

  export type GuildRemovalReasonUncheckedUpdateManyWithoutGuildNestedInput = {
    create?: XOR<GuildRemovalReasonCreateWithoutGuildInput, GuildRemovalReasonUncheckedCreateWithoutGuildInput> | GuildRemovalReasonCreateWithoutGuildInput[] | GuildRemovalReasonUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildRemovalReasonCreateOrConnectWithoutGuildInput | GuildRemovalReasonCreateOrConnectWithoutGuildInput[]
    upsert?: GuildRemovalReasonUpsertWithWhereUniqueWithoutGuildInput | GuildRemovalReasonUpsertWithWhereUniqueWithoutGuildInput[]
    createMany?: GuildRemovalReasonCreateManyGuildInputEnvelope
    set?: GuildRemovalReasonWhereUniqueInput | GuildRemovalReasonWhereUniqueInput[]
    disconnect?: GuildRemovalReasonWhereUniqueInput | GuildRemovalReasonWhereUniqueInput[]
    delete?: GuildRemovalReasonWhereUniqueInput | GuildRemovalReasonWhereUniqueInput[]
    connect?: GuildRemovalReasonWhereUniqueInput | GuildRemovalReasonWhereUniqueInput[]
    update?: GuildRemovalReasonUpdateWithWhereUniqueWithoutGuildInput | GuildRemovalReasonUpdateWithWhereUniqueWithoutGuildInput[]
    updateMany?: GuildRemovalReasonUpdateManyWithWhereWithoutGuildInput | GuildRemovalReasonUpdateManyWithWhereWithoutGuildInput[]
    deleteMany?: GuildRemovalReasonScalarWhereInput | GuildRemovalReasonScalarWhereInput[]
  }

  export type GuildRoleUncheckedUpdateManyWithoutGuildNestedInput = {
    create?: XOR<GuildRoleCreateWithoutGuildInput, GuildRoleUncheckedCreateWithoutGuildInput> | GuildRoleCreateWithoutGuildInput[] | GuildRoleUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildRoleCreateOrConnectWithoutGuildInput | GuildRoleCreateOrConnectWithoutGuildInput[]
    upsert?: GuildRoleUpsertWithWhereUniqueWithoutGuildInput | GuildRoleUpsertWithWhereUniqueWithoutGuildInput[]
    createMany?: GuildRoleCreateManyGuildInputEnvelope
    set?: GuildRoleWhereUniqueInput | GuildRoleWhereUniqueInput[]
    disconnect?: GuildRoleWhereUniqueInput | GuildRoleWhereUniqueInput[]
    delete?: GuildRoleWhereUniqueInput | GuildRoleWhereUniqueInput[]
    connect?: GuildRoleWhereUniqueInput | GuildRoleWhereUniqueInput[]
    update?: GuildRoleUpdateWithWhereUniqueWithoutGuildInput | GuildRoleUpdateWithWhereUniqueWithoutGuildInput[]
    updateMany?: GuildRoleUpdateManyWithWhereWithoutGuildInput | GuildRoleUpdateManyWithWhereWithoutGuildInput[]
    deleteMany?: GuildRoleScalarWhereInput | GuildRoleScalarWhereInput[]
  }

  export type GuildCreateNestedOneWithoutGuildActivityInput = {
    create?: XOR<GuildCreateWithoutGuildActivityInput, GuildUncheckedCreateWithoutGuildActivityInput>
    connectOrCreate?: GuildCreateOrConnectWithoutGuildActivityInput
    connect?: GuildWhereUniqueInput
  }

  export type GuildUpdateOneWithoutGuildActivityNestedInput = {
    create?: XOR<GuildCreateWithoutGuildActivityInput, GuildUncheckedCreateWithoutGuildActivityInput>
    connectOrCreate?: GuildCreateOrConnectWithoutGuildActivityInput
    upsert?: GuildUpsertWithoutGuildActivityInput
    disconnect?: GuildWhereInput | boolean
    delete?: GuildWhereInput | boolean
    connect?: GuildWhereUniqueInput
    update?: XOR<XOR<GuildUpdateToOneWithWhereWithoutGuildActivityInput, GuildUpdateWithoutGuildActivityInput>, GuildUncheckedUpdateWithoutGuildActivityInput>
  }

  export type GuildCreateNestedOneWithoutGuildChannelsInput = {
    create?: XOR<GuildCreateWithoutGuildChannelsInput, GuildUncheckedCreateWithoutGuildChannelsInput>
    connectOrCreate?: GuildCreateOrConnectWithoutGuildChannelsInput
    connect?: GuildWhereUniqueInput
  }

  export type GuildUpdateOneRequiredWithoutGuildChannelsNestedInput = {
    create?: XOR<GuildCreateWithoutGuildChannelsInput, GuildUncheckedCreateWithoutGuildChannelsInput>
    connectOrCreate?: GuildCreateOrConnectWithoutGuildChannelsInput
    upsert?: GuildUpsertWithoutGuildChannelsInput
    connect?: GuildWhereUniqueInput
    update?: XOR<XOR<GuildUpdateToOneWithWhereWithoutGuildChannelsInput, GuildUpdateWithoutGuildChannelsInput>, GuildUncheckedUpdateWithoutGuildChannelsInput>
  }

  export type GuildCreateNestedOneWithoutGuildCurrenciesInput = {
    create?: XOR<GuildCreateWithoutGuildCurrenciesInput, GuildUncheckedCreateWithoutGuildCurrenciesInput>
    connectOrCreate?: GuildCreateOrConnectWithoutGuildCurrenciesInput
    connect?: GuildWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type GuildUpdateOneRequiredWithoutGuildCurrenciesNestedInput = {
    create?: XOR<GuildCreateWithoutGuildCurrenciesInput, GuildUncheckedCreateWithoutGuildCurrenciesInput>
    connectOrCreate?: GuildCreateOrConnectWithoutGuildCurrenciesInput
    upsert?: GuildUpsertWithoutGuildCurrenciesInput
    connect?: GuildWhereUniqueInput
    update?: XOR<XOR<GuildUpdateToOneWithWhereWithoutGuildCurrenciesInput, GuildUpdateWithoutGuildCurrenciesInput>, GuildUncheckedUpdateWithoutGuildCurrenciesInput>
  }

  export type GuildCreateNestedOneWithoutGuildRemovalReasonsInput = {
    create?: XOR<GuildCreateWithoutGuildRemovalReasonsInput, GuildUncheckedCreateWithoutGuildRemovalReasonsInput>
    connectOrCreate?: GuildCreateOrConnectWithoutGuildRemovalReasonsInput
    connect?: GuildWhereUniqueInput
  }

  export type GuildUpdateOneRequiredWithoutGuildRemovalReasonsNestedInput = {
    create?: XOR<GuildCreateWithoutGuildRemovalReasonsInput, GuildUncheckedCreateWithoutGuildRemovalReasonsInput>
    connectOrCreate?: GuildCreateOrConnectWithoutGuildRemovalReasonsInput
    upsert?: GuildUpsertWithoutGuildRemovalReasonsInput
    connect?: GuildWhereUniqueInput
    update?: XOR<XOR<GuildUpdateToOneWithWhereWithoutGuildRemovalReasonsInput, GuildUpdateWithoutGuildRemovalReasonsInput>, GuildUncheckedUpdateWithoutGuildRemovalReasonsInput>
  }

  export type GuildCreateNestedOneWithoutGuildRolesInput = {
    create?: XOR<GuildCreateWithoutGuildRolesInput, GuildUncheckedCreateWithoutGuildRolesInput>
    connectOrCreate?: GuildCreateOrConnectWithoutGuildRolesInput
    connect?: GuildWhereUniqueInput
  }

  export type GuildUpdateOneRequiredWithoutGuildRolesNestedInput = {
    create?: XOR<GuildCreateWithoutGuildRolesInput, GuildUncheckedCreateWithoutGuildRolesInput>
    connectOrCreate?: GuildCreateOrConnectWithoutGuildRolesInput
    upsert?: GuildUpsertWithoutGuildRolesInput
    connect?: GuildWhereUniqueInput
    update?: XOR<XOR<GuildUpdateToOneWithWhereWithoutGuildRolesInput, GuildUpdateWithoutGuildRolesInput>, GuildUncheckedUpdateWithoutGuildRolesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type GuildActivityCreateWithoutGuildInput = {
    numGuildChannels?: number
    numGuildCurrencies?: number
    numGuildRoles?: number
    numRemovalReasons?: number
  }

  export type GuildActivityUncheckedCreateWithoutGuildInput = {
    id?: number
    numGuildChannels?: number
    numGuildCurrencies?: number
    numGuildRoles?: number
    numRemovalReasons?: number
  }

  export type GuildActivityCreateOrConnectWithoutGuildInput = {
    where: GuildActivityWhereUniqueInput
    create: XOR<GuildActivityCreateWithoutGuildInput, GuildActivityUncheckedCreateWithoutGuildInput>
  }

  export type GuildChannelCreateWithoutGuildInput = {
    name: string
  }

  export type GuildChannelUncheckedCreateWithoutGuildInput = {
    id?: number
    name: string
  }

  export type GuildChannelCreateOrConnectWithoutGuildInput = {
    where: GuildChannelWhereUniqueInput
    create: XOR<GuildChannelCreateWithoutGuildInput, GuildChannelUncheckedCreateWithoutGuildInput>
  }

  export type GuildChannelCreateManyGuildInputEnvelope = {
    data: GuildChannelCreateManyGuildInput | GuildChannelCreateManyGuildInput[]
    skipDuplicates?: boolean
  }

  export type GuildCurrencyCreateWithoutGuildInput = {
    name: string
    value: number
  }

  export type GuildCurrencyUncheckedCreateWithoutGuildInput = {
    id?: number
    name: string
    value: number
  }

  export type GuildCurrencyCreateOrConnectWithoutGuildInput = {
    where: GuildCurrencyWhereUniqueInput
    create: XOR<GuildCurrencyCreateWithoutGuildInput, GuildCurrencyUncheckedCreateWithoutGuildInput>
  }

  export type GuildCurrencyCreateManyGuildInputEnvelope = {
    data: GuildCurrencyCreateManyGuildInput | GuildCurrencyCreateManyGuildInput[]
    skipDuplicates?: boolean
  }

  export type GuildRemovalReasonCreateWithoutGuildInput = {
    reason: string
  }

  export type GuildRemovalReasonUncheckedCreateWithoutGuildInput = {
    id?: number
    reason: string
  }

  export type GuildRemovalReasonCreateOrConnectWithoutGuildInput = {
    where: GuildRemovalReasonWhereUniqueInput
    create: XOR<GuildRemovalReasonCreateWithoutGuildInput, GuildRemovalReasonUncheckedCreateWithoutGuildInput>
  }

  export type GuildRemovalReasonCreateManyGuildInputEnvelope = {
    data: GuildRemovalReasonCreateManyGuildInput | GuildRemovalReasonCreateManyGuildInput[]
    skipDuplicates?: boolean
  }

  export type GuildRoleCreateWithoutGuildInput = {
    name: string
  }

  export type GuildRoleUncheckedCreateWithoutGuildInput = {
    id?: number
    name: string
  }

  export type GuildRoleCreateOrConnectWithoutGuildInput = {
    where: GuildRoleWhereUniqueInput
    create: XOR<GuildRoleCreateWithoutGuildInput, GuildRoleUncheckedCreateWithoutGuildInput>
  }

  export type GuildRoleCreateManyGuildInputEnvelope = {
    data: GuildRoleCreateManyGuildInput | GuildRoleCreateManyGuildInput[]
    skipDuplicates?: boolean
  }

  export type GuildActivityUpsertWithoutGuildInput = {
    update: XOR<GuildActivityUpdateWithoutGuildInput, GuildActivityUncheckedUpdateWithoutGuildInput>
    create: XOR<GuildActivityCreateWithoutGuildInput, GuildActivityUncheckedCreateWithoutGuildInput>
    where?: GuildActivityWhereInput
  }

  export type GuildActivityUpdateToOneWithWhereWithoutGuildInput = {
    where?: GuildActivityWhereInput
    data: XOR<GuildActivityUpdateWithoutGuildInput, GuildActivityUncheckedUpdateWithoutGuildInput>
  }

  export type GuildActivityUpdateWithoutGuildInput = {
    numGuildChannels?: IntFieldUpdateOperationsInput | number
    numGuildCurrencies?: IntFieldUpdateOperationsInput | number
    numGuildRoles?: IntFieldUpdateOperationsInput | number
    numRemovalReasons?: IntFieldUpdateOperationsInput | number
  }

  export type GuildActivityUncheckedUpdateWithoutGuildInput = {
    id?: IntFieldUpdateOperationsInput | number
    numGuildChannels?: IntFieldUpdateOperationsInput | number
    numGuildCurrencies?: IntFieldUpdateOperationsInput | number
    numGuildRoles?: IntFieldUpdateOperationsInput | number
    numRemovalReasons?: IntFieldUpdateOperationsInput | number
  }

  export type GuildChannelUpsertWithWhereUniqueWithoutGuildInput = {
    where: GuildChannelWhereUniqueInput
    update: XOR<GuildChannelUpdateWithoutGuildInput, GuildChannelUncheckedUpdateWithoutGuildInput>
    create: XOR<GuildChannelCreateWithoutGuildInput, GuildChannelUncheckedCreateWithoutGuildInput>
  }

  export type GuildChannelUpdateWithWhereUniqueWithoutGuildInput = {
    where: GuildChannelWhereUniqueInput
    data: XOR<GuildChannelUpdateWithoutGuildInput, GuildChannelUncheckedUpdateWithoutGuildInput>
  }

  export type GuildChannelUpdateManyWithWhereWithoutGuildInput = {
    where: GuildChannelScalarWhereInput
    data: XOR<GuildChannelUpdateManyMutationInput, GuildChannelUncheckedUpdateManyWithoutGuildInput>
  }

  export type GuildChannelScalarWhereInput = {
    AND?: GuildChannelScalarWhereInput | GuildChannelScalarWhereInput[]
    OR?: GuildChannelScalarWhereInput[]
    NOT?: GuildChannelScalarWhereInput | GuildChannelScalarWhereInput[]
    id?: IntFilter<"GuildChannel"> | number
    guildId?: IntFilter<"GuildChannel"> | number
    name?: StringFilter<"GuildChannel"> | string
  }

  export type GuildCurrencyUpsertWithWhereUniqueWithoutGuildInput = {
    where: GuildCurrencyWhereUniqueInput
    update: XOR<GuildCurrencyUpdateWithoutGuildInput, GuildCurrencyUncheckedUpdateWithoutGuildInput>
    create: XOR<GuildCurrencyCreateWithoutGuildInput, GuildCurrencyUncheckedCreateWithoutGuildInput>
  }

  export type GuildCurrencyUpdateWithWhereUniqueWithoutGuildInput = {
    where: GuildCurrencyWhereUniqueInput
    data: XOR<GuildCurrencyUpdateWithoutGuildInput, GuildCurrencyUncheckedUpdateWithoutGuildInput>
  }

  export type GuildCurrencyUpdateManyWithWhereWithoutGuildInput = {
    where: GuildCurrencyScalarWhereInput
    data: XOR<GuildCurrencyUpdateManyMutationInput, GuildCurrencyUncheckedUpdateManyWithoutGuildInput>
  }

  export type GuildCurrencyScalarWhereInput = {
    AND?: GuildCurrencyScalarWhereInput | GuildCurrencyScalarWhereInput[]
    OR?: GuildCurrencyScalarWhereInput[]
    NOT?: GuildCurrencyScalarWhereInput | GuildCurrencyScalarWhereInput[]
    id?: IntFilter<"GuildCurrency"> | number
    guildId?: IntFilter<"GuildCurrency"> | number
    name?: StringFilter<"GuildCurrency"> | string
    value?: FloatFilter<"GuildCurrency"> | number
  }

  export type GuildRemovalReasonUpsertWithWhereUniqueWithoutGuildInput = {
    where: GuildRemovalReasonWhereUniqueInput
    update: XOR<GuildRemovalReasonUpdateWithoutGuildInput, GuildRemovalReasonUncheckedUpdateWithoutGuildInput>
    create: XOR<GuildRemovalReasonCreateWithoutGuildInput, GuildRemovalReasonUncheckedCreateWithoutGuildInput>
  }

  export type GuildRemovalReasonUpdateWithWhereUniqueWithoutGuildInput = {
    where: GuildRemovalReasonWhereUniqueInput
    data: XOR<GuildRemovalReasonUpdateWithoutGuildInput, GuildRemovalReasonUncheckedUpdateWithoutGuildInput>
  }

  export type GuildRemovalReasonUpdateManyWithWhereWithoutGuildInput = {
    where: GuildRemovalReasonScalarWhereInput
    data: XOR<GuildRemovalReasonUpdateManyMutationInput, GuildRemovalReasonUncheckedUpdateManyWithoutGuildInput>
  }

  export type GuildRemovalReasonScalarWhereInput = {
    AND?: GuildRemovalReasonScalarWhereInput | GuildRemovalReasonScalarWhereInput[]
    OR?: GuildRemovalReasonScalarWhereInput[]
    NOT?: GuildRemovalReasonScalarWhereInput | GuildRemovalReasonScalarWhereInput[]
    id?: IntFilter<"GuildRemovalReason"> | number
    guildId?: IntFilter<"GuildRemovalReason"> | number
    reason?: StringFilter<"GuildRemovalReason"> | string
  }

  export type GuildRoleUpsertWithWhereUniqueWithoutGuildInput = {
    where: GuildRoleWhereUniqueInput
    update: XOR<GuildRoleUpdateWithoutGuildInput, GuildRoleUncheckedUpdateWithoutGuildInput>
    create: XOR<GuildRoleCreateWithoutGuildInput, GuildRoleUncheckedCreateWithoutGuildInput>
  }

  export type GuildRoleUpdateWithWhereUniqueWithoutGuildInput = {
    where: GuildRoleWhereUniqueInput
    data: XOR<GuildRoleUpdateWithoutGuildInput, GuildRoleUncheckedUpdateWithoutGuildInput>
  }

  export type GuildRoleUpdateManyWithWhereWithoutGuildInput = {
    where: GuildRoleScalarWhereInput
    data: XOR<GuildRoleUpdateManyMutationInput, GuildRoleUncheckedUpdateManyWithoutGuildInput>
  }

  export type GuildRoleScalarWhereInput = {
    AND?: GuildRoleScalarWhereInput | GuildRoleScalarWhereInput[]
    OR?: GuildRoleScalarWhereInput[]
    NOT?: GuildRoleScalarWhereInput | GuildRoleScalarWhereInput[]
    id?: IntFilter<"GuildRole"> | number
    guildId?: IntFilter<"GuildRole"> | number
    name?: StringFilter<"GuildRole"> | string
  }

  export type GuildCreateWithoutGuildActivityInput = {
    discordId: string
    name: string
    guildChannels?: GuildChannelCreateNestedManyWithoutGuildInput
    guildCurrencies?: GuildCurrencyCreateNestedManyWithoutGuildInput
    guildRemovalReasons?: GuildRemovalReasonCreateNestedManyWithoutGuildInput
    guildRoles?: GuildRoleCreateNestedManyWithoutGuildInput
  }

  export type GuildUncheckedCreateWithoutGuildActivityInput = {
    id?: number
    discordId: string
    name: string
    guildChannels?: GuildChannelUncheckedCreateNestedManyWithoutGuildInput
    guildCurrencies?: GuildCurrencyUncheckedCreateNestedManyWithoutGuildInput
    guildRemovalReasons?: GuildRemovalReasonUncheckedCreateNestedManyWithoutGuildInput
    guildRoles?: GuildRoleUncheckedCreateNestedManyWithoutGuildInput
  }

  export type GuildCreateOrConnectWithoutGuildActivityInput = {
    where: GuildWhereUniqueInput
    create: XOR<GuildCreateWithoutGuildActivityInput, GuildUncheckedCreateWithoutGuildActivityInput>
  }

  export type GuildUpsertWithoutGuildActivityInput = {
    update: XOR<GuildUpdateWithoutGuildActivityInput, GuildUncheckedUpdateWithoutGuildActivityInput>
    create: XOR<GuildCreateWithoutGuildActivityInput, GuildUncheckedCreateWithoutGuildActivityInput>
    where?: GuildWhereInput
  }

  export type GuildUpdateToOneWithWhereWithoutGuildActivityInput = {
    where?: GuildWhereInput
    data: XOR<GuildUpdateWithoutGuildActivityInput, GuildUncheckedUpdateWithoutGuildActivityInput>
  }

  export type GuildUpdateWithoutGuildActivityInput = {
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    guildChannels?: GuildChannelUpdateManyWithoutGuildNestedInput
    guildCurrencies?: GuildCurrencyUpdateManyWithoutGuildNestedInput
    guildRemovalReasons?: GuildRemovalReasonUpdateManyWithoutGuildNestedInput
    guildRoles?: GuildRoleUpdateManyWithoutGuildNestedInput
  }

  export type GuildUncheckedUpdateWithoutGuildActivityInput = {
    id?: IntFieldUpdateOperationsInput | number
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    guildChannels?: GuildChannelUncheckedUpdateManyWithoutGuildNestedInput
    guildCurrencies?: GuildCurrencyUncheckedUpdateManyWithoutGuildNestedInput
    guildRemovalReasons?: GuildRemovalReasonUncheckedUpdateManyWithoutGuildNestedInput
    guildRoles?: GuildRoleUncheckedUpdateManyWithoutGuildNestedInput
  }

  export type GuildCreateWithoutGuildChannelsInput = {
    discordId: string
    name: string
    guildActivity?: GuildActivityCreateNestedOneWithoutGuildInput
    guildCurrencies?: GuildCurrencyCreateNestedManyWithoutGuildInput
    guildRemovalReasons?: GuildRemovalReasonCreateNestedManyWithoutGuildInput
    guildRoles?: GuildRoleCreateNestedManyWithoutGuildInput
  }

  export type GuildUncheckedCreateWithoutGuildChannelsInput = {
    id?: number
    discordId: string
    name: string
    guildActivity?: GuildActivityUncheckedCreateNestedOneWithoutGuildInput
    guildCurrencies?: GuildCurrencyUncheckedCreateNestedManyWithoutGuildInput
    guildRemovalReasons?: GuildRemovalReasonUncheckedCreateNestedManyWithoutGuildInput
    guildRoles?: GuildRoleUncheckedCreateNestedManyWithoutGuildInput
  }

  export type GuildCreateOrConnectWithoutGuildChannelsInput = {
    where: GuildWhereUniqueInput
    create: XOR<GuildCreateWithoutGuildChannelsInput, GuildUncheckedCreateWithoutGuildChannelsInput>
  }

  export type GuildUpsertWithoutGuildChannelsInput = {
    update: XOR<GuildUpdateWithoutGuildChannelsInput, GuildUncheckedUpdateWithoutGuildChannelsInput>
    create: XOR<GuildCreateWithoutGuildChannelsInput, GuildUncheckedCreateWithoutGuildChannelsInput>
    where?: GuildWhereInput
  }

  export type GuildUpdateToOneWithWhereWithoutGuildChannelsInput = {
    where?: GuildWhereInput
    data: XOR<GuildUpdateWithoutGuildChannelsInput, GuildUncheckedUpdateWithoutGuildChannelsInput>
  }

  export type GuildUpdateWithoutGuildChannelsInput = {
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    guildActivity?: GuildActivityUpdateOneWithoutGuildNestedInput
    guildCurrencies?: GuildCurrencyUpdateManyWithoutGuildNestedInput
    guildRemovalReasons?: GuildRemovalReasonUpdateManyWithoutGuildNestedInput
    guildRoles?: GuildRoleUpdateManyWithoutGuildNestedInput
  }

  export type GuildUncheckedUpdateWithoutGuildChannelsInput = {
    id?: IntFieldUpdateOperationsInput | number
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    guildActivity?: GuildActivityUncheckedUpdateOneWithoutGuildNestedInput
    guildCurrencies?: GuildCurrencyUncheckedUpdateManyWithoutGuildNestedInput
    guildRemovalReasons?: GuildRemovalReasonUncheckedUpdateManyWithoutGuildNestedInput
    guildRoles?: GuildRoleUncheckedUpdateManyWithoutGuildNestedInput
  }

  export type GuildCreateWithoutGuildCurrenciesInput = {
    discordId: string
    name: string
    guildActivity?: GuildActivityCreateNestedOneWithoutGuildInput
    guildChannels?: GuildChannelCreateNestedManyWithoutGuildInput
    guildRemovalReasons?: GuildRemovalReasonCreateNestedManyWithoutGuildInput
    guildRoles?: GuildRoleCreateNestedManyWithoutGuildInput
  }

  export type GuildUncheckedCreateWithoutGuildCurrenciesInput = {
    id?: number
    discordId: string
    name: string
    guildActivity?: GuildActivityUncheckedCreateNestedOneWithoutGuildInput
    guildChannels?: GuildChannelUncheckedCreateNestedManyWithoutGuildInput
    guildRemovalReasons?: GuildRemovalReasonUncheckedCreateNestedManyWithoutGuildInput
    guildRoles?: GuildRoleUncheckedCreateNestedManyWithoutGuildInput
  }

  export type GuildCreateOrConnectWithoutGuildCurrenciesInput = {
    where: GuildWhereUniqueInput
    create: XOR<GuildCreateWithoutGuildCurrenciesInput, GuildUncheckedCreateWithoutGuildCurrenciesInput>
  }

  export type GuildUpsertWithoutGuildCurrenciesInput = {
    update: XOR<GuildUpdateWithoutGuildCurrenciesInput, GuildUncheckedUpdateWithoutGuildCurrenciesInput>
    create: XOR<GuildCreateWithoutGuildCurrenciesInput, GuildUncheckedCreateWithoutGuildCurrenciesInput>
    where?: GuildWhereInput
  }

  export type GuildUpdateToOneWithWhereWithoutGuildCurrenciesInput = {
    where?: GuildWhereInput
    data: XOR<GuildUpdateWithoutGuildCurrenciesInput, GuildUncheckedUpdateWithoutGuildCurrenciesInput>
  }

  export type GuildUpdateWithoutGuildCurrenciesInput = {
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    guildActivity?: GuildActivityUpdateOneWithoutGuildNestedInput
    guildChannels?: GuildChannelUpdateManyWithoutGuildNestedInput
    guildRemovalReasons?: GuildRemovalReasonUpdateManyWithoutGuildNestedInput
    guildRoles?: GuildRoleUpdateManyWithoutGuildNestedInput
  }

  export type GuildUncheckedUpdateWithoutGuildCurrenciesInput = {
    id?: IntFieldUpdateOperationsInput | number
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    guildActivity?: GuildActivityUncheckedUpdateOneWithoutGuildNestedInput
    guildChannels?: GuildChannelUncheckedUpdateManyWithoutGuildNestedInput
    guildRemovalReasons?: GuildRemovalReasonUncheckedUpdateManyWithoutGuildNestedInput
    guildRoles?: GuildRoleUncheckedUpdateManyWithoutGuildNestedInput
  }

  export type GuildCreateWithoutGuildRemovalReasonsInput = {
    discordId: string
    name: string
    guildActivity?: GuildActivityCreateNestedOneWithoutGuildInput
    guildChannels?: GuildChannelCreateNestedManyWithoutGuildInput
    guildCurrencies?: GuildCurrencyCreateNestedManyWithoutGuildInput
    guildRoles?: GuildRoleCreateNestedManyWithoutGuildInput
  }

  export type GuildUncheckedCreateWithoutGuildRemovalReasonsInput = {
    id?: number
    discordId: string
    name: string
    guildActivity?: GuildActivityUncheckedCreateNestedOneWithoutGuildInput
    guildChannels?: GuildChannelUncheckedCreateNestedManyWithoutGuildInput
    guildCurrencies?: GuildCurrencyUncheckedCreateNestedManyWithoutGuildInput
    guildRoles?: GuildRoleUncheckedCreateNestedManyWithoutGuildInput
  }

  export type GuildCreateOrConnectWithoutGuildRemovalReasonsInput = {
    where: GuildWhereUniqueInput
    create: XOR<GuildCreateWithoutGuildRemovalReasonsInput, GuildUncheckedCreateWithoutGuildRemovalReasonsInput>
  }

  export type GuildUpsertWithoutGuildRemovalReasonsInput = {
    update: XOR<GuildUpdateWithoutGuildRemovalReasonsInput, GuildUncheckedUpdateWithoutGuildRemovalReasonsInput>
    create: XOR<GuildCreateWithoutGuildRemovalReasonsInput, GuildUncheckedCreateWithoutGuildRemovalReasonsInput>
    where?: GuildWhereInput
  }

  export type GuildUpdateToOneWithWhereWithoutGuildRemovalReasonsInput = {
    where?: GuildWhereInput
    data: XOR<GuildUpdateWithoutGuildRemovalReasonsInput, GuildUncheckedUpdateWithoutGuildRemovalReasonsInput>
  }

  export type GuildUpdateWithoutGuildRemovalReasonsInput = {
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    guildActivity?: GuildActivityUpdateOneWithoutGuildNestedInput
    guildChannels?: GuildChannelUpdateManyWithoutGuildNestedInput
    guildCurrencies?: GuildCurrencyUpdateManyWithoutGuildNestedInput
    guildRoles?: GuildRoleUpdateManyWithoutGuildNestedInput
  }

  export type GuildUncheckedUpdateWithoutGuildRemovalReasonsInput = {
    id?: IntFieldUpdateOperationsInput | number
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    guildActivity?: GuildActivityUncheckedUpdateOneWithoutGuildNestedInput
    guildChannels?: GuildChannelUncheckedUpdateManyWithoutGuildNestedInput
    guildCurrencies?: GuildCurrencyUncheckedUpdateManyWithoutGuildNestedInput
    guildRoles?: GuildRoleUncheckedUpdateManyWithoutGuildNestedInput
  }

  export type GuildCreateWithoutGuildRolesInput = {
    discordId: string
    name: string
    guildActivity?: GuildActivityCreateNestedOneWithoutGuildInput
    guildChannels?: GuildChannelCreateNestedManyWithoutGuildInput
    guildCurrencies?: GuildCurrencyCreateNestedManyWithoutGuildInput
    guildRemovalReasons?: GuildRemovalReasonCreateNestedManyWithoutGuildInput
  }

  export type GuildUncheckedCreateWithoutGuildRolesInput = {
    id?: number
    discordId: string
    name: string
    guildActivity?: GuildActivityUncheckedCreateNestedOneWithoutGuildInput
    guildChannels?: GuildChannelUncheckedCreateNestedManyWithoutGuildInput
    guildCurrencies?: GuildCurrencyUncheckedCreateNestedManyWithoutGuildInput
    guildRemovalReasons?: GuildRemovalReasonUncheckedCreateNestedManyWithoutGuildInput
  }

  export type GuildCreateOrConnectWithoutGuildRolesInput = {
    where: GuildWhereUniqueInput
    create: XOR<GuildCreateWithoutGuildRolesInput, GuildUncheckedCreateWithoutGuildRolesInput>
  }

  export type GuildUpsertWithoutGuildRolesInput = {
    update: XOR<GuildUpdateWithoutGuildRolesInput, GuildUncheckedUpdateWithoutGuildRolesInput>
    create: XOR<GuildCreateWithoutGuildRolesInput, GuildUncheckedCreateWithoutGuildRolesInput>
    where?: GuildWhereInput
  }

  export type GuildUpdateToOneWithWhereWithoutGuildRolesInput = {
    where?: GuildWhereInput
    data: XOR<GuildUpdateWithoutGuildRolesInput, GuildUncheckedUpdateWithoutGuildRolesInput>
  }

  export type GuildUpdateWithoutGuildRolesInput = {
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    guildActivity?: GuildActivityUpdateOneWithoutGuildNestedInput
    guildChannels?: GuildChannelUpdateManyWithoutGuildNestedInput
    guildCurrencies?: GuildCurrencyUpdateManyWithoutGuildNestedInput
    guildRemovalReasons?: GuildRemovalReasonUpdateManyWithoutGuildNestedInput
  }

  export type GuildUncheckedUpdateWithoutGuildRolesInput = {
    id?: IntFieldUpdateOperationsInput | number
    discordId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    guildActivity?: GuildActivityUncheckedUpdateOneWithoutGuildNestedInput
    guildChannels?: GuildChannelUncheckedUpdateManyWithoutGuildNestedInput
    guildCurrencies?: GuildCurrencyUncheckedUpdateManyWithoutGuildNestedInput
    guildRemovalReasons?: GuildRemovalReasonUncheckedUpdateManyWithoutGuildNestedInput
  }

  export type GuildChannelCreateManyGuildInput = {
    id?: number
    name: string
  }

  export type GuildCurrencyCreateManyGuildInput = {
    id?: number
    name: string
    value: number
  }

  export type GuildRemovalReasonCreateManyGuildInput = {
    id?: number
    reason: string
  }

  export type GuildRoleCreateManyGuildInput = {
    id?: number
    name: string
  }

  export type GuildChannelUpdateWithoutGuildInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type GuildChannelUncheckedUpdateWithoutGuildInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type GuildChannelUncheckedUpdateManyWithoutGuildInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type GuildCurrencyUpdateWithoutGuildInput = {
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
  }

  export type GuildCurrencyUncheckedUpdateWithoutGuildInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
  }

  export type GuildCurrencyUncheckedUpdateManyWithoutGuildInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
  }

  export type GuildRemovalReasonUpdateWithoutGuildInput = {
    reason?: StringFieldUpdateOperationsInput | string
  }

  export type GuildRemovalReasonUncheckedUpdateWithoutGuildInput = {
    id?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
  }

  export type GuildRemovalReasonUncheckedUpdateManyWithoutGuildInput = {
    id?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
  }

  export type GuildRoleUpdateWithoutGuildInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type GuildRoleUncheckedUpdateWithoutGuildInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type GuildRoleUncheckedUpdateManyWithoutGuildInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}