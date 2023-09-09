import { useCreateGame } from "../store/useStore";

export function NewGameLanding() {
  const [error, isLoading, , createGame] = useCreateGame();

  return (
    <div>
      {error && <div>error</div>}
      {!isLoading ? (
        <button onClick={() => createGame()}>Create Game</button>
      ) : (
        <div>Creating Game please wait</div>
      )}
    </div>
  );
}
