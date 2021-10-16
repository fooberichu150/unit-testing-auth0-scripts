function doSomething(user, context, callback) {
  const LOG_PREFIX = '[RULE_WITH_ERROR]';

  if (user.app_metadata && user.app_metadata.hasError) {
    global.DEBUG(LOG_PREFIX, `Gonna return an error, you can't stop me!`);
    return callback(new ValidationError('unauthorized', 'boo hoo'));
  }

  global.DEBUG(LOG_PREFIX, `No error, you can't stop me!`);
  callback(null, user, context);
}
