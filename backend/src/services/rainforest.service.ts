import axios from 'axios';

export const fetchRainforestProductData = async (url: string, retries = 2): Promise<{ price: number, name: string }> => {
  const apiKey = process.env.RAINFOREST_API_KEY;
  if (!apiKey) {
    throw new Error('RAINFOREST_API_KEY is not defined in environment variables.');
  }

  // Clean the URL to remove long tracking query parameters that might cause issues
  let cleanUrl = url;
  try {
    const parsedUrl = new URL(url);
    cleanUrl = parsedUrl.origin + parsedUrl.pathname;
  } catch (e) {
    // ignore
  }

  try {
    const response = await axios.get('https://api.rainforestapi.com/request', {
      params: {
        api_key: apiKey,
        type: 'product',
        url: cleanUrl
      },
      timeout: 15000 // 15 seconds timeout
    });

    const data = response.data;
    
    if (data.request_info && data.request_info.success === false) {
      throw new Error(`Rainforest API Error: ${data.request_info.message}`);
    }
    
    let price = data.product?.buybox_winner?.price?.value || 
                data.product?.prices?.[0]?.value || 
                data.product?.price;
                
    if (typeof price !== 'number') {
      if (typeof price === 'string') {
        price = parseFloat(price.replace(/[^0-9.]/g, ''));
      }
    }

    if (!price || isNaN(price)) {
      throw new Error(`Could not parse price from Rainforest API response for URL: ${cleanUrl}`);
    }

    const name = data.product?.title || 'Unknown Product';

    return { price, name };
  } catch (error: any) {
    // Retry on network errors (like ENOTFOUND, ETIMEDOUT)
    if (retries > 0 && (!error.response || error.code === 'ENOTFOUND' || error.code === 'ECONNABORTED')) {
      console.log(`Network error occurred, retrying... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchRainforestProductData(url, retries - 1);
    }

    if (error.response?.data?.request_info?.message) {
      throw new Error(`API Error: ${error.response.data.request_info.message}`);
    }
    if (error.code === 'ENOTFOUND') {
      throw new Error('Network error: Could not reach the Rainforest API servers.');
    }
    throw new Error(error.message || 'Failed to fetch product data from Rainforest API.');
  }
};
