const { authority } = require('../../constants')
const {
    OPERATION_ALL,
    OPERATION_MEMBER,
    OPERATION_DESIGNEE
} = authority

module.exports = app => {
  class ApiAuthority extends app.Service {
    update (apiId, authority) {
      authority = (typeof authority === 'object') ? authority : {}
      authority.modifiedTime = Date.now()
      return app.model.apiAuthority.findOneAndUpdate({
        apiId
      }, authority, {
        setDefaultsOnInsert: true,
        new: true,
        upsert: true
      })
    }
    get (apiId) {
      return app.model.apiAuthority.findOne({
        apiId
      })
    }
    isWritable (authority, group, authId) {
      if (!authority) {
        return { status: true }
      }
      const { mode, operator } = authority.operation
      switch (mode) {
        case OPERATION_ALL:
          return { status: true }
        case OPERATION_MEMBER:
          return {
            status: !!group.member.find(m => m.toString() === authId),
            msg: 'Only allowed for operational members of the group.'
          }
        case OPERATION_DESIGNEE:
          return {
            status: !!operator.find(o => o.toString() === authId),
            msg: 'Only the designated person is operational'
          }
        default:
          return { status: true }
      }
    }
  }
  return ApiAuthority
}
