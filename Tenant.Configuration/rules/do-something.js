function doSomething(user, context, callback) {
  const LOG_PREFIX = '[DO_SOMETHING]';

  global.DEBUG(LOG_PREFIX, 'Doing something');
  callback(null, user, context);
}
