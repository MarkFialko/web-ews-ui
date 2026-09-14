import { Button } from "@mui/material";
import { getEsmLink } from "@shared/utils";

interface Props {
  businessId: string;
  title?: string;
}

export const OpenInEsmButton = (props: Props) => {
  const { businessId, title } = props;

  const handleOpenInEsm = () => {
    getEsmLink(businessId).then((link) => window.open(link, "_blank"));
  };

  return (
    <Button
      size="small"
      variant="contained"
      onClick={handleOpenInEsm}
      color="success"
    >
      {title ? title : "Открыть в ESM"}
    </Button>
  );
};
