import axios from 'axios';
import handleError from '../utils/errorHandle';

const SERVER_URL = 'http://localhost:4000';
const DEFAULT_PARAMS = {};

const baseHeaders = {
  baseURL: SERVER_URL,
  params: DEFAULT_PARAMS,
};

export const api = axios.create(baseHeaders);

export const getSearchTerms = async (searchQuery: string) => {
  const searchParams = { q: searchQuery };
  try {
    const response = await api.get('/sick', { params: searchParams });

    if (response?.status !== 200) {
      throw new Error('fail to get search terms');
    }
  } catch (error) {
    handleError(error);
  }
};
