import { UserEntity } from "./entity/user"
import { createConnection } from "typeorm"
import assert from "assert"

const testInsertLoad = async () => {
  const age = 22
  const firstName = "ethereal"
  const lastName = "liao"
  const password = "123456"

  let user = new UserEntity()
  user.age = age
  user.firstName = firstName
  user.lastName = lastName
  user.passwod = password
  await user.save()

  let newUser = await UserEntity.findOne(user.id)
  assert((newUser.age = age))
  assert(newUser.firstName === firstName)
  assert(newUser.lastName === lastName)
  assert(newUser.passwod === password)
}

createConnection()
  .then(async (connection) => {
    // await test1()
    await testInsertLoad()
  })
  .catch(console.error)
