const axios = require('axios');

exports.handler = function (event, context, callback) {
  const { key } = process.env;

  const imgUrl = `https://api.themoviedb.org/3/configuration?api_key=${key}`;

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
  const getImgs = () => {
    axios
      .get(imgUrl)
      .then((res) => send(res.data))
      .catch((err) => send(err));
  };

  getImgs();
};
