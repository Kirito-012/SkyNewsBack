const errorHandler = async (ctx, next) => {
	try {
		await next()
	} catch (error) {
		ctx.status = error.status || 500
		ctx.body = {
			success: false,
			message: error.message || 'Internal Server Error',
			...(process.env.NODE_ENV === 'development' && {stack: error.stack}),
		}
		console.error('Error:', error)
	}
}

module.exports = errorHandler
