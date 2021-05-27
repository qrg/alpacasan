import { App, AppOptions, InstallURLOptions } from '@slack/bolt';

import { log } from '../lib/log';

import { notifyVCEventConfig } from './notify-vc-event/index';

export type SkillOptions = Record<string, unknown>;

export type InitSkill<T extends SkillOptions> = (args: {
  readonly app: App;
  readonly token: AppOptions['token'];
  readonly options: T;
}) => void;

export type SkillConfig<T extends SkillOptions> = {
  readonly isActive: boolean;
  readonly init: InitSkill<T>;
  readonly scopes: InstallURLOptions['scopes'];
  readonly userScopes: InstallURLOptions['userScopes'];
  readonly options: T;
};

const configs = {
  notifyVCEvent: notifyVCEventConfig,
};

export const activateSkills = (app: App, token: AppOptions['token']): void => {
  const skills = Object.entries(configs).filter(
    ([_, skill]) => skill.isActive
  );

  const activated = skills.map(([skillName, skill]) => {
    skill.init({
      app,
      token,
      options: skill.options
    });
    return skillName;
  });

  log('info', `Activated skills: ${JSON.stringify(activated, null, 2)}`);
};
