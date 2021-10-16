describe('rule: do-something-else', function () {
	const axios = require('axios').default;
	const MockAdapter = require('axios-mock-adapter');

	const _ = require('lodash');
	const { defaultRuleContext, defaultHelpers, defaultUser } = require('../test-helpers/default-data');
	const { flushPromises, setGlobals, restoreGlobals } = require('../test-helpers/helpers');
	const runFile = require('../test-helpers/vm-context-helpers');
	const LOG_PREFIX = '[DO_SOMETHING_ELSE]';

	let testUser, testContext, mockAxios;

	beforeEach(function () {
		testUser = _.merge({}, defaultUser);
		testContext = _.cloneDeep(defaultRuleContext);

		setGlobals();
		global.helpers = defaultHelpers;
		global.require = require;

		// create axios mock
		mockAxios = new MockAdapter(axios);
		spyOn(console, 'log');
	})

	afterEach(function () {
		restoreGlobals();
		global.require = undefined;

		// restore axios mock
		mockAxios.restore();
	})

	it('succeeds doing something else', async () => {
		// arrange
		let specUser = _.merge({}, testUser);
		let statusCode = 200;

		let callback = (err, user, context) => {
			expect(err).toBeNull();
		};

		mockAxios.onGet(/fakeurl/).reply(statusCode);

		// act
		runFile({
			filePath: `./Tenant.Configuration/rules/do-something-else.js`,
			fileName: 'do-something-else.js'
		}, specUser, testContext, callback);

		await flushPromises();

		// assert
		expect(console.log).toHaveBeenCalledWith(LOG_PREFIX, 'Doing something else');
		expect(console.log).toHaveBeenCalledWith(LOG_PREFIX, 'Successfully did something else');
	});

	it('returns 404 and error for not found', async () => {
		// arrange
		let specUser = _.merge({}, testUser);
		let statusCode = 404;

		let callback = (err, user, context) => {
			expect(err).toBeTruthy();
			expect(err).toBeInstanceOf(Error);
			expect(user).toBeUndefined();
			expect(context).toBeUndefined();
		};

		mockAxios.onGet(/fakeurl/).reply(statusCode);

		// act
		runFile({
			filePath: `./Tenant.Configuration/rules/do-something-else.js`,
			fileName: 'do-something-else.js'
		}, specUser, testContext, callback);

		await flushPromises();

		// assert
		expect(console.log).toHaveBeenCalledWith(LOG_PREFIX, 'Doing something else');
		expect(console.log).toHaveBeenCalledWith(LOG_PREFIX, `Failed to do something else because it doesn't exist`);
	});

	it('returns error for other errors', async () => {
		// arrange
		let specUser = _.merge({}, testUser);
		let statusCode = 500;
		let serverError = 'no soup for you';

		let callback = (err, user, context) => {
			expect(err).toBeTruthy();
			expect(err).toBeInstanceOf(Error);
			expect(user).toBeUndefined();
			expect(context).toBeUndefined();
		};

		mockAxios.onGet(/fakeurl/).reply(statusCode, { message: serverError });

		// act
		runFile({
			filePath: `./Tenant.Configuration/rules/do-something-else.js`,
			fileName: 'do-something-else.js'
		}, specUser, testContext, callback);

		await flushPromises();

		// assert
		expect(console.log).toHaveBeenCalledWith(LOG_PREFIX, 'Doing something else');
		expect(console.log).toHaveBeenCalledWith(LOG_PREFIX, `Failed to do something else`, JSON.stringify({ message: serverError }));
	});

	it('returns error for timeout error', async () => {
		// arrange
		let specUser = _.merge({}, testUser);
		let serverError = 'Request timed out. Please try again in a few minutes.';

		let callback = (err, user, context) => {
			expect(err).toBeTruthy();
			expect(err).toBeInstanceOf(Error);
			expect(user).toBeUndefined();
			expect(context).toBeUndefined();
		};

		mockAxios.onGet(/fakeurl/).timeout();

		// act
		runFile({
			filePath: `./Tenant.Configuration/rules/do-something-else.js`,
			fileName: 'do-something-else.js'
		}, specUser, testContext, callback);

		await flushPromises();

		// assert
		expect(console.log).toHaveBeenCalledWith(LOG_PREFIX, `Request error `, 'timeout of 100ms exceeded');
		expect(console.log).toHaveBeenCalledWith(LOG_PREFIX, `Failed to do something else`, JSON.stringify({ message: serverError }));
	});

	it('returns error for network error', async () => {
		// arrange
		let specUser = _.merge({}, testUser);
		let serverError = 'Unable to get something. Please try again in a few minutes.';

		let callback = (err, user, context) => {
			expect(err).toBeTruthy();
			expect(err).toBeInstanceOf(Error);
			expect(user).toBeUndefined();
			expect(context).toBeUndefined();
		};

		mockAxios.onGet(/fakeurl/).networkError();

		// act
		runFile({
			filePath: `./Tenant.Configuration/rules/do-something-else.js`,
			fileName: 'do-something-else.js'
		}, specUser, testContext, callback);

		await flushPromises();

		// assert
		expect(console.log).toHaveBeenCalledWith(LOG_PREFIX, `Request error `, 'Network Error');
		expect(console.log).toHaveBeenCalledWith(LOG_PREFIX, `Failed to do something else`, JSON.stringify({ message: serverError }));
	});
});