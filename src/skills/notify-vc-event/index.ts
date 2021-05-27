import { InitSkill, SkillConfig } from '../index';
import { App, AppOptions } from '@slack/bolt';

import { log } from '../../lib/log';

import {
  voiceChannelJoin,
  voiceChannelMove,
  voiceChannelLeave,
  VoiceChannelEventPayload,
  VoiceChannelEventName
} from '../../discord/events';

export type NotifyVCEventOptions = {
  readonly channelId: string;
  readonly event: {
    readonly [eventName in VoiceChannelEventName]: {
      readonly formatText: (payload: VoiceChannelEventPayload) => string;
    };
  };
};

type OnVCEvent = (args: {
  readonly app: App;
  readonly token: AppOptions['token'];
  readonly channel: NotifyVCEventOptions['channelId'];
  readonly text: string;
}) => Promise<void>;

const onVCJoin: OnVCEvent = async ({ app, token, channel, text }) => {
  const { client } = app;
  await client.conversations.join({ token, channel });
  await client.chat.postMessage({
    token,
    channel,
    text
  });
  log('info', text);
};

const onVCMove: OnVCEvent = async ({ app, token, channel, text }) => {
  const { client } = app;
  await client.conversations.join({ token, channel });
  await client.chat.postMessage({
    token,
    channel,
    text
  });
  log('info', text);
};

const onVCLeave: OnVCEvent = async ({ app, token, channel, text }) => {
  const { client } = app;
  await client.conversations.join({ token, channel });
  await client.chat.postMessage({
    token,
    channel,
    text
  });
  log('info', text);
};

const notifyVCEventOptions: NotifyVCEventOptions = {
  channelId: 'C013S8BCFFH', // #times-qurage
  event: {
    join: {
      formatText: ({
        newState: { channel, member }
      }: VoiceChannelEventPayload): string => {
        const channelName = channel?.name;
        const userName = member?.nickname ?? member?.displayName;
        return `:discord: ${userName} が ${channelName} に来ましたよ :tada:`;
      }
    },
    move: {
      formatText: ({
        oldState,
        newState
      }: VoiceChannelEventPayload): string => {
        const oldChannelName = oldState.channel?.name;
        const newChannelName = newState.channel?.name;
        const { member } = newState;
        const userName = member?.nickname ?? member?.displayName;
        return `:discord: ${userName} が ${oldChannelName} から ${newChannelName} に移動しました`;
      }
    },
    leave: {
      formatText: ({
        oldState: { channel, member }
      }: VoiceChannelEventPayload): string => {
        const channelName = channel?.name;
        const userName = member?.nickname ?? member?.displayName;
        return `:discord: ${userName} が ${channelName} から帰っていった :wave:`;
      }
    }
  }
};

export const initNotifyVCEvent: InitSkill<NotifyVCEventOptions> = ({
  app,
  token,
  options = {}
}): void => {
  const opts = {
    ...notifyVCEventOptions,
    ...options
  };

  voiceChannelJoin.on(async (payload) => {
    const channel = opts.channelId;
    const text = opts.event.join.formatText(payload);
    await onVCJoin({ app, token, channel, text });
  });

  voiceChannelMove.on(async (payload) => {
    const channel = opts.channelId;
    const text = opts.event.move.formatText(payload);
    await onVCMove({ app, token, channel, text });
  });

  voiceChannelLeave.on(async (payload) => {
    const channel = opts.channelId;
    const text = opts.event.leave.formatText(payload);
    await onVCLeave({ app, token, channel, text });
  });
};

export const notifyVCEventConfig: SkillConfig<NotifyVCEventOptions> = {
  isActive: true,
  init: initNotifyVCEvent,
  scopes: ['channels:join', 'chat:write'],
  userScopes: [],
  options: notifyVCEventOptions
};
