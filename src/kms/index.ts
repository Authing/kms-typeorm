import { getMetadataArgsStorage, ObjectLiteral } from "typeorm"
import { EncryptedColumnOptions } from "../decorators"
import * as awsKms from "./aws"
import * as aliyunKms from "./aliyun"
import { config, KMSProvider } from "../config/index"

const provider = config.kms.type

const kmsEncrypt = async (text: string) => {
  if (provider === KMSProvider.aws) {
    return await awsKms.kmsEncrypt(text)
  } else if (provider === KMSProvider.aliyun) {
    return await aliyunKms.kmsEncrypt(text)
  }
  return text
}

const kmsDecrypt = async (encrypted: string) => {
  if (provider === KMSProvider.aws) {
    return await awsKms.kmsDecrypt(encrypted)
  } else if (provider === KMSProvider.aliyun) {
    return await aliyunKms.kmsDecrypt(encrypted)
  }
  return encrypted
}

/**
 * For all columns that have encryption options run the supplied function.
 *
 * @param entity The typeorm Entity.
 * @param includeProperties filter encrypted properties by propertyName
 */
const getMatchedColumns = (
  entity: ObjectLiteral,
  includeProperties: string[] = []
) => {
  // Iterate through all columns in Typeorm
  let validColumns = getMetadataArgsStorage()
    .columns.filter(({ options, mode, target, propertyName }) => {
      const { toEncrypt } = options as EncryptedColumnOptions
      return (
        entity[propertyName] &&
        mode === "regular" &&
        typeof entity[propertyName] === "string" &&
        toEncrypt
      )
    })
    // dedup
    .filter(
      (item, pos, self) =>
        self.findIndex((v) => v.propertyName === item.propertyName) === pos
    )

  // encrypt only the requested properties (property changes on update)
  if (includeProperties.length > 0) {
    validColumns = validColumns.filter(({ propertyName }) =>
      includeProperties.includes(propertyName)
    )
  }
  return validColumns
}

/**
 * Checks the supplied entity for encrypted columns and encrypts any columns that need it.
 *
 * @param entity Typeorm Entity to check.
 * @param includeProperties
 */
export const encrypt = async <T extends ObjectLiteral>(
  entity: T,
  includeProperties: string[] = []
): Promise<T> => {
  if (!entity) return entity
  const validColumns = getMatchedColumns(entity, includeProperties)
  let tasks = validColumns.map(async ({ propertyName }) => {
    ;(entity as any)[propertyName as any] = await kmsEncrypt(
      entity[propertyName]
    )
  })
  await Promise.all(tasks)
  return entity
}

/**
 * Checks the supplied entity for columns that need decrypting and decrypts them.
 *
 * @param entity The typeorm entity to check
 * @param includeProperties
 */
export const decrypt = async <T extends ObjectLiteral>(
  entity: T,
  includeProperties: string[] = []
): Promise<T> => {
  if (!entity) return entity
  const validColumns = getMatchedColumns(entity, includeProperties)
  let tasks = validColumns.map(async ({ propertyName }) => {
    ;(entity as any)[propertyName as any] = await kmsDecrypt(
      entity[propertyName]
    )
  })
  await Promise.all(tasks)
  return entity
}
