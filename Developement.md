## 开发者指引

### 如何运行此项目

1. 配置 KMS 配置文件：将 config.yaml.template 复制一份到 config.yaml

```
cp config.yaml.template config.yaml
```

将 KMS 密钥等相关数据填写为自己的。

2. 配置数据库配置文件：将 ormconfig.json.template 复制一份到 ormconfig.json

```
cp ormconfig.json.template ormconfig.json
```

3. 运行项目：
```
yarn
npx ts-node ./src/index.ts
```
