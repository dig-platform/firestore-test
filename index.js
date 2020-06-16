const firebaseTest = require('firebase-functions-test');
const admin = require('firebase-admin');

/**
 * Firestore Online Test Bed
 */
class FirestoreTest {
    constructor(config, pathToServiceAccountKey) {
        // load the config file if this is a path
        this.config = config;
        this.pathToServiceAccountKey = pathToServiceAccountKey;
    }

    /**
     * Get the firebase functions test bed
     *
     * @returns {*}
     */
    testBed() {
        return firebaseTest(this.config, this.pathToServiceAccountKey);
    }

    /**
     * Initialize and get the current Firebase admin SDK
     */
    admin() {
        if (! admin.apps.length) {
            admin.initializeApp();
        }
        return admin
    }

    /**
     * Get the test Firestore SDK
     *
     * @returns {*}
     */
    firestore() {
        return this.admin().firestore();
    }

    /**
     * Create the test db
     * This function returns a collection of the Firestore refs that were generated
     * and a method to destroy the collection which deletes all of the temporary resources
     *
     * @param docs example: {'orders/test': {status: 'new'}}
     *
     * @returns {PromiseLike<{refs: {}, destroy: (function(): void)}> | Promise<{refs: {}, destroy: (function(): void)}>}
     */
    testDb(docs) {
        const db = this.firestore();
        const refs = {};
        const createBatch = db.batch();
        const destroyBatch = db.batch();
        Object.keys(docs).forEach(doc => {
            const ref = db.doc(doc);
            createBatch.set(ref, docs[doc]);
            destroyBatch.delete(ref);
            refs[doc] = ref;
        });
        return createBatch.commit().then(res => {
            return {
                refs,
                destroy: () => destroyBatch.commit()
            }
        });
    }

}

module.exports = (config, pathToServiceAccountKey) => new FirestoreTest(config, pathToServiceAccountKey);
