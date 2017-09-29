module.exports = mongoose => {
  const { ObjectId } = mongoose.Schema.Types
  const GroupSchema = new mongoose.Schema({
    teamId: {
      type: ObjectId,
      required: false
    },
    creator: {
      type: ObjectId,
      required: true
    },
    manager: {
      type: ObjectId,
      required: true
    },
    member: [ ObjectId ],
    operation: {
      type: Number,
      default: 0 // 0 - all operable, 1 - group members are operational
    },
    privacy: {
      type: Number,
      default: 0 // // 0 - visible to all, 1 - visible to group members, 3 - visible only to yourself
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    level: { // level of the group, the default first level, reserved field
      type: Number,
      required: true,
      default: 1
    },
    createTime: {
      type: String,
      default: Date.now
    },
    modifiedTime: {
      type: String,
      default: Date.now
    },
    desc: String, // packet description, reserved field, temporarily useless.
    isDeleted: {
      type: Boolean,
      default: false
    }
  })
  return mongoose.model('Group', GroupSchema)
}
