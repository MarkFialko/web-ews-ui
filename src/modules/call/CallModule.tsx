import { ModuleErrorBoundary } from "@shared/errors";
import {
  DevCrash,
  resolveModuleDevState,
  type DevCrashInput,
} from "@shared/dev";
import CallPanel, { type CallPanelProps } from "./CallPanel";

export type CallModuleProps = CallPanelProps & {
  resetKey?: string | number;
  onReload?: () => void;
  devCrash?: DevCrashInput;
};

function CallModule({
  resetKey,
  onReload,
  devCrash,
  ...props
}: CallModuleProps) {
  const { softErrorKind, blockingErrorKind } = resolveModuleDevState(devCrash);

  return (
    <ModuleErrorBoundary
      moduleName="Дозвон"
      resetKey={resetKey}
      onReset={onReload}
    >
      <DevCrash
        kind={blockingErrorKind !== "none" ? blockingErrorKind : undefined}
        label="CallModule"
      />
      <CallPanel
        {...props}
        devModuleErrorKind={softErrorKind}
        onDevModuleErrorRetry={softErrorKind !== "none" ? onReload : undefined}
      />
    </ModuleErrorBoundary>
  );
}

export default CallModule;
