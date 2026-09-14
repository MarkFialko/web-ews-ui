import { http, HttpResponse } from "msw";
import { hashtagsMock } from "../data/dictionary";

/**
 * Мок для web-ews-middle/compendium/tags, контракты см. в
 * @shared/queries/dictionaryApi. Ручки close-codes/late-reasons/inc-reason
 * общие с @modules/ticket-actions — см. ticketActionsHandlers.
 */
export const dictionaryHandlers = [
  http.get("*/web-ews-middle/compendium/tags", () => {
    return HttpResponse.json(hashtagsMock);
  }),
];
