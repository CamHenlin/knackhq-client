# extremely simple node knackhq client

## How do I use it?

Very carefully!

First install into your project with:

    npm install knackhq-client --save

Next, add it into your code somewhere:

    var knack = require('knackhq-client');

Now you're ready to authenticate! You can authenticate as the root user with:

    knack.authenticate({ apikey: 'your api key', appid: 'your app id' }, function(error) {
      if (error) {
        // failed to log in!
      }
    });

Or as an app user with:

    knack.authenticate({ email: 'user email', password: 'user password', appid: 'your app id' }, function(error) {
      if (error) {
        // failed to log in!
      }
    });

## I'm logged in. Now what the heck do I do?

I'm glad you asked. The thing to do from here is to start updating, editing, creating, and searching for records. So let's try it:

### create a record

To do this, you'll need the object key of the object you want to create a record in. We're calling this ``object_key`` here, as well as whatever fields you want to fill with data. I'm referring to that as ``field_key``:

    knack.create_record({ object_key: object_key, body: {
      field_key: 'my data'
    } }, function(error, data) {
      // should have an error here if there was a problem, or the record data in the data object if the add was successful
    });

### edit a record

To do this, you'll need the object key of the object you want to create a record in. We're calling this ``object_key`` here, as well as whatever fields you want to update the data of. I'm referring to that as ``field_key`` again. Lastly, we'll need the ID of the record we want to update, the ``record_id``:

    knack.update_record({ object_key: object_key, record_id: record_id, body: { field_key: 'my updated data' } }, function(err, record) {
      // should have an error here if there was a problem, or the record data in the data object if the add was successful
    });

### delete a record

To do this, you'll need the object key of the object you want to create a record in. We're calling this ``object_key`` here. We'll also need the ID of the record we want to delete, the ``record_id``:

    knack.delete_record({ object_key: object_key, record_id: record_id }, function(err, status) {
      // should have an error here if there was a problem, or a success status if the record was deleted
    });

### find a record

Finding a record optionally involves involves building a ``filter`` array that Knack will match records to. More about filters [here](http://helpdesk.knackhq.com/support/solutions/articles/5000447623-filters-search). Again, ``object_key`` and ``field_key`` are used. The ``rows_per_page`` option will specify how many records you would like to have returned. If we're interested in getting the next page of results, we can increment the ``page`` variable, which starts at page 0:

    var filters = filters: [{ field: field_key, operator: 'is', value: 'my criteria' }] };
    knack.find_record({ object_key: object_key, rows_per_page: 500, page: page, filters: filters }, function(error, data) {
      if (error) {
        // something bad happened!
      }

      if (!data.records || !data.records.length) {
        // no records
      }
    });

### upload an image

*Note: this is actually a 2 step process that will use 2 api calls in your knack plan*

``filename`` is the local path and filename to the file or image you want to upload. ``object_key`` is the object key of the where the record containing the file will be stored. ``field_key`` is the field that the file will be attached to (of type File or Image), and ``body`` is the body of the entry if you want to include additional information (this is also doing a create_record call!)

    knack.upload_image({ filename: filename, object_key: object_key, field_key: field_key, body: {
      field_key: 'some other info'
    } }, function(err, status) {
      // should have an error here if there was a problem, or a success status if the record was deleted
    });

## Method Signatures

**knack.authenticate(options, callback)**

    options: { apikey: , appid: } OR { email: , password: , appid }
    callback: function(error)

**knack.authenticate_user(options, callback)**

    options: { email: , password: , appid }
    callback: function(error)

**knack.request(options, callback)**

    options: { path: , method: , body: }
    callback: function(error, response_object)

**knack.objects(callback)**

    callback: function(error, response_object)

**knack.object_records(options, callback)**

    options: { object_key: }
    callback: function(error, response_object)

**knack.create_record(options, callback)**

    options: { object_key: , body: {} }
    callback: function(error, response_object)

**knack.delete_record(options, callback)**

    options: { object_key: , record_id: }
    callback: function(error, response_object)

**knack.find_record(options, callback)**

    options: { { object_key: , rows_per_page: , page: filters: [{}] } }
    callback: function(error, response_object)

**knack.update_record(options, callback)**

    options: { { object_key: , record_id: , body: {} } }
    callback: function(error, response_object)

**knack.upload_image(options, callback)**

    options: { field_key: , filename: , body: {} }
    callback: function(error, response_object)
