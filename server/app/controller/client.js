const buildExampleFromSchema = require('mocker-dsl-core/lib/buildExampleFromSchema')

const sleep = ms => cb => setTimeout(cb, ms)

const BASE_TYPES = [ 'string', 'number', 'boolean', 'object', 'array' ]
module.exports = app => {
  class ClientController extends app.Controller {
    * findApi (method) {
      const id = this.ctx.params[0]
      if (id.length < 5) {
        // hack method, compatible with the old url information stored in the api
        const url = `/client/${id}`
        return yield app.model.api.findOne({ url, 'options.method': method }).exec()
      }
      return yield app.model.api.findOne({ _id: id, 'options.method': method }).exec()
    }
    * real () {
      const { _apiRealUrl, _apiMethod } = this.ctx.request.body
      if (!_apiRealUrl || !_apiMethod) {
        this.ctx.body = {
          success: false,
          message: 'The real address is empty.'
        }
      }
      // delete these two parameters, and proxy other parameters
      delete this.ctx.request.body._apiRealUrl
      delete this.ctx.request.body._apiMethod
      yield this.proxy(_apiRealUrl, _apiMethod)
    }
    * proxy (url, method) {
      const query = this.ctx.request.url.split('?')[1]
      if (query) {
        url += `?${query}`
      }
      const headers = this.ctx.headers
      delete headers.host // delete submitted header.host
      if (headers['api-cookie']) { // if the request header has this field, set the cookie
        headers.cookie = headers['api-cookie']
        delete headers['api-cookie']
      }
      const opts = method === 'get' ? {} : { // only support json format for body data
        data: this.ctx.request.body,
        headers,
        dataType: 'json'
      }
      opts.method = method
      const result = yield this.ctx.curl(url, opts)
      this.ctx.status = result.status
      delete result.headers['content-encoding'] // set the gzip encoding, the forwarding request will be wrong, first cancel the request header
      this.ctx.set(result.headers)
      this.ctx.body = result.data
    }
    * handleProxy (api) { // if the url has _mockProxyStatus, the proxy forwarding is turned on
      const { _mockProxyStatus } = this.ctx.request.query
      if (api.options.proxy.mode === 1 || _mockProxyStatus === '1') { // proxy forwarding line
        yield this.proxy(api.prodUrl, api.options.method)
        return true
      }
      if (api.options.proxy.mode === 2 || _mockProxyStatus === '2') { // proxy forwarding test
        yield this.proxy(api.devUrl, api.options.method)
        return true
      }
      return false
    }
    * handleRequest (api) {
      if (!api) {
        return
      }
      if (yield this.handleProxy(api)) {
        return
      }
      const delay = api.options.delay || 0
      yield sleep(delay)
      this.validateParams(api)
      this.ctx.body = this.getResponse(api) || {}
    }
    getResponse (api) {
      if (api.options.response && api.options.response.length > 0) {
        const index = api.options.responseIndex
        const idx = index === -1 ? parseInt(Math.random() * api.options.response.length) : index
        const schema = api.options.response[idx]
        return buildExampleFromSchema(schema)
      } else {
        return {}
      }
    }
    // get/:id
    * show () {
      const document = yield this.findApi('get')
      yield this.handleRequest(document)
    }
    // post /
    * create () {
      const document = yield this.findApi('post')
      yield this.handleRequest(document)
    }
    // put
    * put () {
      const document = yield this.findApi('put')
      yield this.handleRequest(document)
    }
    // patch
    * patch () {
      const document = yield this.findApi('patch')
      yield this.handleRequest(document)
    }
    // delete
    * delete () {
      const document = yield this.findApi('delete')
      yield this.handleRequest(document)
    }
    getPathParams (api) { // get the RESTful style url parameter
      const pathParams = {}
      const params = (this.ctx.params[1] || '').split('/')
      api.options.params.path.forEach((p, index) => {
        pathParams[p.key] = params[index]
      })
      return pathParams
    }
    getValidatorType (method, paramType) {
      // if the argument is submitted in query or x-www-form-urlencoded mode,
      // allow the string-formatted number with the boolean value
      const isUnstrict = method === 'query' || this.ctx.header['content-type'].indexOf('x-www-form-urlencoded')
      if (isUnstrict && ['number', 'boolean'].indexOf(paramType) > -1) {
        return `unstrict_${paramType}`
      }
      return paramType
    }
    validateParams (api) {
      const data = {
        query: this.ctx.request.query,
        body: this.ctx.request.body,
        path: this.getPathParams(api)
      }
      const { params, method } = api.options
      for (const name in params) {
        const rule = {}
        // get request does not check body
        if (method === 'get' && name === 'body') continue
        params[name].forEach(param => {
          // the parameter does not exist or the parameter type does not belong to the base type
          if (!param.key || BASE_TYPES.indexOf(param.type) === -1) return
          rule[param.key] = {
            type: this.getValidatorType(name, param.type),
            required: param.required,
            allowEmpty: param.type === 'string'
          }
        })
        this.ctx.validate(rule, data[name])
      }
    }
  }

  // digital Verification - allows the submission of numbers in string format
  app.validator.addRule('unstrict_number', (rule, value) => {
    if (value && !isNaN(value)) {
      value = Number(value)
    }
    if (typeof value !== 'number') {
      return 'should be a number'
    }
  })
  app.validator.addRule('unstrict_boolean', (rule, value) => {
    if (typeof value === 'boolean') return
    if (value === 'false' || value === 'true') return
    return 'should be a boolean'
  })

  return ClientController
}
