import { authHandlers } from './auth';
import { healthHandlers } from './health';
import { logHandlers } from './log';

export const handlers = [...authHandlers, ...healthHandlers, ...logHandlers];
