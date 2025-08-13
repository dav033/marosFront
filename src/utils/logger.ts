// src/utils/logger.ts

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error'];

let currentLevel: LogLevel = 'info';

export function setLogLevel(level: LogLevel) {
  currentLevel = level;
}

function shouldLog(level: LogLevel) {
  return LEVELS.indexOf(level) >= LEVELS.indexOf(currentLevel);
}

export const logger = {
  debug: (...args: any[]) => shouldLog('debug') && console.debug('[debug]', ...args),
  info: (...args: any[]) => shouldLog('info') && console.info('[info]', ...args),
  warn: (...args: any[]) => shouldLog('warn') && console.warn('[warn]', ...args),
  error: (...args: any[]) => shouldLog('error') && console.error('[error]', ...args),
};
