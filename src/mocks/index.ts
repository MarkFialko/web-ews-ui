/** Включает MSW в браузере, только пока приложение собрано в dev-режиме
 * и явно включён VITE_USE_MOCKS=true (см. .env.example / README). */
export async function enableMocking(): Promise<void> {
  if (!import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS !== "true") {
    return;
  }

  const { worker } = await import("./browser");

  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: `${import.meta.env.BASE_URL.replace(/\/$/, "")}/mockServiceWorker.js`,
    },
  });
}
