import Axios from 'axios';

export const getApiData = (searchText, cbSuccess, cbError) => {
  const key = process.env.REACT_APP_OMDB_API_KEY;
  let url = `http://www.omdbapi.com/?apikey=${key}&s=${searchText}&page=1`;
  //console.log('getOmdbApiData-url', url);

  Axios.get(url)
    .then(({data}) => {
      if (data.Response.toLowerCase() === 'false') {
        cbError(data.Error);
        return;
      }

      let newList = data.Search;
      cbSuccess(newList);
    })
    .catch(err => cbError(err));  
}
