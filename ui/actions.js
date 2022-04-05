let _firebaseConfig;
try {
  _firebaseConfig = JSON.parse(process.env.firebaseConfig);
} catch (err) {
  console.error('Error occurs while parsing firebase config:', err);
}

export const firebaseConfig = _firebaseConfig;
