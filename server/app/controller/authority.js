module.exports = app => {
  class AuthorityController extends app.Controller {
    * modifyApi () {
      const { apiId } = this.ctx.params
      const { operation } = this.ctx.request.body
      const authority = { operation }

      const isManager = yield this.service.api.isManager(apiId)
      if (!isManager) {
        this.error('You do not have the right to operate.')
      }

      const rs = yield this.service.apiAuthority.update(apiId, authority)
      if (!rs) {
        this.error('Update failed.')
      } else {
        this.success('Update completed.')
      }
    }
    * getApi () {
      const { apiId } = this.ctx.params
      const authority = (yield this.service.apiAuthority.get(apiId)) || app.model.apiAuthority()
      authority.apiId = apiId
      this.success(authority)
    }
  }
  return AuthorityController
}
