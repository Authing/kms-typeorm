import { UserEntity } from "./entity/user"
import { createConnection } from "typeorm"
import assert from "assert"
import { KMSSubscriber } from "./subscriber"

const testInsertLoad = async () => {
  const age = 22
  const firstName = "ethereal"
  const lastName = "liao"
  const password = "123456"
  const phone = "18888888888"

  let user = new UserEntity()
  user.age = age
  user.firstName = firstName
  user.lastName = lastName
  user.passwod = password
  user.phone = phone
  await user.save()

  let newUser = await UserEntity.findOne(user.id)
  assert((newUser.age = age))
  assert(newUser.firstName === firstName)
  assert(newUser.lastName === lastName)
  assert(newUser.passwod === password)
  assert(newUser.phone === phone)

  return newUser
}

const testUpdate = async (user: UserEntity) => {
  const newPassword = "123456!"
  user.passwod = newPassword
  user = await user.save()
  assert(user.passwod === newPassword)
}

createConnection()
  .then(async (connection) => {
    const user = await testInsertLoad()
    await testUpdate(user)
    console.info("All Test Cases Passed!")
  })
  .catch(console.error)
