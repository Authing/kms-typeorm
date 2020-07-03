import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  ObjectLiteral,
  UpdateEvent,
} from "typeorm"
import { decrypt, encrypt } from "../kms"

@EventSubscriber()
export class KMSSubscriber implements EntitySubscriberInterface {
  async beforeInsert(event: InsertEvent<ObjectLiteral>) {
    await encrypt(event.entity)
  }

  async afterInsert(event: InsertEvent<ObjectLiteral>) {
    await decrypt(event.entity)
  }

  async beforeUpdate(event: UpdateEvent<ObjectLiteral>) {
    const updatedColumns = event.updatedColumns.map(
      ({ propertyName }) => propertyName
    )
    await encrypt(event.entity, updatedColumns)
  }

  async afterUpdate(event: UpdateEvent<ObjectLiteral>) {
    const updatedColumns = event.updatedColumns.map(
      ({ propertyName }) => propertyName
    )
    await decrypt(event.entity, updatedColumns)
  }

  async afterLoad(entity: ObjectLiteral) {
    await decrypt(entity)
  }
}
