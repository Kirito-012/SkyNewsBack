const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide a category name'],
			unique: true,
			trim: true,
			maxlength: [100, 'Category name cannot be more than 100 characters'],
		},
		description: {
			type: String,
			trim: true,
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
		},
		color: {
			type: String,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
)

// Generate slug before saving
categorySchema.pre('save', function () {
	if (this.isModified('name')) {
		this.slug = this.name
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim()
	}
})

module.exports = mongoose.model('Category', categorySchema)
