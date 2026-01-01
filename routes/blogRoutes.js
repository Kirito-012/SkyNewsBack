const Router = require('@koa/router')
const blogController = require('../controllers/blogController')

const router = new Router({
	prefix: '/api/blogs',
})

// Blog routes
router.post('/', blogController.addBlog)
router.get('/', blogController.getAllBlogs)
router.get('/:id', blogController.getBlogById)
router.get('/slug/:slug', blogController.getBlogBySlug)
router.put('/:id', blogController.updateBlog)
router.delete('/:id', blogController.deleteBlog)

module.exports = router
