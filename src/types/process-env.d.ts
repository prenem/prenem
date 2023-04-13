import type { ParsedProcessEnv } from '~/constants/process-env';

import type { O } from 'ts-toolbelt';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends O.Merge<NodeJS.ProcessEnv, ParsedProcessEnv> {}
  }
}
