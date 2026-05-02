import { describe, expect, it } from 'vitest';

import { slugify } from './slug';

describe('slugify', () => {
  it('lowercases and replaces spaces with dashes', () => {
    expect(slugify('Café Lomi Paris')).toBe('cafe-lomi-paris');
  });

  it('strips diacritics', () => {
    expect(slugify('Çà & là')).toBe('ca-la');
  });

  it('collapses runs of non-alphanumeric chars', () => {
    expect(slugify('hello   world!!!')).toBe('hello-world');
  });

  it('trims leading and trailing dashes', () => {
    expect(slugify('--abc--')).toBe('abc');
  });

  it('truncates to 80 chars', () => {
    const long = 'a'.repeat(120);
    expect(slugify(long).length).toBe(80);
  });

  it('returns empty string for input with no alphanumerics', () => {
    expect(slugify('   ---   ')).toBe('');
  });
});
