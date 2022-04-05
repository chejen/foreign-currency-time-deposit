import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore/lite';

let _firebaseConfig;
let _app;
let _db;
let _collectionId;
let _depositList = [];
let _initializationError;

try {
  _firebaseConfig = JSON.parse(process.env.firebaseConfig);
  _app = initializeApp(_firebaseConfig);
  _db = getFirestore(_app);
  _collectionId = process.env.collectionId || 'time-deposit';
} catch (err) {
  _initializationError = `
    There is something wrong while initializing the app.
    Please check out with your firebaseConfig.
  `;
  console.error('Error occurs while parsing firebase config:', err);
}

export const initializationError = _initializationError;

/**
 * Get deposit list
 * @return {Promise} Promise object with a boolean value.
 */
export async function getDeposits() {
  let success = false;
  try {
    const depositsCol = collection(_db, _collectionId);
    const depositSnapshot = await getDocs(depositsCol);
    _depositList = depositSnapshot.docs.map((doc) => ({
      time_deposit_account: doc.id,
      ...doc.data(),
    }));
    success = true;
    return true;
  } catch (err) {
    console.error('Failed to getDeposits.', err);
    _depositList = [];
    return false;
  } finally {
    window.dispatchEvent(new CustomEvent('depositlistchanged', {
      detail: {
        success,
        type: 'getDeposits',
        result: _depositList,
      },
    }));
  }
}

/**
 * Create a new deposit account
 * @param {string} timeDepositAccount Account No.
 * @param {object} data Deposit data to be saved
 * @return {Promise} Promise object with a boolean value.
 */
export async function createDepositAccount(timeDepositAccount, data) {
  let success = false;
  try {
    const newDoc = doc(_db, _collectionId, timeDepositAccount);
    await setDoc(newDoc, data);
    _depositList = [
      {
        time_deposit_account: timeDepositAccount,
        ...data,
      },
      ..._depositList,
    ];
    success = true;
    return true;
  } catch (err) {
    console.error('Failed to createDepositAccount.', err);
    return false;
  } finally {
    window.dispatchEvent(new CustomEvent('depositlistchanged', {
      detail: {
        success,
        type: 'createDepositAccount',
        result: _depositList,
      },
    }));
  }
}
