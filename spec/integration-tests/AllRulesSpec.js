describe('Auth0 Integration Tests', function () {
    const axios = require('axios').default;
    const MockAdapter = require('axios-mock-adapter');

    const fs = require('fs');
    const yaml = require('js-yaml');
    const _ = require('lodash');
    const { ValidationError } = require('../fakes/auth0-fakes');
    const { defaultRuleContext, defaultUser } = require('../test-helpers/default-data');
    const { flushPromises, setGlobals, restoreGlobals } = require('../test-helpers/helpers');
    const runFile = require('../test-helpers/vm-context-helpers');

    let testUser, testContext, mockAxios;

    const doc = yaml.load(fs.readFileSync('./Tenant.Configuration/tenant.yaml'));
    // ensure sorted by order and excluding disabled rules
    const rules = doc.rules.filter(rule => rule.enabled).sort((lhs, rhs) => lhs.order - rhs.order);

    beforeEach(function () {
        testUser = _.cloneDeep(defaultUser);
        testContext = _.cloneDeep(defaultRuleContext);

        setGlobals();
        global.require = require;
        global.ValidationError = ValidationError;

        // create axios mock
        mockAxios = new MockAdapter(axios);
        // enable .and.callThrough() to view logs
        spyOn(console, 'log');
    });

    afterEach(function () {
        restoreGlobals();
        global.ValidationError = undefined;
        global.auth0 = undefined;
        global.require = undefined;

        // restore axios mock
        mockAxios.restore();
    });

    it('executes all rules in sequence for user except refresh_token rule', async () => {
        // arrange
        let specUser = _.merge({}, testUser);

        let callback = (err, user, context) => {
            expect(err).toBeNull();
        };

        mockAxios.onAny().reply(200);

        // act
        let lastRule = null;
        rules.forEach((rule) => {
            if (lastRule) {
                expect(rule.order).toBeGreaterThan(lastRule.order);
            }

            runFile({
                filePath: `./Tenant.Configuration${rule.script.substr(1)}`,
                fileName: rule.name
            }, specUser, testContext, callback);

            lastRule = rule;
        });

        await flushPromises();

        // assert
        expect(console.log).toHaveBeenCalledWith('[SHARED_FUNCTIONS]', 'Shared functions defined');
        expect(console.log).toHaveBeenCalledWith('[DO_SOMETHING]', 'Doing something');
        // expect(console.log).toHaveBeenCalledWith('[DISABLED_RULE]', 'Doing something'); // not ran on purpose
        expect(console.log).toHaveBeenCalledWith('[RULE_WITH_ERROR]', `No error, you can't stop me!`);
        expect(console.log).toHaveBeenCalledWith('[DO_SOMETHING_ELSE]', 'Doing something else');
        expect(console.log).toHaveBeenCalledWith('[DO_SOME_REFRESH_TOKEN_STUFF]', 'ignore for non refresh_token');
    });

    it('executes rules until error on rule-with-errors', async () => {
        // arrange
        let specUser = _.merge({}, testUser, { app_metadata: { hasError: true } });

        let callbackErr = null;
        let callback = (err, user, context) => {
            if (err) {
                callbackErr = err;
            }
        };

        mockAxios.onAny().reply(200);

        // act
        for (var ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
            var rule = rules[ruleIndex];

            runFile({
                filePath: `./Tenant.Configuration${rule.script.substr(1)}`,
                fileName: rule.name
            }, specUser, testContext, callback);

            if (callbackErr) {
                break;
            }
        }

        await flushPromises();

        // assert
        expect(callbackErr).toBeInstanceOf(ValidationError);
        expect(console.log).toHaveBeenCalledWith('[SHARED_FUNCTIONS]', 'Shared functions defined');
        expect(console.log).toHaveBeenCalledWith('[DO_SOMETHING]', 'Doing something');
        // expect(console.log).toHaveBeenCalledWith('[DISABLED_RULE]', 'Doing something'); // not ran on purpose
        expect(console.log).toHaveBeenCalledWith('[RULE_WITH_ERROR]', `Gonna return an error, you can't stop me!`);
    });

    describe('for refresh_token', function () {

        it('executes all rules including refresh_token rule', async () => {
            // arrange
            let specUser = _.merge({}, testUser);
            let specContext = _.cloneDeep(testContext);
            specContext.protocol = 'oauth2-refresh-token';

            let callback = (err, user, context) => {
                expect(err).toBeNull();
            };

            mockAxios.onAny().reply(200);

            // act
            rules.forEach((rule) => {
                runFile({
                    filePath: `./Tenant.Configuration${rule.script.substr(1)}`,
                    fileName: rule.name
                }, specUser, specContext, callback);
            });

            await flushPromises();

            // assert
            expect(console.log).toHaveBeenCalledWith('[SHARED_FUNCTIONS]', 'Shared functions defined');
            expect(console.log).toHaveBeenCalledWith('[DO_SOMETHING]', 'Doing something');
            // expect(console.log).toHaveBeenCalledWith('[DISABLED_RULE]', 'Doing something'); // not ran on purpose
            expect(console.log).toHaveBeenCalledWith('[RULE_WITH_ERROR]', `No error, you can't stop me!`);
            expect(console.log).toHaveBeenCalledWith('[DO_SOMETHING_ELSE]', 'Doing something else');
            expect(console.log).toHaveBeenCalledWith('[DO_SOME_REFRESH_TOKEN_STUFF]', 'running for refresh_token');
        });
    })
});