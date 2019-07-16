export const extractToken = (authHeader: string): string => {
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7, authHeader.length);
  }
  return null;
};
