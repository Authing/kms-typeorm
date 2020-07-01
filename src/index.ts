import { UserEntity } from "./entity/user"
import { createConnection } from "typeorm"

const test1 = async () => {
  let user = new UserEntity()
  user.age = 21
  user.firstName = "廖"
  user.lastName = "长江"
  user.passwod = "123456"
  await user.save() // AfterInsert

  user.age = 22 // AfterLoad
  await user.save() // BeforeUpdate -> AfterUpdate
  await user.remove()
}

const test2 = async () => {
  let user = new UserEntity()
  user.age = 21
  user.firstName = "廖"
  user.lastName = "长江"
  user.passwod = "123456"
  await user.save() // AfterInsert

  let newUser = await UserEntity.findOne(user.id)
  console.log(newUser)
}

createConnection()
  .then(async (connection) => {
    // await test1()
    await test2()
  })
  .catch(console.error)
