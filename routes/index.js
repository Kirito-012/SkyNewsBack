const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx) => {
	ctx.body = {
		success: true,
		message: 'API is running',
		timestamp: new Date().toISOString(),
	}
})

router.get('/health', async (ctx) => {
	ctx.body = {
		success: true,
		status: 'healthy',
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	}
})

module.exports = router
