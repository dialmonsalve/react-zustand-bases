import { type StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// import { customSessionStorage } from "../storages/session.storage";
import { firebaseStorage } from "../storages/firebase-storage.storage";

interface PersonState {
  firstName: string;
  lastName: string;
}

interface Actions {
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}

const storeApi: StateCreator<
  PersonState & Actions,
  [["zustand/devtools", unknown]]
> = (set) => ({
  firstName: "",
  lastName: "",
  setFirstName: (value) =>
    set(({ firstName: value }), false, "setFirstName"),
  setLastName: (value) =>
    set(({ lastName: value }), false, "setLastName"),
});

export const usePersonStore = create<PersonState & Actions>()(
  devtools(
    persist(storeApi, {
      name: "person-storage",
      storage: firebaseStorage,
    })
  )
);
