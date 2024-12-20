import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/products';
const API_Category ='http://localhost:3000/api/v1/categories';

// Function to submit product URL
export const submitProductURL = async (url) => {
  try {
    const response = await axios.post(API_URL, { url });
    return response.data;
  } catch (error) {
    throw new Error("Failed to submit URL. Please try again.");
  }
};
export const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch products. Please try again.");
    }
  };

  export const fetchCategories = async () => {
    try {
      const response = await axios.get(API_Category);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch category. Please try again.");
    }
  };
  
  
