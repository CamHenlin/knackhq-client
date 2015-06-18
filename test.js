var knack = require('./index.js');

knack.authenticate({ email: 'cam.henlin@gmail.com', password: 'asdfasdf', appid: '556df8bdae05f67b271d8ba4' }, function(error) {
  if (!error) {
    console.log('authenticated!');
  }

  knack.request({ path: '/v1/objects/object_1/records' }, function(error, data) {
    console.log(error);
    console.log(data);
  });

  knack.objects(function(error, data) {
    console.log(error);
    console.log(data);
  })
});

