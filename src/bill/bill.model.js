import mongoose from 'mongoose';

const { Schema } = mongoose;

const billSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    total: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Bill = mongoose.model('Bill', billSchema);

export default Bill;