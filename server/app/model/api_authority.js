module.exports = mongoose => {
  const { ObjectId } = mongoose.Schema.Types
  const ApiAuthoritySchema = mongoose.Schema({
    apiId: {
      type: ObjectId,
      unique: true,
      ref: 'api'
    },
    operation: { // edit permission
      mode: {
        type: Number,
        default: 0  // 0 - all, 1 - group, 2 - designated person
      },
      operator: {
        type: [ ObjectId ],
        default: []
      }
    },
    createTime: {
      type: Date,
      default: Date.now
    },
    modifiedTime: {
      type: Date,
      default: Date.now
    }
  })

  return mongoose.model('ApiAuthority', ApiAuthoritySchema)
}
