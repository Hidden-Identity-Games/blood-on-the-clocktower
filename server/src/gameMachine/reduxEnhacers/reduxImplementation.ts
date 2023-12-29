export interface BaseAction<T extends string> {
  type: T;
}

export const INIT_ACTION: InitAction = { type: "@@INIT" };
export interface InitAction {
  type: "@@INIT";
}

export function isInitAction(action: any): action is InitAction {
  return action?.type === "@@INIT";
}

export interface Store<StateShape, ActionType> {
  getState: () => StateShape;
  dispatch: Dispatch<StateShape, ActionType>;
  subscribe: (cb: () => void) => () => void;
  undo: () => boolean;
  canUndo: () => boolean;
}

export type TopLevelReducer<
  StateShape,
  ActionType extends BaseAction<string>,
> = (state: StateShape | undefined, action: ActionType) => StateShape;

export interface Dispatch<StateShape, ActionType> {
  <ThisAction extends ActionType>(action: ActionType): ThisAction;
  <ReturnType>(thunk: Thunk<ReturnType, StateShape, ActionType>): ReturnType;
}
export type Thunk<ReturnType, StateShape, ActionType> = (
  dispatch: Dispatch<StateShape, ActionType>,
  getState: () => StateShape,
) => ReturnType;

export function createStore<StateShape, ActionType extends BaseAction<string>>(
  reducer: TopLevelReducer<StateShape, ActionType | InitAction>,
  preloadState?: StateShape,
) {
  const initialState = preloadState ?? reducer(undefined, INIT_ACTION);

  let history: StateShape[] = [];
  let state = initialState;
  let subscriptions: Array<() => void> = [];
  const canUndo = () => {
    return history.length > 0;
  };
  const getState = () => state;
  const notify = () => {
    subscriptions.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error(e);
      }
    });
  };
  const dispatch: Dispatch<StateShape, ActionType> = function <ReturnType>(
    dispatchable: ActionType | Thunk<ReturnType, StateShape, ActionType>,
  ) {
    history = [state, ...history];
    if (typeof dispatchable === "function") {
      return dispatchable(dispatch, getState);
    }

    state = reducer(state, dispatchable);
    notify();
    return dispatchable;
  };

  return {
    getState,
    dispatch,
    subscribe: (callback: () => void) => {
      subscriptions = [...subscriptions, callback];
      return () =>
        (subscriptions = subscriptions.filter((s) => s === callback));
    },
    canUndo,
    undo() {
      if (canUndo()) {
        [state, ...history] = history;
        notify();
        return true;
      }
      return false;
    },
  };
}
