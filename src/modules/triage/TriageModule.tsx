import { ModuleDevGate, type DevCrashInput } from "@shared/dev";
import TriageList, { type TriageListProps } from "./TriageList";

export type TriageModuleProps = TriageListProps & {
  resetKey?: string | number;
  onReload?: () => void;
  devCrash?: DevCrashInput;
};

export default function TriageModule({
  resetKey,
  onReload,
  devCrash,
  ...props
}: TriageModuleProps) {
  return (
    <ModuleDevGate
      moduleName="Triage"
      crashLabel="TriageModule"
      devCrash={devCrash}
      resetKey={resetKey}
      onReset={onReload}
    >
      <TriageList {...props} />
    </ModuleDevGate>
  );
}
