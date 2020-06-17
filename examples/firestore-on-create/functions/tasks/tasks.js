// require firebase functions
const functions = require('firebase-functions');

// create onCreate firestore trigger for the tasks collection
exports.tasks = functions.firestore
    .document('tasks/{docID}')
    .onCreate((change, context) => {
        // get the document's data
        const data = change.data();
        // we are going make priority default to low if it is not set
        if (! data.priority) {
            // create the patch
            const patch = {priority: 'low'};

            // apply the patch to the Firestore ref
            return change.ref.set(patch, {merge: true});
        }
        return;
    });
