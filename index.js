'use strict';

var http_client;
var debug = true;
var dev = true;

if (dev) {
  http_client = require('follow-redirects').http;
} else {
  http_client = require('follow-redirects').https;
}

var log = function(input) {
  if (debug) {
    console.log(JSON.stringify(input));
  }
}

// Constructor
var KnackHQClient = function() {};

// Methods
KnackHQClient.prototype = {
  mode: null,
  token: null,
  appid: null,
  apikey: null,
  api_url: (dev) ? 'api.knack.localhost' : 'api.knackhq.com',
  authenticate: function(options, callback) {
    if (!options || !options.appid && (!options.token || !options.apikey || !(options.email && options.password))) { throw new Error('must pass appid and token, restkey, or credentials as options'); }

    this.mode = (options.token || (options.email && options.password)) ? 'user' : 'root';
    this.appid = options.appid;

    if (options.email && options.password) {
      return this.authenticateUser({ email: options.email, password: options.password }, function(error) {
        return callback(error);
      });
    }

    if (options.token) {
      this.token = options.token;
    }

    if (options.apikey) {
      this.apikey = options.apikey;
    }

    return callback();
  },
  authenticateUser: function(options, callback) {
    var _this = this;
    if (!options.email || !options.password) { return; }

    this.request({ body: { email: options.email, password: options.password }, path: '/v1/applications/' + this.appid + '/session' }, function(error, data) {
      log(error)
      log(data)
      _this.token = data.session.user.token;
      callback(error);
    });
  },
  request: function(options, callback) {
    var request_options = {
      host: this.api_url,
      path: options.path,
      port: (dev) ? 3000 : 443,
      headers: {
        'X-Knack-Application-Id': this.appid,
        'Content-Type': 'application/json'
      }
    };

    if (this.token) {
      request_options.headers['Authorization'] = this.token;
    } else if (this.apikey) {
      request_options.headers['X-Knack-REST-API-Key'] = this.apikey;
    }

    var request_callback = function(response) {
      var documentText = ''
      if (!response || !response.on) { return; }

      response.on('data', function(chunk) {
        documentText += chunk;
      });

      response.on('end', function () {
        return callback(null, JSON.parse(documentText));
      });
    };

    if (options.body) {
      request_options.method = 'POST';
    } else {
      request_options.method = 'GET';
    }

    var request = http_client.request(request_options, request_callback);

    request.on('error', function (error) {
      callback(error, null);
    });

    if (options.body) {
      request.write(JSON.stringify(options.body));
    }

    request.end();
  },
  objects: function(callback) {
    this.request({ path: 'v1/objects' }, callback);
  },
  records: function(callback) {
    // this.request({ path: })
  }
};

module.exports = new KnackHQClient();
