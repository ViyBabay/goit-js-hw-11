import Notiflix from 'notiflix';
import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31885049-d6faf86aacab52c89b6b918a3';

export const queryImage = async (query, page = 1) => {
  const config = {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 40,
    },
  };

  try {
    const response = await axios.get(`${BASE_URL}`, config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
