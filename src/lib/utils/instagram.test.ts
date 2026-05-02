import { describe, expect, it } from 'vitest';

import { instagramHandle, instagramUrl } from './instagram';

describe('instagramHandle', () => {
  it('returns null on empty input', () => {
    expect(instagramHandle('')).toBeNull();
    expect(instagramHandle(null)).toBeNull();
    expect(instagramHandle(undefined)).toBeNull();
  });

  it('extracts handle from a bare username', () => {
    expect(instagramHandle('cafelomi')).toBe('cafelomi');
  });

  it('extracts handle from a username with leading @', () => {
    expect(instagramHandle('@cafelomi')).toBe('cafelomi');
  });

  it('extracts handle from a full instagram url', () => {
    expect(instagramHandle('https://instagram.com/cafelomi')).toBe('cafelomi');
    expect(instagramHandle('https://instagram.com/cafelomi/')).toBe('cafelomi');
  });
});

describe('instagramUrl', () => {
  it('returns null when no handle could be extracted', () => {
    expect(instagramUrl('')).toBeNull();
  });

  it('builds canonical url from handle', () => {
    expect(instagramUrl('@cafelomi')).toBe('https://instagram.com/cafelomi');
  });
});
