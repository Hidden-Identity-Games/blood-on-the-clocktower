import { useGame } from "../store/GameContext";
import { LoadingExperience } from "../shared/LoadingExperience";
import { useGMSecretHash } from "../store/url";

export interface GMProtectedRouteProps {
  children: React.ReactNode;
}

export function GMProtectedRoute({ children }: GMProtectedRouteProps) {
  const gmSecretHash = useGMSecretHash();
  const { game } = useGame();
  if (!game) {
    return <LoadingExperience children={undefined} />;
  }

  if (!gmSecretHash || gmSecretHash !== game.gmSecretHash) {
    return <div>You seem to be in the wrong place.</div>;
  }

  return children;
}
