export default (err) => {
  if (err.response && err.response.status === 401) {
    window.location.href = '#/login'
  }
  if (!err.response) {
    return Promise.reject({
      msg: 'There was no response from the request.'
    })
  }
    // throw err;
  return Promise.reject({
    response: err.response,
    statusCode: err.response.status,
    statusText: err.response.statusText,
    msg: err.response.data.message
  })
}
