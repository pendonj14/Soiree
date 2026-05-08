import { describe, it, expect, vi } from 'vitest';
import { adminOnly } from '../middleware/admin.middleware.js';

const makeReq = (role) => ({ user: { role } });
const res = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
};
const next = vi.fn();

describe('adminOnly middleware', () => {
  it('calls next() when role is admin', () => {
    res.status.mockClear(); next.mockClear();
    adminOnly(makeReq('admin'), res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 403 when role is user', () => {
    res.status.mockClear(); next.mockClear();
    adminOnly(makeReq('user'), res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when req.user is missing', () => {
    res.status.mockClear(); next.mockClear();
    adminOnly({}, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
