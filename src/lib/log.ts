import { gray, cyan, red, bgRed, yellow } from 'chalk';

type Level = 'debug' | 'info' | 'warn' | 'error';

type Log = (level: Level, ...args: unknown[]) => void;

const logLevelMap = {
  debug: (...args: unknown[]): void =>
    // eslint-disable-next-line no-console
    console.log(gray('DEBUG: '), ...args.map((arg) => gray(arg))),

  info: (...args: unknown[]): void =>
    // eslint-disable-next-line no-console
    console.info(cyan('INFO: '), ...args),

  warn: (...args: unknown[]): void =>
    // eslint-disable-next-line no-console
    console.warn(yellow('WARN: '), ...args.map((arg) => yellow(arg))),

  error: (...args: unknown[]): void =>
    // eslint-disable-next-line no-console
    console.error(bgRed('ERROR: '), ...args.map((arg) => red(arg)))
};

export const log: Log = (level, ...args) => {
  logLevelMap[level](...args);
};
