/* Created By liuhuihao 2018/4/28 9:07  */
var http = require('http')
var fs = require('fs')
var path = require('path')
var url = require('url')
var Mock = require('mockjs')

var options = {
  port: 8088
}

function MockServer (options) {
  this.options = options
}

/**
 *
 */
MockServer.prototype.start = function () {
  http.createServer(function (request, response) {
    const jsonPath = path.resolve(__dirname + './../', '.' + url.parse(request.url).pathname + '')
    const tempPath = path.resolve(__dirname + './../', '.' + url.parse(request.url).pathname + '.template')

    if (fs.existsSync(jsonPath)) {
      this.responseFile(jsonPath, request, response, function (data) {
        return JSON.stringify(JSON.parse(data))
      })

    } else if (fs.existsSync(tempPath)) {
      this.responseFile(tempPath, request, response, function (data) {
        return JSON.stringify(Mock.mock(JSON.parse(data)))
      })
    } else {
      console.log('ERROR:  ' + jsonPath + ' OR ' + tempPath + ' NOT FOUND')
      this.sendError(response)
    }
  }.bind(this)).listen(this.options.port)
}

/**
 *
 * @param filePath
 * @param request
 * @param response
 * @param fileHandler
 */
MockServer.prototype.responseFile = function (filePath, request, response, fileHandler) {
  fs.readFile(filePath, 'utf-8', function (err, data) {
    if (err) {
      console.log('ERROR:  ' + 'READ ' + filePath + ' ERROR')
      this.sendError(response)
    } else {
      console.log('SUCCESS:  ' + request.url + ' --> ' + filePath)
      this.sendSuccess(fileHandler(data), request, response)
    }
  }.bind(this))
}

/**
 * Send success message
 * @param data json message
 * @param request httpRequest
 * @param response httpResponse
 */
MockServer.prototype.sendSuccess = function (data, request, response) {
  response.writeHead(200, {
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': request.headers.origin ? request.headers.origin : '*',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  })
  response.end(data)
}

/**
 * Send error message
 * @param response httpResponse
 */
MockServer.prototype.sendError = function (response) {
  response.writeHead(404)
  response.end('404')
}

var mockServer = new MockServer(options)
mockServer.start()
console.log('Server running on ' + 'http://localhost:' + mockServer.options.port)
