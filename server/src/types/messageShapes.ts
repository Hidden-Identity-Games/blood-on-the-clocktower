import { type Script, type UnifiedGame } from './types.ts'

export interface ListenToGameMessage {
  type: 'ListenToGame'
  gameId: string
}
export type MessageFromClient = ListenToGameMessage

export type ObjectType = keyof ObjectShapeMap
export interface ObjectShapeMap {
  game: UnifiedGame
  script: Script
}

export interface ObjectUpdatedMessageGeneric<ObjectType extends keyof ObjectShapeMap> {
  type: 'ObjectUpdated'
  objectType: ObjectType
  updatedId: string
  nextObj: ObjectShapeMap[ObjectType] | null
}

// map over each type in the union and generate a type
export type MessageFromServer = { [K in keyof ObjectShapeMap]: ObjectUpdatedMessageGeneric<K> }[keyof ObjectShapeMap]
