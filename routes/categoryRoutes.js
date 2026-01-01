const Router = require('koa-router')
const {
	addCategory,
	getAllCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
} = require('../controllers/categoryController')
const {protect, adminOnly} = require('../middleware/auth')

const router = new Router({
	prefix: '/api/categories',
})

// Public routes
router.get('/', getAllCategories)
router.get('/:id', getCategoryById)

// Protected routes (Admin only)
router.post('/', protect, adminOnly, addCategory)
router.put('/:id', protect, adminOnly, updateCategory)
router.delete('/:id', protect, adminOnly, deleteCategory)

module.exports = router
