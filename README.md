# extremely simple node knackhq client

## How do I use it?

Very carefully!

First install into your project with:

``
npm install knackhq-client --save
``

Next, add it into your code somewhere:

``
var knack = require('knackhq-client.js');
``

Now you're ready to authenticate! You can authenticate as the root user with:

``
knack.authenticate({ apikey: 'your api key', appid: 'your app id' }, function(error) {
  if (error) {
    // failed to log in!
  }
});
``

Or as an app user with:

``
knack.authenticate({ email: 'user email', password: 'user password', appid: 'your app id' }, function(error) {
  if (error) {
    // failed to log in!
  }
});
``

## I'm logged in. Now what the heck do I do?

I'm glad you asked. The thing to do from here is to start updating, editing, creating, and searching for records. So let's try it:

### create a record

To do this, you'll need the object key of the object you want to create a record in. We're calling this ``object_key`` here, as well as whatever fields you want to fill with data. I'm referring to that as ``field_key``:
``
knack.create_record({ object_key: object_key, body: {
  field_key: 'my data'
} }, function(error, data) {
  // should have an error here if there was a problem, or the record data in the data object if the add was successful
});
``

### edit a record

To do this, you'll need the object key of the object you want to create a record in. We're calling this ``object_key`` here, as well as whatever fields you want to update the data of. I'm referring to that as ``field_key``. Lastly, we'll need the ID of the record we want to update, the ``record_id``:
``
knack.update_record({ object_key: object_key, record_id: record_id, body: { field_key: 'my updated data' } }, function(err, record) {
  // should have an error here if there was a problem, or the record data in the data object if the add was successful
});
``

### edit a record

To do this, you'll need the object key of the object you want to create a record in. We're calling this ``object_key`` here. We'll also need the ID of the record we want to delete, the ``record_id``:
``
knack.delete_record({ object_key: object_key, record_id: record_id }, function(err, status) {
  // should have an error here if there was a problem, or a success status if the record was deleted
});
``