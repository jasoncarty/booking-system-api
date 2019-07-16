import { extractToken } from './../extractToken';

describe('extractToken', () => {
  it('returns a token', () => {
    const mockToken = 'Bearer iuhas7casku6c6basc';
    expect(extractToken(mockToken)).toEqual('iuhas7casku6c6basc');
  });

  it('returns null', () => {
    const mockToken = 'iuhas7casku6c6basc';
    expect(extractToken(mockToken)).toEqual(null);
  });
});
