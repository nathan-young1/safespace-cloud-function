const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


exports.fileCreated = functions.storage.object().onFinalize(async (object,context) => {
  const fileSize = object.size;
  const uid = context.auth.uid;
  console.log(`${fileSize} ${uid}`);
  const currentSpace = context.auth.token.StorageLeft;
  const storageSpaceLeft = currentSpace - fileSize;
  const customClaims = {
    StorageLeft: storageSpaceLeft
    };

  return await admin.auth().setCustomUserClaims(uid,customClaims);
  });


  exports.fileDeleted = functions.storage.object().onDelete(async (object,context)=> {
    const fileSize = object.size;
    const uid = context.auth.uid;
    console.log(`${fileSize} ${uid}`);
    const currentSpace = context.auth.token.StorageLeft;
    const storageSpaceLeft = currentSpace + fileSize;

    const customClaims = {
      StorageLeft: storageSpaceLeft
      };
    
  return await admin.auth().setCustomUserClaims(uid,customClaims);
  });


  exports.userCreate = functions.auth.user().onCreate((user) => {
    
  const customClaims = {
    StorageLeft: 2 *1024 *1024 *1024
    };
    
  return admin.auth().setCustomUserClaims(user.uid,customClaims);
  });



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
