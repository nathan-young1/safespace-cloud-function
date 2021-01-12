const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.fileUploadLimit = functions.storage.object().onFinalize(async (object) => {
    const fileSizeLimit = 2000000;
    const uploadFileSize = object.size;
    console.log(uploadFileSize);
    const storageLeft = fileSizeLimit - uploadFileSize;
    const customClaims = {
        fileStorageLeft: storageLeft,
        canWrite: (storageLeft < 0)? false : true
      };
      
    return admin.auth().setCustomUserClaims((object.owner.entityId),customClaims);
  });

  exports.userCreate = functions.auth.user().onCreate((user) => {
    // Check if user meets role criteria.
    // if (user.email &&
    //     user.email.endsWith('@admin.example.com') &&
    //     user.emailVerified) {
      const customClaims = {
        fileStorageLeft: 2000000,
        canWrite: true
      };
      // Set custom user claims on this newly created user.
      return admin.auth().setCustomUserClaims(user.uid, customClaims);
    //}
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
