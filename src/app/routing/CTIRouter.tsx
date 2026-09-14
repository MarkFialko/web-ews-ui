import { Routes, Route, Navigate } from "react-router-dom";

import { ROUTES } from "@shared/routing";

import { CTIModule } from "@modules/cti";

import { CtiLayout } from "../layouts";

export const CTIRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.CTI} element={<CtiLayout />}>
        <Route index element={<CTIModule />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.CTI} replace />} />
    </Routes>
  );
};
