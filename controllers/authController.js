const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => {
	return jwt.sign({id}, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	})
}

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (ctx) => {
	try {
		const {name, email, password} = ctx.request.body

		// Validation
		if (!name || !email || !password) {
			ctx.status = 400
			ctx.body = {
				success: false,
				message:
					'Please provide all required fields: name, email, and password',
			}
			return
		}

		// Check if user already exists
		const existingUser = await User.findOne({email})
		if (existingUser) {
			ctx.status = 400
			ctx.body = {
				success: false,
				message: 'User with this email already exists',
			}
			return
		}

		// Create user
		const user = await User.create({
			name,
			email,
			password,
		})
		const token = generateToken(user._id)
		ctx.status = 201
		ctx.body = {
			success: true,
			message: 'User signed up successfully',
			data: {
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					createdAt: user.createdAt,
				},
				token,
			},
		}
	} catch (error) {
		ctx.status = 500
		ctx.body = {
			success: false,
			message: 'Error creating user',
			error: error.message,
		}
	}
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (ctx) => {
	try {
		const {email, password} = ctx.request.body

		// Validation
		if (!email || !password) {
			ctx.status = 400
			ctx.body = {
				success: false,
				message: 'Please provide email and password',
			}
			return
		}

		// Check if user exists (include password for comparison)
		const user = await User.findOne({email}).select('+password')
		if (!user) {
			ctx.status = 401
			ctx.body = {
				success: false,
				message: 'Invalid credentials',
			}
			return
		}

		// Check if password matches
		const isPasswordMatch = await user.comparePassword(password)
		if (!isPasswordMatch) {
			ctx.status = 401
			ctx.body = {
				success: false,
				message: 'Invalid credentials! Incorrect password',
			}
			return
		}

		// Check if user is active
		if (!user.isActive) {
			ctx.status = 403
			ctx.body = {
				success: false,
				message: 'Account is deactivated. Please contact support.',
			}
			return
		}
		// Generate token
		const token = generateToken(user._id)
		ctx.status = 200
		ctx.body = {
			success: true,
			message: 'Login successful',
			data: {
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
				token,
			},
		}
	} catch (error) {
		ctx.status = 500
		ctx.body = {
			success: false,
			message: 'Error during login',
			error: error.message,
		}
	}
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (ctx) => {
	try {
		const user = ctx.state.user
		ctx.status = 200
		ctx.body = {
			success: true,
			data: {
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					isActive: user.isActive,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
				},
			},
		}
	} catch (error) {
		ctx.status = 500
		ctx.body = {
			success: false,
			message: 'Error fetching user profile',
			error: error.message,
		}
	}
}

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (ctx) => {
	try {
		const users = await User.find({}).select('-password').sort({createdAt: -1})

		ctx.status = 200
		ctx.body = {
			success: true,
			count: users.length,
			data: {
				users: users.map((user) => ({
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					isActive: user.isActive,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
				})),
			},
		}
	} catch (error) {
		ctx.status = 500
		ctx.body = {
			success: false,
			message: 'Error fetching users',
			error: error.message,
		}
	}
}

// @desc    Update user role (Admin only)
// @route   PATCH /api/auth/users/:id/role
// @access  Private/Admin
const updateUserRole = async (ctx) => {
	try {
		const {id} = ctx.params
		const {role} = ctx.request.body

		// Validation
		if (!role || !['user', 'admin'].includes(role)) {
			ctx.status = 400
			ctx.body = {
				success: false,
				message: 'Please provide a valid role (user or admin)',
			}
			return
		}

		// Check if user exists
		const user = await User.findById(id)
		if (!user) {
			ctx.status = 404
			ctx.body = {
				success: false,
				message: 'User not found',
			}
			return
		}

		// Update role
		user.role = role
		await user.save()

		ctx.status = 200
		ctx.body = {
			success: true,
			message: 'User role updated successfully',
			data: {
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
			},
		}
	} catch (error) {
		ctx.status = 500
		ctx.body = {
			success: false,
			message: 'Error updating user role',
			error: error.message,
		}
	}
}

module.exports = {
	signup,
	login,
	getMe,
	getAllUsers,
	updateUserRole,
}
