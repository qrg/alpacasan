import dotenv from 'dotenv';
import { App } from '@slack/bolt';

import { filterUndefinedVars } from './lib/filter-undefined-vars';
import { initDiscordApp } from './discord';
import { activateSkills } from './skills';
import { log } from './lib/log';

dotenv.config();

const { DISCORD_TOKEN, SLACK_SIGNING_SECRET, SLACK_BOT_TOKEN } = process.env;
const DEFAULT_PORT = 3000;

const undefinedVars = filterUndefinedVars({
  DISCORD_TOKEN,
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET
});

if (undefinedVars.length >= 1) {
  undefinedVars.forEach((varName) => {
    log('error', `An environment variable ${varName} is not set.`);
  });
  throw new Error('One or more required environment variables are missing.');
}

export const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET
});

const startApp = async (
  { port }: { port?: number } = { port: DEFAULT_PORT }
): Promise<void> => {
  initDiscordApp({ token: DISCORD_TOKEN });

  await app.start(port);
  log('info', 'Slack App is running!');

  activateSkills(app, SLACK_BOT_TOKEN);
};

startApp().catch((err) => log('error', err));
