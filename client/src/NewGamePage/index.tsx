import { useCreateGame } from "../store/useStore";

export function NewGameLanding() {
  const [error, isLoading, , action] = useCreateGame();

  return (
    <div>
      {error && <div>error</div>}
      {!isLoading ? (
        <button onClick={action}>Create Game</button>
      ) : (
        <div>Creating Game please wait</div>
      )}
    </div>
  );
}
