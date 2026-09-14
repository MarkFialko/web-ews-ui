import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import { AssignmentTurnedInOutlined } from "@mui/icons-material";

import { Panel } from "../common";

interface Props {
  collapsedByCallDetails: boolean;
}

const handledRequests = [
  {
    id: "SR0000001",
    callerName: "Мария Орлова",
    uuid: "9f93dcf2-8d72-4f12-bc0d-105014000001",
  },
  {
    id: "SR0000002",
    callerName: "Иван Петров",
    uuid: "e32be221-5d96-4b83-9e16-105014000002",
  },
  {
    id: "SR0000003",
    callerName: "Анна Смирнова",
    uuid: "74df456a-b864-4b96-a443-105014000003",
  },
];

export const ProcessedCallBlock = (props: Props) => {
  const { collapsedByCallDetails } = props;

  if (collapsedByCallDetails) {
    return (
      <Paper variant="outlined" sx={{ borderRadius: 2, p: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ minWidth: 0 }}
          >
            <AssignmentTurnedInOutlined fontSize="small" color="action" />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2">Отработано сегодня</Typography>
              <Typography variant="caption" color="text.secondary">
                Свернуто на время работы с CTI
              </Typography>
            </Box>
          </Stack>
          <Chip label={`${handledRequests.length} запроса`} size="small" />
        </Stack>
      </Paper>
    );
  }

  return (
    <Panel
      title="Отработано сегодня"
      icon={<AssignmentTurnedInOutlined />}
      action={<Chip label={`${handledRequests.length} запроса`} size="small" />}
    >
      <Stack divider={<Divider flexItem />} sx={{ minHeight: 0 }}>
        {handledRequests.map((request) => (
          <Stack key={request.id} spacing={0.5} sx={{ py: 1 }}>
            <Button
              component="a"
              href="#"
              variant="text"
              size="small"
              onClick={(event) => event.preventDefault()}
              sx={{
                alignSelf: "flex-start",
                minWidth: 0,
                p: 0,
                fontWeight: 800,
                justifyContent: "flex-start",
              }}
            >
              {request.id}
            </Button>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {request.callerName}
            </Typography>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary">
                UUID
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "text.primary",
                  fontFamily: "monospace",
                  overflowWrap: "anywhere",
                }}
              >
                {request.uuid}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Panel>
  );
};
