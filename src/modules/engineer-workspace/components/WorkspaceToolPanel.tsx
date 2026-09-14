import { type CallPanelDraftState, CallModule } from "@modules/call";
import { ChatModule } from "@modules/chat";
import { KnowledgeBaseToolPanel } from "@modules/knowledge-base";
import { LocalSupportToolPanel } from "@modules/local-support";
import { ProtocolToolPanel } from "@modules/protocol";
import { RelatedRequestsToolPanel } from "@modules/related-requests";
import { useOptimisticTaskCache } from "@modules/request-card";
import { TicketActionsPanel } from "@modules/ticket-actions";
import { type DevErrorSimulationState, ModuleDevGate } from "@shared/dev";
import type { EngineerRequestStatus } from "@modules/engineer-requests/types/EngineerRequest";
import type { TicketActionEntityType } from "@shared/request";
import type { Communication } from "@shared/routing";

type TicketActionState = {
  status: EngineerRequestStatus;
  entityType: TicketActionEntityType;
  object: string;
  group: string;
  assignee: string;
  resolution: string;
};

// TODO: судя по использованию ниже (requestWorkspaceState?.localSupportDraft),
// у этого типа должно быть больше полей, чем попало в кадр — как минимум
// localSupportDraft. Нужны ещё фото начала файла, чтобы дописать точно.
type RequestWorkspaceState = {
  ticketActionState: TicketActionState;
};

export function WorkspaceToolPanel({
  activeRequestId,
  toolId,
  onClose,
  requestWorkspaceState,
  onCreateLocalSupportEntry,
  devErrorSimulation,
  onDevErrorSimulationChange,
  onCallDraftStateChange,
  onCloseRequest,
}: {
  activeRequestId: string;
  toolId: Communication | null;
  onClose: () => void;
  requestWorkspaceState: RequestWorkspaceState;
  onCreateLocalSupportEntry: (requestId: string) => void;
  devErrorSimulation: DevErrorSimulationState;
  onDevErrorSimulationChange: (next: DevErrorSimulationState) => void;
  onCallDraftStateChange: (draftState: CallPanelDraftState) => void;
  onCloseRequest: (requestId: string) => void;
}) {
  const { taskData: request } = useOptimisticTaskCache(activeRequestId);

  if (!toolId || !request) return null;
  const resetDevError = (field: keyof DevErrorSimulationState) =>
    onDevErrorSimulationChange({
      ...devErrorSimulation,
      [field]: "none",
    });

  if (toolId === "chat") {
    return (
      <ChatModule
        resetKey={`chat:${devErrorSimulation.chat}`}
        onReload={() =>
          onDevErrorSimulationChange({
            ...devErrorSimulation,
            chat: "none",
          })
        }
        devCrash={devErrorSimulation.chat}
        request={request}
      />
    );
  }
  if (toolId === "call") {
    return (
      <CallModule
        resetKey={`call:${devErrorSimulation.call}`}
        onReload={() =>
          onDevErrorSimulationChange({
            ...devErrorSimulation,
            call: "none",
          })
        }
        devCrash={devErrorSimulation.call}
        ticketId={activeRequestId}
        onDraftStateChange={onCallDraftStateChange}
        onClose={onClose}
      />
    );
  }

  if (toolId === "protocol") {
    return (
      <ModuleDevGate
        moduleName="Протокол"
        crashLabel="ProtocolToolPanel"
        devCrash={devErrorSimulation.protocol}
        resetKey={`protocol:${devErrorSimulation.protocol}`}
        onReset={() => resetDevError("protocol")}
      >
        <ProtocolToolPanel ticketId={request?.businessId ?? activeRequestId} />
      </ModuleDevGate>
    );
  }

  if (toolId === "actions") {
    return (
      <ModuleDevGate
        moduleName="Действия"
        crashLabel="TicketActionsPanel"
        devCrash={devErrorSimulation.actions}
        resetKey={`actions:${devErrorSimulation.actions}`}
        onReset={() => resetDevError("actions")}
      >
        <TicketActionsPanel ticketId={activeRequestId} />
      </ModuleDevGate>
    );
  }

  if (toolId === "related") {
    return (
      <ModuleDevGate
        moduleName="Смежные группы"
        crashLabel="RelatedRequestsToolPanel"
        devCrash={devErrorSimulation.related}
        resetKey={`related:${devErrorSimulation.related}`}
        onReset={() => resetDevError("related")}
      >
        <RelatedRequestsToolPanel request={request} />
      </ModuleDevGate>
    );
  }

  if (toolId === "local-support") {
    return (
      <ModuleDevGate
        moduleName="Локальная поддержка"
        crashLabel="LocalSupportToolPanel"
        devCrash={devErrorSimulation.localSupport}
        resetKey={`local-support:${devErrorSimulation.localSupport}`}
        onReset={() => resetDevError("localSupport")}
      >
        <LocalSupportToolPanel
          ticketId={activeRequestId}
          draft={requestWorkspaceState?.localSupportDraft}
          onResetDraft={() => {}}
          onCreate={() => onCreateLocalSupportEntry(request.businessId)}
          onCloseRequest={onCloseRequest}
        />
      </ModuleDevGate>
    );
  }

  if (toolId === "knowledge") {
    return (
      <ModuleDevGate
        moduleName="База знаний"
        crashLabel="KnowledgeBaseToolPanel"
        devCrash={devErrorSimulation.knowledge}
        resetKey={`knowledge:${devErrorSimulation.knowledge}`}
        onReset={() => resetDevError("knowledge")}
      >
        <KnowledgeBaseToolPanel request={request} />
      </ModuleDevGate>
    );
  }

  return null;
}
