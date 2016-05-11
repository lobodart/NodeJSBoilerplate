/**
	Add your routes in the function defined below.
*/
module.exports = function(router) {
	router.use('/', require('./api'));
	router.use('/users', require('./users'));
};
