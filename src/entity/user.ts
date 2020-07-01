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

  @AfterLoad()
  async afterLoad() {
    let tasks = Object.keys(this).map(async (key) => {
      if (typeof this[key] === "string") {
        const { plaintext, messageHeader } = await kmsDecrypt(this[key])
        this[key] = plaintext.toString()
      }
    })
    await Promise.all(tasks)
    console.log("AfterLoad: ", this)
  }

  // https://typeorm.io/#/listeners-and-subscribers
  @BeforeInsert()
  async beforeInsert() {
    console.log("BeforeInsert: ", this)

    let tasks = Object.keys(this).map(async (key) => {
      if (typeof this[key] === "string") {
        const { result, messageHeader } = await kmsEncrypt(this[key])
        this[key] = result.toString("base64")
      }
    })
    await Promise.all(tasks)
  }

  @AfterInsert()
  afterInsert() {
    console.log("AfterInsert: ", this)
  }

  @BeforeUpdate()
  beforeUpdate() {
    console.log("BeforeUpdate: ", this)
  }

  @AfterUpdate()
  afterUpdate() {
    console.log("AfterUpdate: ", this)
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
