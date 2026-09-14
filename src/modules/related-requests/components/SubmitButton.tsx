import { Button, CircularProgress } from "@mui/material";

interface Props {
  loading: boolean;
  disabled?: boolean;
}

export const SubmitButton = (props: Props) => {
  const { loading, disabled } = props;

  return (
    <Button
      type="submit"
      variant="contained"
      disabled={loading || disabled}
      sx={{ mt: 2 }}
    >
      {loading ? (
        <>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          Отправка...
        </>
      ) : (
        "Отправить"
      )}
    </Button>
  );
};
