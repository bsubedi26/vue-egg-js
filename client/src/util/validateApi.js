function isEmpty (val) {
  return !val || val.trim() === ''
}
export default (state) => {
  // const regex = new RegExp(/^((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&~+#])?$/);
  const api = state.api
  console.log('api ', api)
  let rs = {}
  if (isEmpty(api.name)) {
    rs = {
      success: false,
      msg: 'The api name cannot be empty.'
    }
  } else if (isEmpty(api.group)) {
    rs = {
      success: false,
      msg: 'The api group cannot be empty.'
    }
  } else if (!state.dslStatus.success) {
    rs = state.dslStatus
  } else {
    rs = {
      success: true
    }
  }
  return new Promise((resolve, reject) => {
    if (rs.success) {
      resolve(rs)
    } else {
      reject(rs)
    }
  })
}
