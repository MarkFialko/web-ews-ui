export interface AppConfig {
  SBER_ESM_URL: string;
  CTI_URL: string;
}

const CONFIG_PATH = "web-ews-ui/config.json";

export const getConfig = async (): Promise<AppConfig | null> => {
  try {
    const config = await (
      await fetch(`${document.location.origin}/${CONFIG_PATH}`)
    ).json();
    return config as AppConfig;
  } catch {
    return null;
  }
};
