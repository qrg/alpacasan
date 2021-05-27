import { App, AppOptions, UserChangeEvent } from '@slack/bolt';

import { log } from '../../lib/log';

import {
  voiceChannelJoin,
  voiceChannelLeave,
  VoiceChannelEventPayload,
  VoiceChannelEventName
} from '../../discord/events';

export type ConfigSetVCStatus = {
  userId: string;
  statusText: string;
  statusEmoji: string;
  statusExpiration: number;
};

type OnVCEvent = ({
  app,
  token,
  config
}: {
  readonly app: App;
  readonly token: AppOptions['token'];
  readonly config: ConfigSetVCStatus;
}) => Promise<void>;

const onVCJoin: OnVCEvent = async ({ app, token, config }) => {
  const { client } = app;
  const { userId, statusText, statusEmoji, statusExpiration } = config;

  const res = await client.users.profile.set({
    token,
    user: userId,
    profile: JSON.stringify({
      status_text: statusText,
      status_emoji: statusEmoji,
      status_expiration: statusExpiration
    })
  });

  log('info', res);
};

export const notifyVCEvent = ({
  app,
  token,
  config
}: {
  app: App;
  token: AppOptions['token'];
  config: ConfigSetVCStatus;
}): void => {
  voiceChannelJoin.on(async (payload) => {
    // const channel = config.channelId;
    // const text = config.event.join.formatText(payload);
    // await onVCJoin({ app, token, channel, text });
  });

  voiceChannelLeave.on(async (payload) => {
    // const channel = config.channelId;
    // const text = config.event.leave.formatText(payload);
    // await onVCLeave({ app, token, channel, text });
  });
};
