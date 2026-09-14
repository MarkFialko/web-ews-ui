import type { CommandPaletteToolLauncher } from "@app/command-palette";
import { callToolLauncher } from "@modules/call";
import { chatToolLauncher } from "@modules/chat";
import { knowledgeBaseToolLauncher } from "@modules/knowledge-base";
import { localSupportToolLauncher } from "@modules/local-support";
import { protocolToolLauncher } from "@modules/protocol";
// import { relatedRequestsToolLauncher } from "@modules/related-requests";
import { ticketActionsToolLauncher } from "@modules/ticket-actions";
import type { Communication } from "@shared/routing";

export const TICKET_TOOL_LAUNCHERS = [
    chatToolLauncher,
    callToolLauncher,
    protocolToolLauncher,
    ticketActionsToolLauncher,
    localSupportToolLauncher,
    //relatedRequestsToolLauncher,
    knowledgeBaseToolLauncher,
]satisfies readonly CommandPaletteToolLauncher<Communication>[];