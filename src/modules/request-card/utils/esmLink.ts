const ESM_LINK_MAP = {
  SRT: "znr",
  SR: "zno",
  INCT: "zpi",
  INC: "incident",
} as const;

const CONFIG_PATH = "/web-ews-ui/config.json";

let cachedStendUrl: string | null = null;

const getEsmStendUrl = async (): Promise<string> => {
  if (cachedStendUrl) return cachedStendUrl;

  try {
    const config = await (
      await fetch(`${document.location.origin}${CONFIG_PATH}`)
    ).json();
    cachedStendUrl = config.SBER_ESM_URL ?? "";
    return cachedStendUrl;
  } catch {
    return "";
  }
};

const getEsmBasePath = (businessId: string): string => {
  const upperId = businessId.toUpperCase();

  for (const [prefix, path] of Object.entries(ESM_LINK_MAP)) {
    if (upperId.startsWith(prefix)) return path;
  }

  return "incident";
};

export const buildEsmLink = async (businessId: string): Promise<string> => {
  const stendUrl = await getEsmStendUrl();
  const basePath = getEsmBasePath(businessId);
  return `${stendUrl}/efs-ermops-static/app-ops_esm/${basePath}?businessId=${businessId}`;
};
