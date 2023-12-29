import { toKeys } from "@hidden-identity/shared";

import {
  type BaseAction,
  isInitAction,
  type TopLevelReducer,
} from "./reduxImplementation.ts";

export type ReducerMap<StateShape, ActionType extends BaseAction<string>> = {
  [ReducerName in keyof StateShape]: ComposedReducer<
    StateShape[ReducerName],
    ActionType,
    StateShape
  >;
};
export type ComposedReducer<
  LocalStateShape,
  ActionType extends BaseAction<string>,
  WholeStateShape,
> = (
  state: LocalStateShape | undefined,
  action: ActionType,
  // This is a lie, as discriminated unions don't dicriminate with multiple variables
  // So typescript won't know the shape based on checks of action.
  // figure out a better pattern to fix this.
  wholePreviousState: WholeStateShape,
) => LocalStateShape;

export function combineReducers<
  StateShape,
  ActionType extends BaseAction<string>,
>(
  reducerMap: ReducerMap<StateShape, ActionType>,
): TopLevelReducer<StateShape, ActionType> {
  return (state, action) => {
    return Object.fromEntries(
      toKeys<keyof StateShape>(reducerMap).map((reducerKey) => {
        const reducer = reducerMap[reducerKey];

        if (isInitAction(action)) {
          return [
            reducerKey,
            reducer(undefined, action, undefined as StateShape),
          ];
        }
        return [
          reducerKey,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          reducer(state![reducerKey], action, state!),
        ] as [keyof StateShape, StateShape[keyof StateShape]];
      }),
    ) as StateShape;
  };
}
