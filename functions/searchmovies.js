const axios = require('axios');

exports.handler = function (event, context, callback) {
  const { key } = process.env;

  const { queryStringParameters } = event;
  const searchString = queryStringParameters['query'];

  const MAIN_API_ENDPOINT = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${searchString}`;

  //Send user response
  const send = (body) => {
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Acess-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type,Accept',
      },
      body: JSON.stringify(body),
    });
  };

  // Perform API calls
  const searchMovies = () => {
    axios
      .get(MAIN_API_ENDPOINT)
      .then((res) => send(res.data.results))
      .catch((err) => send(err));
  };

  searchMovies();
};
