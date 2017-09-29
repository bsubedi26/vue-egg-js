/**
 * Team; currently useless, can be designed for the outer layer of the group
 */
module.exports = mongoose => {
  const { ObjectId } = mongoose.Schema.Types
  const TeamSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    },
    creator: {
      type: ObjectId,
      required: true
    },
    manager: {
      type: ObjectId,
      required: true
    },
    operator: [ ObjectId ],
    createTime: {
      type: Date,
      default: Date.now
    },
    modifiedTime: {
      type: Date,
      default: Date.now
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  })
  return mongoose.model('Team', TeamSchema)
}
