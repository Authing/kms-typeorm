import { ColumnOptions, Column } from "typeorm"

export interface EncryptedColumnOptions extends ColumnOptions {
  toEncrypt?: boolean
}

export const KMSEncryptedColumn = (options?: EncryptedColumnOptions) => {
  options = options || {}
  options.toEncrypt = true
  return Column(options)
}
