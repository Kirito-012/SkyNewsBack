require('dotenv').config()
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const json = require('koa-json')
const logger = require('koa-logger')
const cors = require('koa2-cors')

const connectDB = require('./config/database')
const errorHandler = require('./middleware/errorHandler.js')

// Import routes
const indexRoutes = require('./routes/index')
const authRoutes = require('./routes/authRoutes')
const blogRoutes = require('./routes/blogRoutes')
const categoryRoutes = require('./routes/categoryRoutes')

// Initialize app
const app = new Koa()

// Connect to database
connectDB()

// Middleware
app.use(errorHandler)
app.use(
	cors({
		origin: function (ctx) {
			const validDomains = [
				'http://localhost:5173',
				'https://sky-news-ten.vercel.app',
			]
			if (validDomains.indexOf(ctx.request.header.origin) !== -1) {
				return ctx.request.header.origin
			}
			return validDomains[0]
		},
		// origin: '*',
		credentials: true,
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		allowHeaders: ['Content-Type', 'Authorization'],
	})
)
app.use(logger())
app.use(json())
app.use(bodyParser({jsonLimit: '50mb'})) // Increased limit for base64 images

// Routes
app.use(indexRoutes.routes()).use(indexRoutes.allowedMethods())
app.use(authRoutes.routes()).use(authRoutes.allowedMethods())
app.use(blogRoutes.routes()).use(blogRoutes.allowedMethods())
app.use(categoryRoutes.routes()).use(categoryRoutes.allowedMethods())

// Server configuration
const PORT = process.env.PORT || 3010

if (process.env.NODE_ENV !== 'production' || !process.env.PORT) {
	app.listen(PORT, () => {
		console.log(`🚀 Server running on port ${PORT}`)
		console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
		console.log(`📍 API Base URL: http://localhost:${PORT}`)
	})
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
	console.log('Unhandled Rejection! Shutting down...')
	console.error(err.name, err.message)
	process.exit(1)
})

module.exports = app.callback()
