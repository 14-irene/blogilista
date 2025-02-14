const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  passwordHash: String,
  notes: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Note' } ]
})

userSchema.set('toJSON', {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString()
    delete retObj._id
    delete retObj.__v
    delete retObj.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
