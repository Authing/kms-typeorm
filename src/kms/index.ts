import * as AWS from "aws-sdk"
import {
  KmsKeyringNode,
  encrypt,
  decrypt,
  getClient,
} from "@aws-crypto/client-node"
import { config } from "./../config/index"

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
  return await encrypt(keyring, text)
}

export const kmsDecrypt = async (encrypted: string) => {
  return await decrypt(keyring, new Buffer(encrypted, "base64"))
}
