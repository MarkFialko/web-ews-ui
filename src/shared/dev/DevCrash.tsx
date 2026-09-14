import type { ReactNode } from "react";
import { DevSimulationError, type DevErrorKind } from "./devErrorSimulation";

export type DevCrashProps = {
  active?: boolean;
  kind?: DevErrorKind;
  label: string;
  children?: ReactNode;
};

/**
 * Throws in DEV to trigger module error boundaries on demand.
 */
function DevCrash({ active, kind = "none", label }: DevCrashProps) {
  if (!import.meta.env.DEV) return null;

  const resolvedKind = kind !== "none" ? kind : active ? "critical" : null;
  if (!resolvedKind) return null;

  throw new DevSimulationError(label, resolvedKind);
}

export default DevCrash;
