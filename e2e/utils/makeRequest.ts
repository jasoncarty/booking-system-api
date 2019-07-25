import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

const getE2eTarget = (): string =>
  process.env.E2E_TARGET ? process.env.E2E_TARGET : 'localhost';

export const makeRequest = (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  const { url, method, headers, data, params } = config;
  const target = getE2eTarget();
  return axios.request({
    url: `http://${target}:3000${url}`,
    method,
    headers,
    data,
    params,
  });
};
