import { Alert, Box, Button, Stack } from "@mui/material";
import type { ReactNode } from "react";
import { ModuleErrorBoundary } from "../errors";
import DevCrash from "./DevCrash";
import {
  getModuleErrorStateProps,
  resolveModuleDevState,
  type DevCrashInput,
} from "./devErrorSimulation";

export type ModuleDevGateProps = {
  moduleName: string;
  crashLabel: string;
  devCrash?: DevCrashInput;
  onReset?: () => void;
  resetKey?: string | number;
  children: ReactNode;
};

function ModuleDevGate({
  moduleName,
  crashLabel,
  devCrash,
  onReset,
  resetKey,
  children,
}: ModuleDevGateProps) {
  const { softErrorKind, blockingErrorKind } = resolveModuleDevState(devCrash);
  const errorStateProps =
    softErrorKind !== "none"
      ? getModuleErrorStateProps(moduleName, softErrorKind)
      : null;

  return (
    <ModuleErrorBoundary
      moduleName={moduleName}
      resetKey={resetKey}
      onReset={onReset}
    >
      <DevCrash
        kind={blockingErrorKind !== "none" ? blockingErrorKind : undefined}
        label={crashLabel}
      />
      {errorStateProps ? (
        <Stack spacing={1} sx={{ height: "100%", minHeight: 0 }}>
          <Alert
            severity={errorStateProps.severity}
            variant="outlined"
            action={
              onReset ? (
                <Button color="inherit" size="small" onClick={onReset}>
                  {errorStateProps.retryLabel}
                </Button>
              ) : undefined
            }
          >
            <strong>{errorStateProps.title}</strong>{" "}
            {errorStateProps.description}
          </Alert>
          <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
        </Stack>
      ) : (
        children
      )}
    </ModuleErrorBoundary>
  );
}

export default ModuleDevGate;
