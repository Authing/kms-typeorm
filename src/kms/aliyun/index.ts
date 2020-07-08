import { config } from "../../config/index"
import axios from "axios"
import crypto from "crypto"
import { decrypt } from ".."

const { keyId, accessKeyId, accessKeySecret, region } = config.kms.aliyun

const getBaseParams = () => {
  const date = new Date()
  return {
    Format: "JSON",
    Version: "2016-01-20",
    AccessKeyId: accessKeyId,
    SignatureMethod: "HMAC-SHA1",
    Timestamp: date.toISOString().replace(/\.\d{3}/, ""),
    SignatureVersion: "1.0",
  }
}

const HmacSHA1 = (str: string, key: string) => {
  let hmac = crypto.createHmac("sha1", key)
  hmac.update(str)
  return hmac.digest("base64")
}

const paramsParser = (params: any, isEncode = false) => {
  let result = []
  for (let key in params) {
    // 格式化非字符串值为字符串
    // 复杂参数必要操作 否则引起由数据类型转义造成的错误
    let value =
      typeof params[key] === "string"
        ? params[key]
        : JSON.stringify(params[key])

    isEncode
      ? result.push(
          [encodeURIComponent(key), encodeURIComponent(value)].join("=")
        )
      : result.push([key, value].join("="))
  }
  return result.join("&")
}

const sign = (params: any) => {
  let tmp: any = {}
  Object.keys(params)
    .sort()
    .forEach((key) => {
      tmp[key] = params[key]
    })
  let signString = [
    "GET",
    encodeURIComponent("/"),
    encodeURIComponent(paramsParser(tmp, true)),
  ].join("&")
  let signature = HmacSHA1(signString, accessKeySecret + "&")
  tmp.Signature = encodeURIComponent(signature)
  return paramsParser(tmp)
}

export const kmsEncrypt = async (text: string) => {
  console.log("To Encrypt: ", text)
  const url = `https://kms.${region}.aliyuncs.com`
  const params = Object.assign(getBaseParams(), {
    Action: "Encrypt",
    KeyId: keyId,
    Plaintext: text,
  })
  try {
    const res = await axios.get([url, sign(params)].join("?"))
    const { CiphertextBlob } = res.data
    console.log("Encrypted: ", CiphertextBlob)
    return CiphertextBlob
  } catch (error) {
    console.log("Encrypt Error：", error.response.data)
    return text
  }
}

export const kmsDecrypt = async (encrypted: string) => {
  console.log("To Decrypt: ", encrypted)
  const url = `https://kms.${region}.aliyuncs.com`
  const params = Object.assign(getBaseParams(), {
    Action: "Decrypt",
    CiphertextBlob: encrypted,
  })
  try {
    const res = await axios.get([url, sign(params)].join("?"))
    const { Plaintext } = res.data
    console.log("Decrypted: ", Plaintext)
    return Plaintext
  } catch (error) {
    console.log("Decrypt Error：", error.response.data)
    return encrypted
  }
}
