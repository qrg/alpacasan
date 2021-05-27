import { Client } from 'discord.js';

import { log } from '../lib/log';
import { onVoiceStateUpdate } from './on-voice-state-update';

export const initDiscordApp = ({
  token
}: {
  readonly token: string | undefined;
}): void => {
  const client = new Client();

  client.once('ready', () => {
    log('info', 'Discord App is ready!');
  });

  client.on('voiceStateUpdate', onVoiceStateUpdate);

  client.login(token);
};
