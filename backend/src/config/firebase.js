const admin = require('firebase-admin');
const path = require('path');

let firebaseApp = null;

const initializeFirebase = () => {
  if (firebaseApp) return firebaseApp;

  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
      path.join(__dirname, '../../config/firebase-service-account.json');
    
    const serviceAccount = require(serviceAccountPath);
    
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`
    });

    return firebaseApp;
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    throw error;
  }
};

const getStorage = () => {
  if (!firebaseApp) initializeFirebase();
  return admin.storage();
};

const verifyIdToken = async (idToken) => {
  if (!firebaseApp) initializeFirebase();
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  initializeFirebase,
  getStorage,
  verifyIdToken,
  admin
};
