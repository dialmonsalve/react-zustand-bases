import { StateStorage, createJSONStorage } from "zustand/middleware";

const firebaseUrl = `https://zustand-storage-4aa54-default-rtdb.firebaseio.com/zustand`;

const storageApi: StateStorage = {
  getItem: async function (name: string): Promise<string | null> {
    try {
      const data = await fetch(`${firebaseUrl}/${name}.json`).then((res) =>
        res.json()
      );
      return JSON.stringify(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  setItem: async function (name: string, value: string): Promise<void> {
    const data = await fetch(`${firebaseUrl}/${name}.json`, {
      method: "PUT",
      body: value,
    }).then((res) => res.json());

    return data;
  },
  removeItem: function (name: string): void | Promise<void> {
    console.log(name);
  },
};

export const firebaseStorage = createJSONStorage(() => storageApi);
