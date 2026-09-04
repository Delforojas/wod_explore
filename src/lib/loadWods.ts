import wodsData from '../data/wods.json'
import { wodsSchema } from '../schemas/wod.schema'

export function parseWods(input: unknown) {
  return wodsSchema.safeParse(input)
}

export function loadWods() {
  return parseWods(wodsData)
}
