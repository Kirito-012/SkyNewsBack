const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (ctx, next) => {
	try {
		// Get token from header
		const token = ctx.headers.authorization?.replace('Bearer ', '')

		if (!token) {
			ctx.status = 401
			ctx.body = {
				success: false,
				message: 'Unauthorized! No token provided',
			}
			return
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		const user = await User.findById(decoded.id).select('-password')

		if (!user) {
			ctx.status = 401
			ctx.body = {
				success: false,
				message: 'Unauthorized! User not found',
			}
			return
		}
		ctx.state.user = user
		await next()
	} catch (error) {
		ctx.status = 401
		ctx.body = {
			success: false,
			message: 'Token is not valid',
			error: error.message,
		}
	}
}

// Middleware to check if user is admin
const isAdmin = async (ctx, next) => {
	if (ctx.state.user.role !== 'admin') {
		ctx.status = 403
		ctx.body = {
			success: false,
			message: 'Access denied! Admin privileges required.',
		}
		return
	}
	await next()
}

module.exports = {
	auth,
	isAdmin,
	protect: auth, // Alias for auth
	adminOnly: isAdmin, // Alias for isAdmin
}
