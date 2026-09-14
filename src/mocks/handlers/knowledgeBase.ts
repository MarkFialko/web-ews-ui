import { http, HttpResponse } from "msw";
import { articleMock, recommendationsMock } from "../data/knowledgeBase";

/** Моки для web-ews-middle/{v2/knowledge,knowledge}/*, контракты см. в @modules/knowledge-base/api/knowledgeBaseApi. */
export const knowledgeBaseHandlers = [
  http.get("*/web-ews-middle/v2/knowledge/recommendations/:businessId", () => {
    return HttpResponse.json(recommendationsMock);
  }),
  http.get("*/web-ews-middle/knowledge/full-article/:shId", () => {
    return HttpResponse.json(articleMock);
  }),
];
