const BASE_URL = 'https://dummyjson.com';

export const getPosts = async (page = 1, limit = 10) => {
  const url = `${BASE_URL}/posts?limit=${limit}&skip=${(page * limit)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
