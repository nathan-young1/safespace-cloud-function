const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


exports.fileCreated = functions.storage.object().onFinalize(async (object,context) => {
  const fileSize = object.size;
  const uid = context.auth.uid;
  console.log(fileSize);
  const doc = admin.firestore().collection('Available Storage Space').doc(uid);
  const storageSpaceLeft = ((await doc.get()).data[0]) - fileSize;
  return doc.update({StorageLeft: storageSpaceLeft});
  });


  exports.fileDeleted = functions.storage.object().onDelete(async (object,context)=> {
    const fileSize = object.size;
    const uid = context.auth.uid;
    console.log(fileSize);
    const doc = admin.firestore().collection('Available Storage Space').doc(uid);
    const storageSpaceLeft = ((await doc.get()).data[0]) + fileSize;
    return doc.update({StorageLeft: storageSpaceLeft});
  });


  exports.userCreate = functions.auth.user().onCreate((user) => {
      const doc = admin.firestore().collection('Available Storage Space').doc(user.uid);
      return doc.create({StorageLeft: 2 *1024 *1024 *1924});
  });


  exports.userDelete = functions.auth.user().onDelete((user)=> {
    const doc = admin.firestore().collection('Available Storage Space').doc(user.uid);
    return doc.delete();
  });


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
