const axios = require('axios');

exports.handler = function (event, context, callback) {
  const { key } = process.env;

  const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US
`;

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
  const getGenres = () => {
    axios
      .get(genreUrl)
      .then((res) => send(res.data))
      .catch((err) => send(err));
  };

  getGenres();
};
