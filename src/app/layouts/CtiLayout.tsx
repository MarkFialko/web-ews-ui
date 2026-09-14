import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

/** Пустой лайаут-страница раздела «CTI»: шапка приложения и
 *  placeholder-контент, готовый под дальнейшее наполнение. */
export function CtiLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}
