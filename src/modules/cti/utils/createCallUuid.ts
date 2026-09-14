export function createCallUuid() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `call-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}
