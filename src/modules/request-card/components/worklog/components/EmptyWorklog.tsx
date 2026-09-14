import { Typography } from "@mui/material";

import { EMPTY_WORKLOG_TEXTS } from "../constants";

interface Props {
  loading: boolean;
}

export const EmptyWorklog = (props: Props) => {
  const { loading } = props;

  return (
    <Typography variant="body2" color="text.secondary">
      {loading ? EMPTY_WORKLOG_TEXTS.loading : EMPTY_WORKLOG_TEXTS.empty}
    </Typography>
  );
};
