/**
	Add your routes in the function defined below.
*/
module.exports = function(router) {
	router.use('/users', require('./users'));
};
