const Category = require('../models/Category')

/**
 * @route   POST /api/categories
 * @desc    Add a new category
 * @access  Private (Admin only)
 */
const addCategory = async (ctx) => {
	try {
		const {name, description, color} = ctx.request.body

		console.log('Received category data:', {name, description, color})

		// Validate required fields
		if (!name) {
			ctx.status = 400
			ctx.body = {
				success: false,
				message: 'Please provide a category name',
			}
			return
		}

		if (!color) {
			ctx.status = 400
			ctx.body = {
				success: false,
				message: 'Please provide a color',
			}
			return
		}

		// Check if category already exists
		const existingCategory = await Category.findOne({name: name.trim()})
		if (existingCategory) {
			ctx.status = 400
			ctx.body = {
				success: false,
				message: 'Category already exists',
			}
			return
		}

		// Create category
		const category = await Category.create({
			name: name.trim(),
			description: description?.trim() || '',
			color: color,
		})

		ctx.status = 201
		ctx.body = {
			success: true,
			message: 'Category added successfully',
			data: category,
		}
	} catch (error) {
		console.error('Add category error:', error)
		console.error('Error stack:', error.stack)
		ctx.status = 500
		ctx.body = {
			success: false,
			message: error.message || 'Failed to add category',
		}
	}
}

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
const getAllCategories = async (ctx) => {
	try {
		const categories = await Category.find({isActive: true}).sort({name: 1})

		ctx.status = 200
		ctx.body = {
			success: true,
			data: categories,
		}
	} catch (error) {
		console.error('Get categories error:', error)
		ctx.status = 500
		ctx.body = {
			success: false,
			message: error.message || 'Failed to fetch categories',
		}
	}
}

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID
 * @access  Public
 */
const getCategoryById = async (ctx) => {
	try {
		const category = await Category.findById(ctx.params.id)

		if (!category) {
			ctx.status = 404
			ctx.body = {
				success: false,
				message: 'Category not found',
			}
			return
		}

		ctx.status = 200
		ctx.body = {
			success: true,
			data: category,
		}
	} catch (error) {
		console.error('Get category error:', error)
		ctx.status = 500
		ctx.body = {
			success: false,
			message: error.message || 'Failed to fetch category',
		}
	}
}

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Private (Admin only)
 */
const updateCategory = async (ctx) => {
	try {
		const {name, description, color, isActive} = ctx.request.body

		const category = await Category.findById(ctx.params.id)

		if (!category) {
			ctx.status = 404
			ctx.body = {
				success: false,
				message: 'Category not found',
			}
			return
		}

		// Check if new name conflicts with existing category
		if (name && name.trim() !== category.name) {
			const existingCategory = await Category.findOne({name: name.trim()})
			if (existingCategory) {
				ctx.status = 400
				ctx.body = {
					success: false,
					message: 'Category with this name already exists',
				}
				return
			}
		}

		// Update fields
		if (name) category.name = name.trim()
		if (description !== undefined) category.description = description.trim()
		if (color) category.color = color
		if (isActive !== undefined) category.isActive = isActive

		await category.save()

		ctx.status = 200
		ctx.body = {
			success: true,
			message: 'Category updated successfully',
			data: category,
		}
	} catch (error) {
		console.error('Update category error:', error)
		ctx.status = 500
		ctx.body = {
			success: false,
			message: error.message || 'Failed to update category',
		}
	}
}

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private (Admin only)
 */
const deleteCategory = async (ctx) => {
	try {
		const category = await Category.findById(ctx.params.id)

		if (!category) {
			ctx.status = 404
			ctx.body = {
				success: false,
				message: 'Category not found',
			}
			return
		}

		await Category.findByIdAndDelete(ctx.params.id)

		ctx.status = 200
		ctx.body = {
			success: true,
			message: 'Category deleted successfully',
		}
	} catch (error) {
		console.error('Delete category error:', error)
		ctx.status = 500
		ctx.body = {
			success: false,
			message: error.message || 'Failed to delete category',
		}
	}
}

module.exports = {
	addCategory,
	getAllCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
}
