async function doSomethingElse(user, context, callback) {
  const LOG_PREFIX = '[DO_SOMETHING_ELSE]';

  global.DEBUG(LOG_PREFIX, 'Doing something else');
  try {
    var response = await internalSomething();

    if (response.status === 200) {
      DEBUG(LOG_PREFIX, 'Successfully did something else');
      callback(null, user, context);
    } else if (response.status === 404) {
      DEBUG(LOG_PREFIX, `Failed to do something else because it doesn't exist`);
      callback(new Error());
    } else {
      const body = response.data;
      DEBUG(LOG_PREFIX, 'Failed to do something else', JSON.stringify(body));
      callback(new Error());
    }
  } catch (error) {
    DEBUG(LOG_PREFIX, 'Failed to do something else', error);
    callback(error);
  }

  /* FUNCTION DECLARATIONS */
  async function internalSomething() {
    const timeout = global.helpers.getOutboundRequestTimeout();
    const axios = require('axios').default;

    const response = await axios
      .get('https://www.fakeurl.com', { timeout, validateStatus: (status) => true })
      .catch((err) => {
        let message = 'Unable to get something. Please try again in a few minutes.';
        if (!err.response && err && err.code === 'ECONNABORTED') {
          message = 'Request timed out. Please try again in a few minutes.';
        }

        global.DEBUG(LOG_PREFIX, 'Request error ', err && err.message);
        return err.response || { status: null, data: { message } };
      });

    return response;
  }
}
