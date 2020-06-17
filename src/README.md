Firestore Test Utilities
========================

The Firebase team recommends online integration tests that unit test your functions against 
a real instance of Firestore, Storage and Auth. These utilities make it easier to create testing
environments.

Installation
------------

### Installing with DigHub CLI

Our CLI tool will configure your online tests and install the dependencies.

```shell script
npm install -g @dig-platform/dihub-cli
dighub add firestore-test
```

### Installing with NPM

You can also install this with NPM.

`npm install @dig-platform/firestore-test`

Test DB API
-----------

| Name | Description |
| ---- | ----------- |
| `docs` | The original test data. The key is the path and the value is the data. |
| `refs` | A collection of the Firestore refs that were created. The key is the path and the value is the ref. |
| `before(path)` | Get the original state of the doc |
| `after(path)` | Get the data that is persisted to the test db |
| `makeDocumentSnapshot(path)` | Get the test bed document snapshot for a path |
| `destroy()` | Deletes all of the docs that you have persisted in the test db | 

Example
-------

```javascript
const firestoreTest = require('@dig-platform/firestore-test')({
    databaseURL: '###',
    storageBucket: '###',
    projectId: '###',
}, 'path/to/private/test-key.json');

const firestore = firestoreTest.firestore();

const {assert} = require('chai');

// simple test function
const getItems = (orderId) => {
    return firestore.collection('order_items').where('order_id', '==', orderId).get().then(snap => snap.docs);
}

describe('Firestore Test Example', () => {
   it ('Should create the test db', async () => {
       // create the test db
       const db = await firestoreTest.testDb({
           'orders/test': {status: 'new'},
           'order_items/test1': {order_id: 'test', item: 'widget'},
           'order_items/test2': {order_id: 'test', item: 'widget'}
       });

       // test the function
       const items = await getItems('test');
       assert.equals(items.length, 2);

       // clean up firestore
       return db.destroy();
   });
});
```








