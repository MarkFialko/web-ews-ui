import { useAgentAction, useCTI } from "@modules/cti/model";
import { MicOffOutlined, VolumeUpOutlined } from "@mui/icons-material";
import {
  alpha,
  IconButton,
  Slider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  NEW_RTC_SESSION,
  RTC_SESSION_TRACK,
  type IVoiceInteraction,
} from "@sber-scpl/core/jssdk";
import { WORKLOG_ACTIONS } from "@shared/worklog-logger";
import { useEffect, useRef, useState, type MutableRefObject } from "react";

const initRTCAudio = (
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  interaction: IVoiceInteraction,
) => {
  if (!interaction) return;

  interaction.on(NEW_RTC_SESSION, () => {
    initRTCAudio(audioRef, interaction);
  });

  const session = interaction.rtcSession;

  if (!session) return;

  const setAudioStream = (stream: MediaStream) => {
    if (audioRef.current) {
      audioRef.current!.srcObject = stream;
      audioRef.current!.muted = false;
    }
  };

  if (session.remoteStream) {
    setAudioStream(session.remoteStream);
  }

  session.on(RTC_SESSION_TRACK, (event: RTCTrackEvent) => {
    setAudioStream(event.streams[0]);
  });
};

const DEFAULT_VOLUME_LEVEL = 30;

export const AudioControls = () => {
  const { isPostProcessing, interaction } = useCTI();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isMuted, setIsMuted] = useState(false);

  const unmuteAction = useAgentAction(
    "interaction",
    (interaction) => {
      return interaction.unmuteMicrophone();
    },
    "Не удалось включить микрофон",
    WORKLOG_ACTIONS.CTI_UNMUTE,
    {
      onSuccess: () => {
        setIsMuted(false);
      },
    },
  );

  const muteAction = useAgentAction(
    "interaction",
    (interaction) => {
      return interaction.muteMicrophone();
    },
    "Не удалось выключить микрофон",
    WORKLOG_ACTIONS.CTI_MUTE,
    {
      onSuccess: () => {
        setIsMuted(true);
      },
    },
  );

  const [volumeLevel, setVolumeLevel] = useState(DEFAULT_VOLUME_LEVEL);

  const isActionsDisabled = !interaction || isPostProcessing;

  useEffect(() => {
    if (audioRef.current && interaction) {
      initRTCAudio(audioRef, interaction);
    }
  }, [audioRef.current, interaction]);

  const hanldeMuteToggle = async () => {
    if (!interaction) {
      return;
    }

    if (isMuted) {
      unmuteAction.execute();
    } else {
      muteAction.execute();
    }
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={(theme) => ({
        px: 0.75,
        py: 0.5,
        border: 1,
        borderColor: theme.palette.divider,
        borderRadius: 1.5,
      })}
    >
      <VolumeUpOutlined fontSize="small" color="action" />
      <Slider
        disabled={isActionsDisabled}
        size="small"
        aria-label="Громкость звонка"
        value={volumeLevel}
        min={0}
        max={100}
        onChange={(_, value) => {
          setVolumeLevel(value);
          if (!audioRef.current) return;

          audioRef.current!.volume = value / 100;
        }}
        sx={{ flex: 1 }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ width: 32, textAlign: "right" }}
      >
        {volumeLevel}%
      </Typography>
      <Tooltip title={isMuted ? "Включить микрофон" : "Выключить микрофон"}>
        <IconButton
          disabled={isActionsDisabled}
          size="small"
          color={isMuted ? "primary" : "default"}
          aria-label={isMuted ? "Включить микрофон" : "Выключить микрофон"}
          onClick={hanldeMuteToggle}
          sx={(theme) => ({
            width: 32,
            height: 32,
            border: 1,
            borderColor: isMuted
              ? theme.palette.primary.main
              : theme.palette.divider,
            bgcolor: isMuted
              ? alpha(theme.palette.primary.main, 0.08)
              : "background.paper",
          })}
        >
          <MicOffOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      <audio autoPlay playsInline ref={audioRef} />
    </Stack>
  );
};
