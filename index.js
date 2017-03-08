'use strict';

var http_client;
var debug = false;
var dev = false;

if (dev) {
  http_client = require('follow-redirects').http;
} else {
  http_client = require('follow-redirects').https;
}

var request = require('request');
var fs = require('fs');
var _ = require('lodash');

var log = console.log;

var KnackHQClient = function() {};

KnackHQClient.prototype = {
  mode: null,
  token: null,
  appid: null,
  apikey: null,
  api_url: (dev) ? 'api.localknack' : 'api.knackhq.com',
  authenticate: function(options, callback) {
    if (!options || !options.appid && (!options.token || !options.apikey || !(options.email && options.password))) { throw new Error('must pass appid and token, restkey, or credentials as options'); }

    this.mode = (options.token || (options.email && options.password)) ? 'user' : 'root';
    this.appid = options.appid;

    if (options.email && options.password) {
      return this.authenticate_user({ email: options.email, password: options.password }, function(error) {
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
  authenticate_user: function(options, callback) {
    var _this = this;
    if (!options.email || !options.password) { return; }

    this.request({ body: { email: options.email, password: options.password }, path: '/v1/applications/' + this.appid + '/session' }, function(error, data) {
      // log(error)
      // log(data)
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
        // log(documentText)
        return callback(null, JSON.parse(documentText));
      });
    };

    if (options.body) {
      request_options.method = 'POST';
    } else {
      request_options.method = 'GET';
    }

    if (options.method === 'PUT') {
      request_options.method = 'PUT';
    } else if (options.method === 'DELETE') {
      request_options.method = 'DELETE';
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
  object_records: function(options, callback) {
    this.request({ path: '/v1/objects/' + options.object_key + '/records?' + (options.format !== undefined ? options.format : '') }, callback);
  },
  create_record: function(options, callback) {
    this.request({ path: '/v1/objects/' + options.object_key + '/records', method: 'POST', body: options.body }, callback);
  },
  delete_record: function(options, callback) {
    if (debug) {
      log('delete: /v1/objects/' + options.object_key + '/records/' + options.record_id);
      log(options);
      log('-----')
    }

    this.request({ path: '/v1/objects/' + options.object_key + '/records/' + options.record_id, method: 'DELETE' }, callback);
  },
  find_record: function(options, callback) {
    this.request({ path: '/v1/objects/' + options.object_key + '/records' +
      ((options.filters) ? '?filters=' + encodeURIComponent(JSON.stringify(options.filters)) : '') +
      ((options.rows_per_page) ? ((options.filters) ? '&' : '?') + 'rows_per_page=' + options.rows_per_page : '') +
      ((options.page) ? ((options.filters || options.rows_per_page) ? '&' : '?') + 'page=' + options.page : ''),
      method: 'GET'
    }, callback);
  },
  update_record: function(options, callback) {
    if (debug) {
      log('update: /v1/objects/' + options.object_key + '/records/' + options.record_id);
      log(options);
      log('-----')
    }

    this.request({ path: '/v1/objects/' + options.object_key + '/records/' + options.record_id, method: 'PUT', body: options.body }, callback);
  },
  upload_image: function(options, callback) {
    var _this = this;
    var req = request.post('https://api.knackhq.com/v1/applications/' + this.appid + '/assets/file/upload', function(err, resp, body) {
      if (err) {
        log('Error uploading image!');
        return;
      }

      var resp_body = JSON.parse(body);
      var image_id = resp_body.id;
      var body = {};
      body[options.field_key] = image_id;
      body = _.merge(body, options.body);
      _this.request({ path: '/v1/objects/' + options.object_key + '/records', method: 'POST', body: body }, callback);
    });

    var form = req.form();
    form.append('files', fs.createReadStream(options.filename));
  },
};

module.exports = new KnackHQClient();
