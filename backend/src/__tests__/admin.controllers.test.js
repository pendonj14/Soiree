import { describe, it, expect } from 'vitest';

const VALID_TRANSITIONS = {
  pending:  ['accepted', 'rejected'],
  accepted: ['done'],
  rejected: [],
  done:     [],
};

const canTransition = (from, to) =>
  (VALID_TRANSITIONS[from] ?? []).includes(to);

describe('reservation status transitions', () => {
  it('pending → accepted is valid', () => expect(canTransition('pending', 'accepted')).toBe(true));
  it('pending → rejected is valid', () => expect(canTransition('pending', 'rejected')).toBe(true));
  it('pending → done is invalid',   () => expect(canTransition('pending', 'done')).toBe(false));
  it('accepted → done is valid',    () => expect(canTransition('accepted', 'done')).toBe(true));
  it('accepted → rejected is invalid', () => expect(canTransition('accepted', 'rejected')).toBe(false));
  it('done → anything is invalid',  () => expect(canTransition('done', 'accepted')).toBe(false));
  it('rejected → anything is invalid', () => expect(canTransition('rejected', 'done')).toBe(false));
});
