import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore/lite';

let _firebaseConfig;
let _app;
let _db;
let _collectionId;
let _depositList = [];
let _exchangeRates = {};
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
 * Get the deposit index from an array
 * @param {string} timeDepositAccount Account No.
 * @return {number} an array index of a deposit
 */
function _getDepositIndex(timeDepositAccount) {
  return _depositList.map(
    (el) => el.time_deposit_account,
  ).indexOf(timeDepositAccount);
}


/**
 * Get one deposit by its account no
 * @param {string} timeDepositAccount Account No.
 * @return {Promise} Promise with deposit data or null
 */
async function _getDeposit(timeDepositAccount) {
  const depositRef = doc(_db, _collectionId, timeDepositAccount);
  const depositSnapshot = await getDoc(depositRef);
  if (depositSnapshot.exists()) {
    const deposit = depositSnapshot.data();
    deposit.time_deposit_account = timeDepositAccount;
    return deposit;
  }
  return null;
}

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

/**
 * Update deposit history to a specific account
 * @param {string} timeDepositAccount Account No.
 * @param {object} data New deposit record
 * @return {Promise} Promise object with a boolean value.
 */
export async function updateDepositHistory(timeDepositAccount, data) {
  let success = false;
  try {
    const depositRef = doc(_db, _collectionId, timeDepositAccount);
    await updateDoc(depositRef, {
      history: arrayUnion(data),
    });
    const index = _getDepositIndex(timeDepositAccount);
    const deposit = await _getDeposit(timeDepositAccount);
    if (deposit) {
      _depositList = [
        ..._depositList.slice(0, index),
        deposit,
        ..._depositList.slice(index + 1),
      ];
    } else {
      _depositList = [
        ..._depositList.slice(0, index),
        ..._depositList.slice(index + 1),
      ];
    }
    success = true;
    return true;
  } catch (err) {
    console.error('Failed to updateDepositHistory.', err);
    return false;
  } finally {
    window.dispatchEvent(new CustomEvent('depositlistchanged', {
      detail: {
        success,
        type: 'updateDepositHistory',
        result: _depositList,
      },
    }));
  }
}

/**
 * Get exchange rates
 * @return {Promise} Promise with an object value.
 */
export async function getExchangeRates() {
  try {
    const response = await fetch('/api/exchange-rate')
      .then((res) => res.json());
    _exchangeRates = response;
    return {
      success: true,
      result: _exchangeRates,
    };
  } catch (err) {
    console.error('Failed to getExchangeRates.', err);
    _exchangeRates = {};
    return {
      success: false,
      result: _exchangeRates,
    };
  }
}
