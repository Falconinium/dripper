import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

function build(prefix: string, limit: number, window: `${number} ${'s' | 'm' | 'h'}`) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    analytics: true,
    prefix: `dripper:${prefix}`,
  });
}

export const rateLimiters = {
  review: build('review', 5, '10 m'),
  favorite: build('favorite', 30, '5 m'),
  suggestion: build('suggestion', 3, '1 h'),
  claim: build('claim', 5, '1 h'),
  auth: build('auth', 10, '10 m'),
};

export type LimiterKey = keyof typeof rateLimiters;

export async function clientIdentifier(): Promise<string> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return h.get('x-real-ip') ?? 'anon';
}

export async function checkLimit(
  key: LimiterKey,
  identifier: string,
): Promise<{ ok: true } | { ok: false; retryAfterSeconds: number }> {
  const limiter = rateLimiters[key];
  if (!limiter) return { ok: true };

  const res = await limiter.limit(`${key}:${identifier}`);
  if (res.success) return { ok: true };

  const retryAfter = Math.max(1, Math.ceil((res.reset - Date.now()) / 1000));
  return { ok: false, retryAfterSeconds: retryAfter };
}
