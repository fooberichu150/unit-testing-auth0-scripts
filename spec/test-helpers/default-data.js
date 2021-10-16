const defaultConfig = {
	outbound_request_timeout: 100
};

const defaultHelpers = {
    getOutboundRequestTimeout: () => {
        return Number(defaultConfig.outbound_request_timeout);
    },
    getQueryValue: (key, context) => {
        const value = (context.request && context.request.query && context.request.query[key]) ||
            (context.request && context.request.body && context.request.body[key]);

        return value;
    }
};

const defaultUser = {
    'name': 'jdoe@foobar.com',
    'email': 'jdoe@foobar.com',
    'user_id': 'auth0|0123456789',
};

const defaultRuleContext = {
    'clientID': '123456789',
    'clientName': 'MyWebApp',
    'connection': 'MyDbConn',
    'connectionStrategy': 'auth0',
    'protocol': 'oidc-basic-profile',
    'accessToken': {}
};

module.exports = { defaultConfig, defaultRuleContext, defaultHelpers, defaultUser };
