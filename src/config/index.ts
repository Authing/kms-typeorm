import * as yaml from "yaml"
import * as fs from "fs"
import * as path from "path"

export interface AWS_CONFIG {
  accessKeyId: string
  secretAccessKey: string
  region: string
  keyId: string
}

export interface ALIYUN_CONFIG {
  accessKeyId: string
  accessKeySecret: string
  region: string
  keyId: string
}
export interface TECENT_CLOUD_CONFIG {}

export interface GOOGLE_CLOUD_CONFIG {}

export enum KMSProvider {
  aliyun = "aliyun",
  aws = "aws",
  tencent_cloud = "tencent_cloud",
  google_cloud = "google_cloud",
}

export interface Config {
  kms: {
    type: KMSProvider
    aws: AWS_CONFIG
    aliyun: ALIYUN_CONFIG
    tecent_cloud: TECENT_CLOUD_CONFIG
    google_cloud: GOOGLE_CLOUD_CONFIG
  }
}

export const config: Config = yaml.parse(
  fs.readFileSync(path.resolve(__dirname, "../../config.yaml"), "utf8")
)
