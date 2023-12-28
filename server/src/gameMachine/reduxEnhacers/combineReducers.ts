import { toKeys } from "@hidden-identity/shared";
import { type Action, type Reducer } from "@reduxjs/toolkit";

export type ReducerMap<StateShape, ActionType> = {
  [ReducerName in keyof StateShape]: (
    state: StateShape[ReducerName] | undefined,
    action: ActionType,
    wholePreviousState: StateShape,
  ) => StateShape[ReducerName];
};

export function combineReducers<StateShape, ActionType extends Action<string>>(
  reducerMap: ReducerMap<StateShape, ActionType>,
): Reducer<StateShape, ActionType> {
  return (state, action) => {
    return Object.fromEntries(
      toKeys<keyof StateShape>(reducerMap).map((reducerKey) => {
        const reducer = reducerMap[reducerKey];
        return [
          reducerKey,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          reducer(state?.[reducerKey] ?? undefined, action, state!),
        ] as [keyof StateShape, StateShape[keyof StateShape]];
      }),
    ) as StateShape;
  };
}
