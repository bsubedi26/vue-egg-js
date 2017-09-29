module.exports = app => {
  class HomeController extends app.Controller {
    * index () {
      this.ctx.body = 'hello from home controller'
    }
  }
  return HomeController
}
