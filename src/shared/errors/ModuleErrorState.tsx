import {
  Alert,
  AlertTitle,
  Button,
  Stack,
  type AlertColor,
} from "@mui/material";

export type ModuleErrorStateProps = {
  title: string;
  description: string;
  severity?: AlertColor;
  retryLabel?: string;
  onRetry?: () => void;
};

/**
 * Reusable error block for module-level failures.
 * Keep copy editable to allow per-module language tweaks.
 */
function ModuleErrorState({
  title,
  description,
  severity = "warning",
  retryLabel = "Перезагрузить",
  onRetry,
}: ModuleErrorStateProps) {
  return (
    <Stack spacing={1.5}>
      <Alert
        severity={severity}
        variant="outlined"
        sx={{ borderRadius: 2 }}
        action={
          onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : undefined
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {description}
      </Alert>
    </Stack>
  );
}

export default ModuleErrorState;
