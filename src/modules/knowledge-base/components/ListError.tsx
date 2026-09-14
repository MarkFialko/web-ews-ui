import { Typography } from "@mui/material";

interface Props {
  loading: boolean;
}

export const ListError = (props: Props) => {
  const { loading } = props;

  if (loading) return <Typography>Загружаем статьи...</Typography>;

  return <Typography>Статьи ТОП-7 не найдены.</Typography>;
};
