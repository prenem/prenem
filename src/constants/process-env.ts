import { z } from 'zod';

const ServerSideSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

const ClientSideEnvSchema = z.object({
  /** NEXT_PUBLIC_PUBLIC_VARIABLE: z.string(), */
});

// Every environment variable that is used in the environment where the code is running
// must be defined here because Next.js adds all environment variables at build time.
const compiledProcessEnv = {
  NODE_ENV: process.env.NODE_ENV,
};

// Parses only the environment variables that are used in the environment where the code is running.
// This prevents the process from crashing when parsing server-side environment variables in the browser.

const ProcessEnvSchema = ServerSideSchema.merge(ClientSideEnvSchema);
export type ParsedProcessEnv = z.infer<typeof ProcessEnvSchema>;

const parsedEnv = (
  typeof window === 'undefined'
    ? ProcessEnvSchema.parse(compiledProcessEnv)
    : ClientSideEnvSchema.parse(compiledProcessEnv)
) as ParsedProcessEnv;

const PROCESS_ENV = new Proxy(parsedEnv, {
  get: (target, prop) => {
    if (typeof prop !== 'string') {
      return undefined;
    }

    if (!(typeof window === 'undefined') && !prop.startsWith('NEXT_PUBLIC_'))
      throw new Error('Accessing non-public environment variables is not allowed in the browser');

    return target[prop as keyof typeof target];
  },
});

export default PROCESS_ENV;
