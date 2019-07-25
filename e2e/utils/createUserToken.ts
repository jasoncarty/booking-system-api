import { user } from './../factories';
import { makeRequest } from './makeRequest';

export const createUserToken = async (): Promise<string> => {
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
