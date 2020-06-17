// configure your testing environment to point to the testing firebase instance
const firestoreTest = require('@dig-platform/firestore-test')({
    databaseURL: '###',
    storageBucket: '###',
    projectId: '###',
}, 'conf/test-key.json');

// get the core firebase testing utilities
const test = firestoreTest.firebaseTest();

// use chai testing package
const {assert} = require('chai');

// require the task function
const {tasks} = require('./tasks');

describe('Firestore task onCreate', () => {
    before(() => {
        // setup the test
    });
    after(() => {
        // tear down the test
        test.cleanup();
    });

    describe('task()', () => {
        it('should set the priority to low if it is not set', async () => {
            const refPath = 'task/test-data';
            const db = await firestoreTest.testDb({
                [refPath]: {
                    label: 'Get the milk',
                    done: false
                }
            });
            const snap = db.makeDocumentSnapshot(refPath);
            const wrapped = test.wrap(tasks);
            return wrapped(snap).then(async (d) => {
                const task = await db.after(refPath);
                assert.equal(task.priority, 'low')
            });
        });
    });
});
