export const getEsmLink = async (businessId: string) => {
  let stendUrl = "";
  try {
    const config = await (
      await fetch(`${document.location.origin}/web-ews-ui/config.json`)
    ).json();
    stendUrl = config.SBER_ESM_URL;
  } catch {
    //
  }

  let baseLink = `${stendUrl}/efs-ermops-static/app-ops_esm/`;

  const upperBusinessId = businessId.toUpperCase();

  if (upperBusinessId.startsWith("SRT")) {
    baseLink += "znr";
  } else if (upperBusinessId.startsWith("SR")) {
    baseLink += "zno";
  } else if (upperBusinessId.startsWith("INCT")) {
    baseLink += "zpi";
  } else if (upperBusinessId.startsWith("INC")) {
    baseLink += "incident";
  }

  return `${baseLink}?businessId=${businessId}`;
};
