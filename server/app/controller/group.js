const assert = require('http-assert')

module.exports = app => {
  class GroupController extends app.Controller {
    * update () {
      const { id } = this.ctx.params
      const group = this.ctx.request.body
      delete group._id
      const rs = yield this.service.group.update(id, group)
      if (rs && rs._id) {
        this.success(rs)
      } else {
        this.error('更新失败')
      }
    }
    * getAll () {
      const resources = yield this.service.group.getReadableGroups()
      this.ctx.body = { resources }
      this.ctx.status = 200
    }
    * get () {
      let { limit = 20, page = 1, q = '.*' } = this.ctx.query
      page = Number(page)
      limit = Number(limit)
      const reg = new RegExp(`.*${q}.*`, 'i')
      const cond = {
        isDeleted: false,
        name: reg
      }
      const resources = yield app.model.group
                                       .find(cond)
                                       .sort({ modifiedTime: -1, createTime: -1 })
                                       .skip((page - 1) * limit)
                                       .limit(limit)
                                       .exec()
      const count = yield app.model.group.find(cond).count().exec()
      this.ctx.body = { resources, pages: { limit, page, count } }
      this.ctx.status = 200
    }
    * getManageGroup () {
      this.ctx.body = yield this.service.group.getManageGroup()
    }
    * getUnmanaged () {
      this.ctx.body = yield this.service.group.getUnmanaged()
    }
    * claim () {
      // Claim the group, the history of the problem, you can ignore this interface
      const groupId = this.ctx.params.id
      this.ctx.body = yield this.service.group.claim(groupId)
    }
    * create () {
      const { body } = this.ctx.request
      assert(body.name, 403, 'required group name')
      const resources = yield this.service.group.create(body)
      this.ctx.body = { resources }
    }
    * delete () {
      const { id } = this.ctx.params
      const rs = yield this.service.group.delete(id)
      if (!rs) {
        this.error('无权删除')
      }
      // it should be deleted first api and then delete the group,
      // but api here can not do permissions, hence the temporary implementation
      yield this.service.api.deleteGroupApis(id)
      this.ctx.status = 204
    }
  }
  return GroupController
}
