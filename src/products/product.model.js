import mongoose from "mongoose";
import Category from '../category/category.model.js';

const ProductSchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantityInStock: {
        type: Number,
        required: true,
    },
    sales: {
        type: Number,
        default: 0,
    },
    state: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Product', ProductSchema);