function doSomethingRefreshTokeny (user, context, callback) {
	const LOG_PREFIX = '[DO_SOME_REFRESH_TOKEN_STUFF]';
  
	if (context.protocol !== 'oauth2-refresh-token') {
	  global.DEBUG(LOG_PREFIX, 'ignore for non refresh_token');
	  return callback(null, user, context);
	}
  
	global.DEBUG(LOG_PREFIX, 'running for refresh_token');
  }
  