const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    reminder: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})


//register the paginate plugin
TodoSchema.plugin(mongoosePaginate);

module.exports = Todo = mongoose.model('todo', TodoSchema);