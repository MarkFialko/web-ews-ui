import { useCTI } from "@modules/cti/model";

import { BlindTransferAction } from "../cti-actions";
import { FirstLine, SecondLine, ThirdLine } from "../cti-lines";
import { LinesPanel } from "../LinesPanel";

export const TransferPanel = () => {
  const { secondLine, thirdLine } = useCTI();

  return (
    <LinesPanel title="Перевод на линию">
      <FirstLine />
      <SecondLine>
        <BlindTransferAction
          disabled={secondLine.trim().length === 0}
          value={secondLine}
        />
      </SecondLine>
      <ThirdLine>
        <BlindTransferAction
          disabled={thirdLine.trim().length === 0}
          value={thirdLine}
        />
      </ThirdLine>
    </LinesPanel>
  );
};
