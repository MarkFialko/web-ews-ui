import { useCTI } from "@modules/cti/model";
import { LineWrapper } from "./LineWrapper";
import { PhoneNumberSelect } from "../PhoneNumberSelect";
import type { PropsWithChildren } from "react";

export const ThirdLine = (props: PropsWithChildren) => {
  const { children } = props;
  const { thirdLine, setThirdLine } = useCTI();

  return (
    <LineWrapper extraActions={<></>}>
      <PhoneNumberSelect
        value={thirdLine}
        onChange={setThirdLine}
        label="Линия 3"
        disabled={false}
      />
      {children}
    </LineWrapper>
  );
};
