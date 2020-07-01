import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  AfterInsert,
  BeforeUpdate,
  AfterUpdate,
  BeforeRemove,
  AfterRemove,
  AfterLoad,
} from "typeorm"
import { kmsEncrypt, kmsDecrypt } from "../kms"

export const kmsEncryptObject = async (obj: any) => {
  let tasks = Object.keys(obj).map(async (key) => {
    if (typeof obj[key] === "string") {
      const { result, messageHeader } = await kmsEncrypt(obj[key])
      obj[key] = result.toString("base64")
    }
  })
  await Promise.all(tasks)
}

export const kmsDecryptObject = async (obj: any) => {
  let tasks = Object.keys(obj).map(async (key) => {
    if (typeof obj[key] === "string") {
      const { plaintext, messageHeader } = await kmsDecrypt(obj[key])
      obj[key] = plaintext.toString()
    }
  })
  await Promise.all(tasks)
}

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

  @Column()
  passwod: string

  // https://typeorm.io/#/listeners-and-subscribers
  @AfterLoad()
  async afterLoad() {
    await kmsDecryptObject(this)
  }

  @BeforeInsert()
  async beforeInsert() {
    await kmsEncryptObject(this)
  }

  @AfterInsert()
  afterInsert() {
  }

  @BeforeUpdate()
  async beforeUpdate() {
    await kmsEncryptObject(this)
  }

  @AfterUpdate()
  async afterUpdate() {
    await kmsDecryptObject(this)
  }

  @BeforeRemove()
  beforeRemove() {
    console.log("AfterUpdate: ", this)
  }

  @AfterRemove()
  afterRemove() {
    console.log("AfterRemove: ", this)
  }
}
