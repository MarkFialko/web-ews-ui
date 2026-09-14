import { useSyncExternalStore } from "react";

type BumpStore = {
  ids: Set<string>;
  version: number;
};

const store: BumpStore = {
  ids: new Set<string>(),
  version: 0,
};

const listeners: Set<() => void> = new Set();

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
};

const notify = () => {
  store.version++;
  for (const listener of listeners) {
    listener();
  }
};

const bumpToTop = (ids: string[]) => {
  for (const id of ids) {
    store.ids.delete(id);
    store.ids.add(id);
  }
  store.ids = new Set(store.ids);
  notify();
};

const clearBump = (ids?: string[]) => {
  if (ids) {
    const next = new Set(store.ids);
    for (const id of ids) next.delete(id);
    store.ids = next;
  } else {
    store.ids = new Set();
  }
  notify();
};

export function useTriageBumpProvider() {
  const bumpIds = useSyncExternalStore(
    subscribe,
    () => store.ids,
    () => new Set(),
  );

  return {
    bumpIds,
    bumpToTop,
    clearBump,
  };
}
