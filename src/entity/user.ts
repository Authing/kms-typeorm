import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import { KMSEncryptedColumn } from "../decorators"

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
