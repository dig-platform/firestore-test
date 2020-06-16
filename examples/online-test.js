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
