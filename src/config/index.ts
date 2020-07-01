import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

export interface AWS_CONFIG {
  accessKeyId: string,
  secretAccessKey: string,
  region: string,
  keyId: string
}

export interface ALIYUN_CONFIG { }
export interface TECENT_CLOUD_CONFIG { }
export interface Config {
  kms: {
    aws: AWS_CONFIG,
    aliyun: ALIYUN_CONFIG,
    tecent_cloud: TECENT_CLOUD_CONFIG
  }
}

export const config: Config = yaml.parse(fs.readFileSync(path.resolve(__dirname, '../../config.yaml'), 'utf8'))
