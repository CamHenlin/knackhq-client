'use strict';

const KnackHQClient = require('./index.js');

const client = new KnackHQClient({

  app_id: 'XXXXXXXXXXXXXXXXXXX',
  api_key: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
});


async function knackExample() {

  const objects = await client.objects();

  const object_key = objects.objects[0].key;

  await client.createRecord(object_key, {
    field_1: 'Hello, Knack!'
  });

  let records = await client.records(object_key);

  console.log(records);

  const record_key = records.records[0].id;

  const record = await client.getRecord(object_key, record_key);

  console.log(record);

  await client.deleteRecord(object_key, record_key);

  records = await client.records(object_key);

  console.log(records);
}

knackExample();
