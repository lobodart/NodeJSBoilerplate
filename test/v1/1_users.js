var mocha = require('mocha');
var request = require('supertest');
var should = require('should');
var app = require('../..');

var models = require('app/models');

app._session = {};

describe('Testing Users', function(){
	before(function(done) {
		models.User.remove({}, function(err, res) {
			if (err) return done(err);
			done();
		});
	});

	describe('POST /users', function(){
		var uri = '/api/v1/users';

		it('Request without any parameters', function(done){
			request(app)
			.post(uri)
			.expect({
				error: 'missing_username_parameter'
			})
			.expect(400, done);
		});

		it('Request without password', function(done){
			request(app)
			.post(uri)
			.field('username', 'jdoe')
			.expect({
				error: 'missing_password_parameter'
			})
			.expect(400, done);
		});

		it('Request with password too short', function(done){
			request(app)
			.post(uri)
			.field('username', 'jdoe')
			.field('password', 'test')
			.expect({
				error: 'password_too_short'
			})
			.expect(400, done);
		});

		it('Request with wrong email format', function(done){
			request(app)
			.post(uri)
			.field('username', 'jdoe')
			.field('password', '123456')
			.field('email', 'jdoe.test')
			.expect({
				error: 'invalid_email'
			})
			.expect(400, done);
		});

		it('Success request', function(done){
			request(app)
			.post(uri)
			.field('username', 'jdoe')
			.field('password', '123456')
			.expect(201, done);
		});

		it('Email taken request', function(done){
			request(app)
			.post(uri)
			.field('username', 'jdoe')
			.field('password', '123456')
			.expect({
				error: 'username_exists'
			})
			.expect(409, done);
		});
	});

	describe('POST /auth', function(){
		var uri = '/api/v1/auth';

		it('Request without any parameters', function(done){
			request(app)
			.post(uri)
			.expect({
				error: 'missing_username_parameter'
			})
			.expect(400, done);
		});

		it('Request without password', function(done){
			request(app)
			.post(uri)
			.set('Content-Type', 'application/json')
			.send({
				username: 'jdoe'
			})
			.expect({
				error: 'missing_password_parameter'
			})
			.expect(400, done);
		});

		it('Request with wrong username/password', function(done){
			request(app)
			.post(uri)
			.set('Content-Type', 'application/json')
			.send({
				username: 'fail',
				password: 'failpassword'
			})
			.expect({
				error: 'invalid_auth'
			})
			.expect(401, done);
		});

		it('Request with wrong password', function(done){
			request(app)
			.post(uri)
			.set('Content-Type', 'application/json')
			.send({
				username: 'jdoe',
				password: 'failpassword'
			})
			.expect({
				error: 'invalid_auth'
			})
			.expect(401, done);
		});

		it('Success request', function(done){
			request(app)
			.post(uri)
			.set('Content-Type', 'application/json')
			.send({
				username: 'jdoe',
				password: '123456'
			})
			.expect(200, done)
			.expect(function(res) {
				res.body.should.match(/[a-z0-9]+/);
				app._session.token = res.body.token;
			});
		});
	});

	describe('GET /users/me', function(){
		var uri = '/api/v1/users/me';

		describe('Testing \'auth\' middleware (happens once)', function(){
			it('Without token prefix', function(done){
				request(app)
				.get(uri)
				.set('Authorization', 'tokenfail')
				.expect(401, done);
			});

			it('With wrong prefix', function(done){
				request(app)
				.get(uri)
				.set('Authorization', 'fakeprefix tokenfail')
				.expect(401, done);
			});

			it('With wrong token', function(done){
				request(app)
				.get(uri)
				.set('Authorization', 'token tokenfail')
				.expect(401, done);
			});
		});

		describe('Testing route', function(){
			it('Success request', function(done){
				request(app)
				.get(uri)
				.set('Authorization', 'token ' + app._session.token)
				.expect(200, done);
			});
		});
	});
});
