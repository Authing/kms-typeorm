# KMS Plugin for TypeORM

有关如何本地开发的引导请见：[Developement.md](./Developement.md)

## Why ?

KMS 全称为 Key Management Service, 中文直译过来为密钥管理服务。KMS 可以在技术层上完全确保数据的安全性。[Authing](https://authing.cn) 作为一款托管了众多开发者用户核心数据的产品，数据安全至关重要，我们一直在实践使用 KMS 来保证用户数据的安全性。

此开源项目旨在将 KMS 与 Node.JS 中使用最广泛的 ORM 结合起来，让 KMS 的使用成本变得更低，做到简单的配置即可开箱即用。

## Usage

```typescript
import { Entity, PrimaryGeneratedColumn, Column, createConnection } from 'typeorm'
import { KMSEncryptedColumn, KMSSubscriber } from "kms-typeorm"

@Entity("users")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  age: number

  @KMSEncryptedColumn()
  passwod: string

  @KMSEncryptedColumn()
  phone: string
}

let connection = createConnection({
  ...
  entities: [UserEntity],
  subscribers: [KMSSubscriber]
})
```

## 规划

我们会支持目前市场上使用最广泛的 4 家 KMS 服务商：

- [x] [AWS KMS](https://aws.amazon.com/kms/)
- [x] [阿里云 KMS](https://www.aliyun.com/product/kms)
- [ ] [腾讯云 KMS](https://cloud.tencent.com/product/kms)
- [ ] [Google Cloud KMS](https://cloud.google.com/kms)

同时会对以下三种主流数据库做好兼容性测试：

- [x] PostgreSQL
- [ ] MySQL
- [ ] MongoDB

同时会做好性能测试，尽量减少由于 KMS 带来的性能损失。

## 相关阅读

- [AWS KMS 科普: What Why and How?](https://mp.weixin.qq.com/s/71MDGwJXXBQRJ5kzCGnoTQ)
- [被脱库咋办？KMS 给你解决方案！](https://mp.weixin.qq.com/s/-N1zScH47U7LQE8F95Ad1w)
