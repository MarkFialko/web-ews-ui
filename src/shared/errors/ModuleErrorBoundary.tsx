import { Component, type ReactNode } from "react";
import ModuleErrorState from "./ModuleErrorState";
import {
  getModuleErrorStateProps,
  isDevSimulationError,
} from "../dev/devErrorSimulation";

export type ModuleErrorBoundaryProps = {
  moduleName: string;
  resetKey?: string | number;
  onReset?: () => void;
  children: ReactNode;
};

type ModuleErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

/**
 * Module-level error boundary so each feature can fail independently.
 */
class ModuleErrorBoundary extends Component<
  ModuleErrorBoundaryProps,
  ModuleErrorBoundaryState
> {
  state: ModuleErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ModuleErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // Log technical details for developers without exposing them in the UI.
    console.error("[ModuleErrorBoundary]", this.props.moduleName, error);
  }

  componentDidUpdate(prevProps: ModuleErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      // Reset after explicit reload.
      this.setState({ hasError: false, error: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      const errorStateProps = isDevSimulationError(this.state.error)
        ? getModuleErrorStateProps(this.props.moduleName, this.state.error.kind)
        : getModuleErrorStateProps(this.props.moduleName);

      return (
        <ModuleErrorState {...errorStateProps} onRetry={this.props.onReset} />
      );
    }

    return this.props.children;
  }
}

export default ModuleErrorBoundary;
