import * as AWS from "aws-sdk"
import {
  KmsKeyringNode,
  encrypt as awsCryptoEncrypt,
  decrypt as awsCryptoDecrypt,
  getClient,
} from "@aws-crypto/client-node"
import { config } from "../../config/index"

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