function setGlobalWithSharedFunctions(user, context, callback) {
  const LOG_PREFIX = '[SHARED_FUNCTIONS]';

  global.helpers = global.helpers || {
    getOutboundRequestTimeout: () => {
      return Number(configuration.outbound_request_timeout || 5000);
    },
    getQueryValue: (key, context) => {
      const value =
        (context.request &&
          context.request.query &&
          context.request.query[key]) ||
        (context.request && context.request.body && context.request.body[key]);

      return value;
    },
  };

  // Debug logging
  global.DEBUG = global.DEBUG || (configuration.DEBUG ? console.log : function () {});

  global.DEBUG(LOG_PREFIX, 'Shared functions defined');
  callback(null, user, context);
}
