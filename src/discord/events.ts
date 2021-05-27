import { VoiceState } from 'discord.js';
import { eventmit } from 'eventmit';
export type VoiceChannelEventName = Readonly<'join' | 'leave' | 'move'>;

export type VoiceChannelEventPayload = Readonly<{
  oldState: VoiceState;
  newState: VoiceState;
}>;

export const voiceChannelJoin = eventmit<VoiceChannelEventPayload>();
export const voiceChannelLeave = eventmit<VoiceChannelEventPayload>();
export const voiceChannelMove = eventmit<VoiceChannelEventPayload>();
