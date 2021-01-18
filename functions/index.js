const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


exports.fileCreated = functions.storage.object().onFinalize(async (object,context) => {
  let uid = String(context.resource.name).split('/')[6];
  console.log(`${uid} finished name`);
  console.log(`${context.resource.labels} finished service`);
  const fileSize = object.size;
  console.log(`${fileSize} ${uid}`);
  const currentSpace = Number(context.auth.token.storageLeft);
  const storageSpaceLeft = currentSpace - fileSize;

  return await admin.auth().setCustomUserClaims(uid,{storageLeft: storageSpaceLeft});
  });


  exports.fileDeleted = functions.storage.object().onDelete(async (object,context)=> {
    let uid = String(context.resource.name).split('/')[6];
    console.log(`${uid} finished name`);
    const fileSize = object.size;
    console.log(`${fileSize} ${uid}`);
    const currentSpace = Number(context.auth.token.storageLeft);
    const storageSpaceLeft = currentSpace + fileSize;
    
  return await admin.auth().setCustomUserClaims(uid,{storageLeft: storageSpaceLeft});
  });


  exports.userCreate = functions.auth.user().onCreate((user) => {
    let uid = user.uid;
    console.log(user.uid);
    admin.auth().setCustomUserClaims(uid,{storageLeft: 2 *1024 *1024 *1024}).then(async (full,reject)=>{
      console.log((await admin.auth().getUser(uid)).customClaims);
      console.log('startefdsrrr');
      return 'finished creating user';
    }
      ).catch(e=>{
        console.log(e);
      });
  return 'finished creating user';
  });



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
