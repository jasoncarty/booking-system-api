import { makeRequest } from './makeRequest';

export const createAdminToken = async (user: object): Promise<string> => {
  const res = await makeRequest({
    method: 'POST',
    url: '/authentication/create',
    data: user,
  });

  const {
    data: {
      data: { token },
    },
  } = res;
  return token;
};
