import type { User } from './User.js'

export type Review = {
  +_id: String,
  +store: String,
  +text: String,
  +rating: number,
  +created: String,
  +author: User
}
