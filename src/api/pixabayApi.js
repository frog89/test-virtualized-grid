import Axios from 'axios';

export const getApiData = (searchText, cbSuccess, cbError) => {
  const key = process.env.REACT_APP_PIXABAY_API_KEY;
  let url = `https://pixabay.com/api/?key=${key}&q=${searchText}&image_type=photo`;
  //console.log('pixabay-getApiData-url', url);

  Axios.get(url)
    .then(({data}) => {
      //console.log('pixabay-getApiData-response:', response);

      // if (data.Response.toLowerCase() === 'false') {
      //   cbError(data.Error);
      //   return;
      // }

      let newList = data.hits;
      cbSuccess(newList);
    })
    .catch(err => cbError(err));  
}
