import { VoiceState } from 'discord.js';
import { Eventmitter } from 'eventmit';

import {
  VoiceChannelEventName,
  VoiceChannelEventPayload,
  voiceChannelJoin,
  voiceChannelLeave,
  voiceChannelMove
} from './events';

type EmitterConditionMap = Readonly<{
  condition: (payload: VoiceChannelEventPayload) => boolean;
  emitter: Eventmitter<VoiceChannelEventPayload>;
}>;

const eventMap = new Map<VoiceChannelEventName, EmitterConditionMap>([
  [
    'join',
    {
      condition: ({
        oldState: { channel: oldChannel },
        newState: { channel: newChannel }
      }) => !oldChannel && !!newChannel,
      emitter: voiceChannelJoin
    }
  ],
  [
    'leave',
    {
      condition: ({
        oldState: { channel: oldChannel },
        newState: { channel: newChannel }
      }) => !!oldChannel && !newChannel,
      emitter: voiceChannelLeave
    }
  ],
  [
    'move',
    {
      condition: ({
        oldState: { channel: oldChannel },
        newState: { channel: newChannel }
      }) => !!oldChannel && !!newChannel && oldChannel.id !== newChannel.id,
      emitter: voiceChannelMove
    }
  ]
]);

export const onVoiceStateUpdate = (
  oldState: VoiceState,
  newState: VoiceState
): void => {
  const [eventName] =
    [...eventMap.entries()].find(([_eventName, { condition }]) =>
      condition({ oldState, newState })
    ) ?? [];

  if (!eventName) return;

  const event = eventMap.get(eventName);

  if (!event) return;

  event.emitter.emit({ oldState, newState });
};
