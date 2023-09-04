import { type UnifiedGame } from './types.ts'

export interface ListenToGameMessage {
  type: 'ListenToGame'
  gameId: string
}
export type MessageFromClient = ListenToGameMessage

export type ObjectType = 'game'
export interface ObjectShapeMap {
  game: UnifiedGame
}

export interface ObjectUpdatedMessage<ObjectType extends keyof ObjectShapeMap> {
  type: 'ObjectUpdated'
  objectType: ObjectType
  updatedId: string
  nextObj: ObjectShapeMap[ObjectType] | null
}

export type MessageFromServer = ObjectUpdatedMessage<keyof ObjectShapeMap>
