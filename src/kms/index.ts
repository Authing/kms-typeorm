import * as AWS from "aws-sdk"
import {
  KmsKeyringNode,
  encrypt as awsCryptoEncrypt,
  decrypt as awsCryptoDecrypt,
  getClient,
} from "@aws-crypto/client-node"
import { config } from "./../config/index"
import { getMetadataArgsStorage, ObjectLiteral } from "typeorm"
import { EncryptedColumnOptions } from "../decorators"

const kmsConfig = config.kms.aws
const keyId = kmsConfig.keyId
const awsClient = getClient(AWS.KMS, {
  region: kmsConfig.region,
  credentials: {
    accessKeyId: kmsConfig.accessKeyId,
    secretAccessKey: kmsConfig.secretAccessKey,
  },
})
const keyring = new KmsKeyringNode({
  generatorKeyId: keyId,
  clientProvider: awsClient,
})

export const kmsEncrypt = async (text: string) => {
  console.log("To Encrypt: ", text)
  const { messageHeader, result } = await awsCryptoEncrypt(keyring, text)
  console.log("Encrypted: ", result.toString("base64"))
  return result.toString("base64")
}

export const kmsDecrypt = async (encrypted: string) => {
  console.log("To Decrypt: ", encrypted)
  const { messageHeader, plaintext } = await awsCryptoDecrypt(
    keyring,
    new Buffer(encrypted, "base64")
  )
  console.log("Decrypted: ", plaintext.toString())
  return plaintext.toString()
}

/**
 * For all columns that have encryption options run the supplied function.
 *
 * @param entity The typeorm Entity.
 * @param cb Function to run for matching columns.
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
