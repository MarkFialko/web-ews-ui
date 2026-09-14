import { Box } from "@mui/material";
import { ModuleDevGate, type DevCrashInput } from "@shared/dev";
import CompactTriageList, {
  type CompactTriageListProps,
} from "./CompactTriageList";

export type CompactTriageModuleProps = CompactTriageListProps & {
  resetKey?: string | number;
  onReload?: () => void;
  devCrash?: DevCrashInput;
};

export default function CompactTriageModule({
  resetKey,
  onReload,
  devCrash,
  ...props
}: CompactTriageModuleProps) {
  return (
    <ModuleDevGate
      moduleName="Список заявок"
      crashLabel="CompactTriageModule"
      devCrash={devCrash}
      resetKey={resetKey}
      onReset={onReload}
    >
      <Box sx={{ height: "100%", minHeight: 0 }}>
        <CompactTriageList {...props} />
      </Box>
    </ModuleDevGate>
  );
}
