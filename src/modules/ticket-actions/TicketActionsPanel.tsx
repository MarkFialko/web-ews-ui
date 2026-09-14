import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { type ReactNode } from "react";
import { useTicketActionsPanel } from "./useTicketActionsPanel";
import { requiresIncidentReason } from "./model";
import {
  FormInputAutocomplete,
  FormInputText,
  FormInputDropdown,
  OpenInEsmButton,
} from "@shared/ui";
import { STORE_NAMES } from "@shared/cache";
import { isAvailabilityIncident } from "@shared/request";

export type TicketActionsPanelProps = {
  ticketId: string;
};

export default function TicketActionsPanel({
  ticketId,
}: TicketActionsPanelProps) {
  const {
    ticketActionDirty,
    objectOptionsForm,
    workgroupOptionsForm,
    assigneeOptionsForm,
    closureCodeOptions,
    incidentReasonOptions,
    lateReasonOptions,
    closeDisabled,
    isLate,
    isReassigned,
    entityType,
    selectedServiceId,
    savingField,
    isSubmitting,
    openConfirm,
    apiRequest,
    control,
    formHandleSubmit,
    handleConfirmClose,
    handlePerformClose,
    handleCancelClose,
    handleSaveField,
  } = useTicketActionsPanel(ticketId);

  const isAvailability = isAvailabilityIncident(apiRequest);

  const infoBlock = (
    <Box
      sx={{
        minHeight: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Alert severity="info">
        Закрытие инцидентов доступности производится в sberESM
      </Alert>
      <OpenInEsmButton businessId={ticketId} />
    </Box>
  );

  const closureForm = (
    <Box
      sx={{
        minHeight: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Stack spacing={2}>
        <Stack spacing={1}>
          <TicketActionFieldShell
            label="Объект (услуга)*"
            dirty={ticketActionDirty.object}
            saving={savingField === "object"}
            disabled={isSubmitting}
            onSave={() => handleSaveField("object")}
          >
            <FormInputAutocomplete
              name="object"
              control={control}
              rules={{ required: "Обязательное поле" }}
              options={objectOptionsForm}
              persistScope={ticketId}
              draftStoreName={STORE_NAMES.CLOSURE_DRAFTS}
              disabled={isSubmitting}
            />
          </TicketActionFieldShell>

          <input type="hidden" value={selectedServiceId ?? ""} readOnly />
        </Stack>

        <Stack spacing={1}>
          <TicketActionFieldShell
            label="Рабочая группа *"
            dirty={false}
            saving={false}
            disabled={true}
            onSave={() => {}}
          >
            <FormInputAutocomplete
              name="group"
              control={control}
              rules={{ required: "Обязательное поле" }}
              options={workgroupOptionsForm}
              persistScope={ticketId}
              draftStoreName={STORE_NAMES.CLOSURE_DRAFTS}
              disabled={true}
            />
          </TicketActionFieldShell>

          <TicketActionFieldShell
            label="Исполнитель *"
            dirty={false}
            saving={false}
            disabled={true}
            onSave={() => {}}
          >
            <FormInputAutocomplete
              name="assignee"
              control={control}
              rules={{ required: "Обязательное поле" }}
              options={assigneeOptionsForm}
              persistScope={ticketId}
              draftStoreName={STORE_NAMES.CLOSURE_DRAFTS}
              disabled={true}
            />
          </TicketActionFieldShell>
        </Stack>

        {isReassigned && (
          <TicketActionFieldShell
            label="Причина изменения обьекта или рабочей группы *"
            dirty={ticketActionDirty.actionReason}
            saving={savingField === "actionReason"}
            disabled={isSubmitting}
            onSave={() => handleSaveField("actionReason")}
          >
            <FormInputText
              name="actionReason"
              control={control}
              label=""
              persistScope={ticketId}
              draftStoreName={STORE_NAMES.CLOSURE_DRAFTS}
              disabled={isSubmitting}
              rules={{
                required: "Обязательное поле",
                minLength: { value: 5, message: "Не менее 5 символов" },
                maxLength: { value: 1000, message: "Не более 1000 символов" },
              }}
            />
          </TicketActionFieldShell>
        )}

        <TicketActionFieldShell
          label="Решение *"
          dirty={ticketActionDirty.resolution}
          saving={savingField === "resolution"}
          disabled={isSubmitting}
          onSave={() => handleSaveField("resolution")}
        >
          <FormInputText
            name="resolution"
            control={control}
            label=""
            persistScope={ticketId}
            draftStoreName={STORE_NAMES.CLOSURE_DRAFTS}
            disabled={isSubmitting}
            rules={{
              required: "Обязательное поле",
              minLength: { value: 5, message: "Не менее 5 символов" },
              maxLength: { value: 2000, message: "Не более 2000 символов" },
            }}
            slotProps={{
              textField: {
                multiline: true,
                minRows: 5,
              },
            }}
          />
        </TicketActionFieldShell>
      </Stack>

      <Stack spacing={1.25}>
        <TicketActionFieldShell
          label="Код закрытия"
          dirty={ticketActionDirty.closureCode}
          saving={savingField === "closureCode"}
          disabled={isSubmitting}
          onSave={() => handleSaveField("closureCode")}
        >
          <FormInputDropdown
            name="closureCode"
            control={control}
            label=""
            options={closureCodeOptions}
            rules={{ required: "Обязательное поле" }}
            persistScope={ticketId}
            draftStoreName={STORE_NAMES.CLOSURE_DRAFTS}
            disabled={isSubmitting}
          />
        </TicketActionFieldShell>
        {requiresIncidentReason(entityType) && (
          <TicketActionFieldShell
            label="Причина инцидента"
            dirty={ticketActionDirty.incidentReason}
            saving={savingField === "incidentReason"}
            disabled={isSubmitting}
            onSave={() => handleSaveField("incidentReason")}
          >
            <FormInputDropdown
              name="incidentReason"
              control={control}
              label=""
              options={incidentReasonOptions}
              rules={{ required: "Обязательное поле" }}
              persistScope={ticketId}
              draftStoreName={STORE_NAMES.CLOSURE_DRAFTS}
              disabled={isSubmitting}
            />
          </TicketActionFieldShell>
        )}
        {isLate && (
          <TicketActionFieldShell
            label="Причина нарушения КС"
            dirty={ticketActionDirty.lateReason}
            saving={savingField === "lateReason"}
            disabled={isSubmitting}
            onSave={() => handleSaveField("lateReason")}
          >
            <FormInputDropdown
              name="lateReason"
              control={control}
              label=""
              options={lateReasonOptions}
              rules={{ required: "Обязательное поле" }}
              persistScope={ticketId}
              draftStoreName={STORE_NAMES.CLOSURE_DRAFTS}
              disabled={isSubmitting}
            />
          </TicketActionFieldShell>
        )}
        <Box component="span" sx={{ pt: 1 }}>
          <Button
            variant="contained"
            onClick={formHandleSubmit(handlePerformClose)}
            disabled={isSubmitting || closeDisabled}
            sx={{ minWidth: 140 }}
          >
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Выполнить"
            )}
          </Button>
        </Box>
      </Stack>

      <Dialog open={openConfirm} onClose={handleCancelClose}>
        <DialogTitle>Подтверждение операции</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Работа с обращением больше не будет доступна, так как исполнитель
            был изменён. Подтвердить действие?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} color="inherit">
            Отмена
          </Button>
          <Button onClick={handleConfirmClose} variant="contained" autoFocus>
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  return isAvailability ? infoBlock : closureForm;
}

function TicketActionFieldShell({
  label,
  dirty,
  saving,
  disabled,
  onSave,
  children,
}: {
  label?: string;
  dirty: boolean;
  saving: boolean;
  disabled?: boolean;
  onSave: () => void;
  children: ReactNode;
}) {
  const showDirtyIcon = dirty && !saving && !disabled;
  return (
    <Stack spacing={0.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        {label ? <Typography variant="fieldLabel">{label}</Typography> : null}
        {saving ? (
          <CircularProgress size={14} />
        ) : showDirtyIcon ? (
          <Tooltip title="Сохранить">
            <IconButton size="small" onClick={onSave}>
              <SaveOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        ) : null}
      </Stack>
      {children}
    </Stack>
  );
}
