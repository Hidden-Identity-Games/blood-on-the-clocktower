// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeu50DQfW6PyWxabjhfI3WTwFPzy0drK0",
  authDomain: "blood-on-the-clocktower-roles.firebaseapp.com",
  projectId: "blood-on-the-clocktower-roles",
  storageBucket: "blood-on-the-clocktower-roles.appspot.com",
  messagingSenderId: "631934890755",
  appId: "1:631934890755:web:0a01be45e7b7c83fdeaf36",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
  DocumentReference,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Game, PlayerSet } from "./Game";
import { useSecretKey } from "./secretKey";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const gamesCollection = collection(db, "games");
const playerListCollection = collection(db, "players");
const rolesCollection = collection(db, "roles");
const availableRolesCollection = collection(db, "availableRoles");

// async function getGame(gameId: string): Promise<Game> {
//   const gameDoc = doc(db, `games/${gameId}`);
//   let gameSnapshot = await getDoc(gameDoc);
//   if (!gameSnapshot) {
//     await setDoc(gameDoc, { players: [] });
//     gameSnapshot = await getDoc(gameDoc);
//   }
//   return gameSnapshot.data() as unknown as Game;
// }

export function useDoc<DocumentType>(docToUse: DocumentReference) {
  const [data, setData] = useState<DocumentType | null>(null);
  useEffect(() => {
    const unsubscribe = onSnapshot(docToUse, (snapshot) => {
      setData(snapshot.data() as unknown as DocumentType);
    });
    return () => unsubscribe();
  }, []);
  return data;
}

export function useGame(gameId: string) {
  return useDoc<Game>(doc(gamesCollection, gameId));
}

export function usePlayers(gameId: string) {
  return useDoc<PlayerSet>(doc(playerListCollection, gameId));
}
export function useRoles(gameId: string) {
  return useDoc<Record<string, string>>(doc(rolesCollection, gameId));
}

export function useSelf(gameId: string) {
  const secretKey = useSecretKey();
  const players = usePlayers(gameId);
  const roles = useRoles(gameId);
  return {
    name: players?.[secretKey],
    role: roles?.[secretKey],
  };
}

export function useAddPlayer(gameId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const [succeeded, setSucceeded] = useState<boolean>(false);
  const secretKey = useSecretKey();

  return [
    error,
    isLoading,
    succeeded,
    async (playerName: string) => {
      setIsLoading(true);
      setError(null);
      setSucceeded(false);
      try {
        const currentDoc = await getDoc(doc(playerListCollection, gameId));
        if (Object.values(currentDoc.data() as any).includes(playerName)) {
          throw new Error("Player name taken");
        }
        await setDoc(
          doc(playerListCollection, gameId),
          { [secretKey]: playerName },
          { merge: true },
        );
        setSucceeded(true);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    },
  ] as const;
}

export function useAvailableRoles(gameId: string) {
  return useDoc<{ roles: string[] }>(doc(availableRolesCollection, gameId));
}

export function useDistributeRoles(gameId: string) {
  const players = usePlayers(gameId);
  const availableRoles = useAvailableRoles(gameId)?.roles;

  return async () => {
    if (!availableRoles || !players) {
      throw new Error("oops");
    }
    const rolesEntries = Object.keys(players);
    const randomRoleSet = availableRoles
      .map((item) => ({ item, random: Math.random() }))
      .sort((a, b) => a.random - b.random)
      .map((element) => element.item)
      .reduce(
        (acc, item, idx) => ({
          ...acc,
          [rolesEntries[idx]]: item,
        }),
        {} as Record<string, string>,
      );

    setDoc(doc(rolesCollection, gameId), randomRoleSet);
  };
}
