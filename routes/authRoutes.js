const Router = require('koa-router')
const {
	signup,
	login,
	getMe,
	getAllUsers,
	updateUserRole,
} = require('../controllers/authController')
const {auth, isAdmin} = require('../middleware/auth')

const router = new Router({
	prefix: '/api/auth',
})

// Public routes
router.post('/signup', signup)
router.post('/login', login)

// Protected routes
router.get('/me', auth, getMe)

// Admin routes
router.get('/users', auth, isAdmin, getAllUsers)
router.patch('/users/:id/role', auth, isAdmin, updateUserRole)

module.exports = router
