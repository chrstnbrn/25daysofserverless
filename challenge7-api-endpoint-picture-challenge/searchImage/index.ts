import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import axios from 'axios';

const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const searchTerm = req.query.searchTerm;

  if (searchTerm) {
    const imageUrl = await getImageUrl(searchTerm);
    if (imageUrl) {
      const image = await getImage(imageUrl);
      context.res = {
        headers: { "Content-Type": "image/jpeg" },
        body: image
      };
    } else {
      context.res = {
        status: 404
      };
    }
  } else {
    context.res = {
      status: 400,
      body: "Please pass searchTerm as a query parameter"
    };
  }
};

async function getImageUrl(searchTerm: string): Promise<string> {
  const url = `https://api.unsplash.com/search/photos?query=${searchTerm}`;
  const response = await axios.get<SearchPhotosResponse>(url, {
    headers: {
      Authorization: `Client-ID ${unsplashAccessKey}`
    }
  });
  return response.data.results[0]?.urls.raw;
}

async function getImage(imageUrl: string): Promise<Buffer> {
  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer"
  });
  return response.data;
}

interface SearchPhotosResponse {
  results: SearchPhotoResult[];
}

interface SearchPhotoResult {
  id: string;
  urls: {
    raw: string;
  };
}

export default httpTrigger;
