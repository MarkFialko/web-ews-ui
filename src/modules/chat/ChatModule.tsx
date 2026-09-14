import { ChatPanel, type ChatPanelProps } from "./ChatPanel";
import { ModuleErrorBoundary } from "@shared/errors";
import {
  DevCrash,
  resolveModuleDevState,
  type DevCrashInput,
} from "@shared/dev";

export type ChatModuleProps = ChatPanelProps & {
  resetKey?: string | number;
  onReload?: () => void;
  devCrash?: DevCrashInput;
};

/**
 * Module wrapper with an error boundary for the Chat module.
 */
function ChatModule({
  resetKey,
  onReload,
  devCrash,
  ...props
}: ChatModuleProps) {
  const { softErrorKind, blockingErrorKind } = resolveModuleDevState(devCrash);

  return (
    <ModuleErrorBoundary
      moduleName="Чат"
      resetKey={resetKey}
      onReset={onReload}
    >
      <DevCrash
        kind={blockingErrorKind !== "none" ? blockingErrorKind : undefined}
        label="ChatModule"
      />
      <ChatPanel
        {...props}
        onDevModuleErrorRetry={softErrorKind !== "none" ? onReload : undefined}
      />
    </ModuleErrorBoundary>
  );
}

export default ChatModule;
