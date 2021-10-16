function disabledRule(user, context, callback) {
  const LOG_PREFIX = '[DISABLED_RULE]';

  global.DEBUG(LOG_PREFIX, 'Doing something disabled');
  callback(null, user, context);
}
