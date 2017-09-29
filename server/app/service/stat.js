module.exports = app => {
  const API_BEHAVIOR_MOCK = 1 // data statistics behavior => request mock data

  class Stat extends app.Service {
    // Save the data method asynchronously
    saveApiStat (apiId, behavior, result) {
      return app.model.apiStat({
        apiId,
        behavior,
        result
      }).save()
    }
    requestApi (apiId, status, msg) {
      return this.saveApiStat(apiId, API_BEHAVIOR_MOCK, {
        status,
        msg
      })
    }
    getMockStat (start, end) {
      return app.model.apiStat.aggregate([
        {
          $match: {
            behavior: API_BEHAVIOR_MOCK,
            createDay: {
              $gte: start,
              $lte: end
            }
          }
        },
        {
          $group: {
            _id: '$createDay',
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    }
  }
  return Stat
}
