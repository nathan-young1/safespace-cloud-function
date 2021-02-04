const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { database } = require('firebase-admin');
admin.initializeApp();


exports.fileCreated = functions.storage.object().onFinalize(async (object,context) => {
  const uid = String(context.resource.name).split('/')[5];
  console.log(`${uid} finished name`);
  console.log(context.resource.name);
  const fileSize = Number(object.size);
  console.log(`${fileSize} ${uid}`);
  const currentSpace = Number((await admin.auth().getUser(uid)).customClaims.storageLeft);
  const storageSpaceLeft = currentSpace - fileSize;

  await admin.auth().setCustomUserClaims(uid,{storageLeft: storageSpaceLeft});
  console.log((await admin.auth().getUser(uid)).customClaims);
  return 'File Created';
  });


  exports.fileDeleted = functions.storage.object().onDelete(async (object,context)=> {
    const uid = String(context.resource.name).split('/')[5];
    console.log(`${uid} finished name`);
    console.log(context.resource.name);
    const fileSize = parseInt(object.size,10);
    console.log(`${fileSize} ${uid}`);
    const currentSpace = Number((await admin.auth().getUser(uid)).customClaims.storageLeft);
    const storageSpaceLeft = parseInt(currentSpace,10) + fileSize;
    
  await admin.auth().setCustomUserClaims(uid,{storageLeft: storageSpaceLeft});
  console.log((await admin.auth().getUser(uid)).customClaims);
  return 'File Deleted';
  });


  exports.userCreate = functions.auth.user().onCreate(async (user) => {
    let uid = user.uid;
    console.log(user.uid);
    await admin.auth().setCustomUserClaims(uid,{storageLeft: 2 *1024 *1024 *1024});
    console.log((await admin.auth().getUser(uid)).customClaims);
    return 'finished creating user';
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
