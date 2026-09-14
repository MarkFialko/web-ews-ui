import { useEffect } from "react";
import { Box } from "@mui/material";

import placeholderUrl from "@assets/image-placeholder.svg";

import { useChatImage, useIntersectionVisibility } from "../hooks";

export type AttachmentThumbnailProps = {
  guid: string;
  mimeType: string;
  onClick: () => void;
};

/**
 * Миниатюра вложенного изображения. Загружается лениво в момент попадания в область
 * видимости (IntersectionObserver): запрос к Middle выполняется только когда миниатюра
 * видима. Просмотр (модальное окно) доступен только для загруженного изображения:
 * пока dataUrl отсутствует (загрузка или ошибка), клик не открывает модалку и повторно
 * Middle не запрашивается. Миниатюра рендерится нативным <img>, без lazy-библиотек.
 *
 * Контейнер имеет фиксированный размер 260×170 — это гарантирует, что placeholder
 * и реальное изображение занимают одинаковое пространство и не сдвигают строку чата.
 * Содержимое вписывается через max-width/max-height: маленькие изображения (например,
 * ярлыки) не увеличиваются сверх натурального размера, а большие — целиком умещаются.
 */
export const AttachmentThumbnail = ({
  guid,
  mimeType,
  onClick,
}: AttachmentThumbnailProps) => {
  const { dataUrl, load } = useChatImage(guid, mimeType);
  const { isVisible, ref } = useIntersectionVisibility<HTMLDivElement>();

  // При появлении в viewport — загружаем изображение (кэш-first).
  useEffect(() => {
    if (isVisible) void load();
  }, [isVisible, load]);

  const isReady = Boolean(dataUrl);

  return (
    <Box
      ref={ref}
      onClick={isReady ? onClick : undefined}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 260,
        height: 170,
        flexShrink: 0,
        cursor: isReady ? "pointer" : "default",
        border: isReady ? undefined : "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
      }}
      data-testid={
        isReady ? "attachment-thumbnail" : "attachment-thumbnail-placeholder"
      }
    >
      <Box
        component="img"
        src={dataUrl ?? placeholderUrl}
        alt={isReady ? "Вложение" : "Загрузка..."}
        sx={{
          display: "block",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          borderRadius: 1,
        }}
      />
    </Box>
  );
};
