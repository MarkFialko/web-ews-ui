import { Avatar, Box, Stack, Typography, Paper } from "@mui/material";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import FaxIcon from "@mui/icons-material/Fax";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import {
  useGetEmployeeByNumberQuery,
  useEmployeePhotoQuery,
} from "@modules/request-card";
import type { UserInfoResponse } from "@modules/request-card/types";
import { InfoRow, InfoPanel, CopyRow, EmptyRow } from "../common/info";
import { CopyButton, useCopy } from "@shared/ui";

const getClientInitials = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts || parts.length === 0) return "??";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

export type ClientTabPanelProps = {
  employeeNumber?: string | null;
  isActive?: boolean;
  employeeInfo?: UserInfoResponse | null;
  employeePhoto?: string | null;
};

function ClientTabPanel({
  employeeNumber,
  isActive,
  employeeInfo,
  employeePhoto,
}: ClientTabPanelProps) {
  const { copy } = useCopy();
  const { data: fetchedEmployeeData, isLoading } = useGetEmployeeByNumberQuery(
    employeeNumber ?? "",
    { skip: !!employeeInfo || !employeeNumber || !isActive },
  );

  const { data: employeePhotoData } = useEmployeePhotoQuery(
    employeeNumber ?? "",
    {
      skip: !!employeePhoto || !employeeNumber || !isActive,
    },
  );
  const photoData = employeePhoto ?? employeePhotoData?.photoData;
  const employeeData = employeeInfo ?? fetchedEmployeeData;

  if (!employeeNumber) {
    return (
      <Typography variant="body2" color="text.secondary">
        Данные клиента недоступны.
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Загрузка данных клиента...
      </Typography>
    );
  }

  if (!employeeData) {
    return (
      <Typography variant="body2" color="text.secondary">
        Данные клиента недоступны.
      </Typography>
    );
  }

  const {
    userMainInfo = {} as UserInfoResponse["userMainInfo"] &
      Record<string, unknown>,
    isVip,
  } = employeeData ?? {};

  const unit = userMainInfo?.unit ?? "—";
  const workPhones = (userMainInfo?.phones ?? []) as PhoneInfo[];
  const workEmails = (userMainInfo?.mails ?? []) as EmailInfo[];
  const localEmployeeNumber = userMainInfo?.employeeNumber ?? "";
  const fullName = userMainInfo?.userFullName ?? "";
  const tb = userMainInfo?.tb ?? "";
  const department = userMainInfo?.department ?? "";
  const smPosition = userMainInfo?.position ?? "";
  const empCity = userMainInfo?.location ?? "";

  const internalPhone =
    workPhones.find((p) => p.type.toLocaleUpperCase().indexOf("INNER") !== -1)
      ?.number ?? null;
  const primaryMobile =
    workPhones.find((p) => p.type.toLocaleUpperCase().indexOf("MOBILE") !== -1)
      ?.number ?? null;
  const cityPhone =
    workPhones.find((p) => p.type.toLocaleUpperCase().indexOf("CITY") !== -1)
      ?.number ?? null;

  const internalEmail =
    workEmails.find(
      (e) => e.type.toLocaleUpperCase().indexOf("INTERNAL") !== -1,
    )?.address ?? null;
  const externalEmail =
    workEmails.find(
      (e) => e.type.toLocaleUpperCase().indexOf("EXTERNAL") !== -1,
    )?.address ?? null;

  const segment = isVip ? "VIP" : "Массовый";

  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "flex-start" }}
        >
          <Avatar
            alt={fullName}
            src={photoData}
            sx={{ width: 132, height: 132, fontSize: 44, flexShrink: 0 }}
          >
            {!photoData && getClientInitials(fullName)}
          </Avatar>

          <Stack spacing={1.1} sx={{ flex: 1, minWidth: 0 }}>
            <InfoRow
              label="Инициатор"
              value={fullName}
              action={<CopyButton value={fullName} message="ФИО скопировано" />}
              accent
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(90px, 1fr))",
                  xl: "220px minmax(90px, 1fr) 180px",
                },
                gap: 1,
                alignItems: "start",
              }}
            >
              <InfoRow
                label="Табельный номер"
                value={localEmployeeNumber || "—"}
                action={
                  <CopyButton
                    value={employeeNumber}
                    message="Табельный номер скопирован"
                  />
                }
              />
              <InfoRow label="Должность" value={smPosition || "—"} />
              <InfoRow label="Сегмент" value={segment || "—"} />
              <InfoRow label="ТБ" value={tb || "—"} />
              <InfoRow label="Подразделение" value={department || "—"} />
            </Box>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              xl: "1.1fr 1fr 1fr",
            },
            gap: 1.5,
          }}
        >
          <InfoPanel title="Контакты">
            <Stack spacing={0.8}>
              {primaryMobile ? (
                <CopyRow
                  value={primaryMobile}
                  onCopy={() => copy(primaryMobile, "Телефон скопирован")}
                  prefixIcon={<SmartphoneIcon />}
                />
              ) : (
                <EmptyRow prefixIcon={<SmartphoneIcon />} />
              )}
              {internalPhone ? (
                <CopyRow
                  value={internalPhone}
                  onCopy={() => copy(internalPhone, "Телефон скопирован")}
                  prefixIcon={<FaxIcon />}
                />
              ) : (
                <EmptyRow prefixIcon={<FaxIcon />} />
              )}
              {cityPhone ? (
                <CopyRow
                  value={cityPhone}
                  onCopy={() => copy(cityPhone, "Телефон скопирован")}
                  prefixIcon={<BusinessIcon />}
                />
              ) : null}
              {externalEmail ? (
                <CopyRow
                  value={externalEmail}
                  onCopy={() => copy(externalEmail, "Почта скопирована")}
                  prefixIcon={<EmailIcon />}
                />
              ) : (
                <EmptyRow prefixIcon={<EmailIcon />} />
              )}
              {internalEmail ? (
                <CopyRow
                  value={internalEmail}
                  onCopy={() => copy(internalEmail, "Почта скопирована")}
                  prefixIcon={<EmailIcon />}
                />
              ) : (
                <EmptyRow prefixIcon={<EmailIcon />} />
              )}
            </Stack>
          </InfoPanel>

          <InfoPanel title="Место работы">
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              {unit}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              {empCity || "—"}
            </Typography>
          </InfoPanel>

          <InfoPanel title="График работы">
            <Stack spacing={0.5}>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "text.secondary" }}
              >
                Данные отсутствуют
              </Typography>
            </Stack>
          </InfoPanel>
        </Box>
      </Stack>
    </Paper>
  );
}

export default ClientTabPanel;
