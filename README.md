# KMS Plugin for TypeORM

有关如何本地开发的引导请见：[Developement.md](./Developement.md)

## API (Draft)

- 设置 KMS Provider

```typescript
import { KMSTypeORM } from "kms-typeorm"

KMSTypeORM.initProvider('AWS', {
	region: "",
	credentials: {
		accessKeyId: "",
		secretAccessKey: ""
	}
})
```

- 注册 Entity

```typescript
import { KMSTypeORM } from "kms-typeorm"

// 指定目录文件
KMSTypeORM.register({
	path: "src/entity/**/*.entity.ts"
})

// 指定特定的 Entity
KMSTypeORM.register({
	entities: [
		UserEntity,
		TransactionEntity
	]
})
```

- 指定哪些字段需要加密

```typescript
import { KMSEncryptFields } from "kms-typeorm"

@Entity("users")
@KMSEncryptFields(['__all__']) // 加密全部字段（除了 ID）
@KMSEncryptFields(['firstName', 'lastName', 'password']) // 指定需要加密的字段列表
@KMSEncryptFields({
	excludes: ['age'], // 指定不需要加密的字段列表
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  age: number

  @Column()
  passwod: string
}
```

## Why ?

KMS 全称为 Key Management Service, 中文直译过来为密钥管理服务。KMS 可以在技术层上完全确保数据的安全性。[Authing](https://authing.cn) 作为一款托管了众多开发者用户核心数据的产品，数据安全至关重要，我们一直在实践使用 KMS 来保证用户数据的安全性。

此开源项目旨在将 KMS 与 Node.JS 中使用最广泛的 ORM 结合起来，让 KMS 的使用成本变得更低，做到简单的配置即可开箱即用。

## 规划

我们会支持目前市场上使用最广泛的 4 家 KMS 服务商：

1. [AWS KMS](https://aws.amazon.com/kms/)
2. [阿里云 KMS](https://www.aliyun.com/product/kms)
3. [腾讯云 KMS](https://cloud.tencent.com/product/kms)
4. [Google Cloud KMS](https://cloud.google.com/kms)

同时会支持以下三种主流数据库：

1. PostgreSQL
2. MySQL
3. MongoDB

## 相关阅读 
- [AWS KMS 科普: What Why and How?](https://mp.weixin.qq.com/s/71MDGwJXXBQRJ5kzCGnoTQ)
- [被脱库咋办？KMS 给你解决方案！](https://mp.weixin.qq.com/s/-N1zScH47U7LQE8F95Ad1w)

