import RequestCard, { type RequestCardProps } from "./RequestCard";
import { ModuleErrorBoundary } from "@shared/errors";
import {
  DevCrash,
  resolveModuleDevState,
  type DevCrashInput,
} from "@shared/dev";

export type RequestCardModuleProps = RequestCardProps & {
  resetKey?: string | number;
  onReload?: () => void;
  devCrash?: DevCrashInput;
};

function RequestCardModule({
  resetKey,
  onReload,
  devCrash,
  ...props
}: RequestCardModuleProps) {
  const { softErrorKind, blockingErrorKind } = resolveModuleDevState(devCrash);

  return (
    <ModuleErrorBoundary
      moduleName="Карточка обращения"
      resetKey={resetKey}
      onReset={onReload}
    >
      <DevCrash
        kind={blockingErrorKind !== "none" ? blockingErrorKind : undefined}
        label="RequestCard"
      />
      <RequestCard
        {...props}
        devRequestErrorKind={softErrorKind}
        onRequestErrorRetry={softErrorKind !== "none" ? onReload : undefined}
      />
    </ModuleErrorBoundary>
  );
}

export default RequestCardModule;
