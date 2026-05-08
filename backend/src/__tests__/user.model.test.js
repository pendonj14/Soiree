import { describe, it, expect } from 'vitest';
import { User } from '../models/user.model.js';

describe('User model role field', () => {
  it('defaults role to "user"', () => {
    const schemaObj = User.schema.obj;
    expect(schemaObj.role.default).toBe('user');
    expect(schemaObj.role.enum).toContain('admin');
    expect(schemaObj.role.enum).toContain('user');
  });
});
