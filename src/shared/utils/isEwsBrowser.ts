const EWS_BROWSER_USER_AGENT = "EwsBrowser";

export const getIsEWSBrowser = () =>
  navigator.userAgent.includes(EWS_BROWSER_USER_AGENT);
