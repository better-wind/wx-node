/* eslint-disable */
require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
// appID  wx5dfca9518cfe8b50
// appsecret       4ca865d65fdb9600ae5dd0f5dabcbbca
// gh_a8c3b581c6d1