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
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const _collectionId = process.env.TIME_DEPOSIT_COLLECTION_ID;
let _firebaseConfig;
let _app;
let _db;
let _auth;
let _depositList = [];
let _exchangeRates = {};
let _initializationError;

try {
  _firebaseConfig = JSON.parse(process.env.TIME_DEPOSIT_FIREBASE_CONFIG);
  _app = initializeApp(_firebaseConfig);
  _db = getFirestore(_app);
  if (process.env.TIME_DEPOSIT_AUTH === 'email') {
    _auth = getAuth(_app);
    _auth.onAuthStateChanged((user) => {
      window.dispatchEvent(new CustomEvent('authstatechanged', {
        detail: {
          success: true,
          result: user || {},
        },
      }));
    });
  }
} catch (err) {
  _initializationError = `
    There is something wrong while initializing the app.
    Please check out with your firebaseConfig (TIME_DEPOSIT_FIREBASE_CONFIG).
  `;
  console.error('Error occurs while parsing firebase config:', err);
}

export const initializationError = _initializationError;

/**
 * Sign in with Firebase Authentication
 * @param {string} email The e-mail address
 * @param {string} pwd The password
 */
export function signInWithAuth(email, pwd) {
  signInWithEmailAndPassword(_auth, email, pwd)
    .catch((err) => {
      console.error('Failed to signInWithAuth.', err);
      window.dispatchEvent(new CustomEvent('authstatechanged', {
        detail: {
          success: false,
          action: 'signInWithAuth',
          result: err.message,
        },
      }));
    });
}

/**
 * Sign the user out
 */
export function signOutWithAuth() {
  signOut(_auth);
}

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
 * Integrate calculated profit/loss into deposit
 * @param {object} deposit Time deposit record
 * @param {string} timeDepositAccount Account No.
 * @return {object} The transformed deposit with revenue and pl
 */
function _withPL(deposit, timeDepositAccount) {
  const { history, currency, cost, exchange_rate: exchangeRate } = deposit;
  const latestHistory = history?.[history.length - 1];
  const availableBalance = latestHistory ?
    (latestHistory.time_deposit_amount +
    latestHistory.received_gross_interest_amount) :
    cost / exchangeRate;
  const revenue = availableBalance * (_exchangeRates[currency] || 0);

  if (timeDepositAccount) {
    deposit.time_deposit_account = timeDepositAccount;
  }

  return {
    ...deposit,
    revenue,
    pl: revenue - cost,
  };
}

/**
 * Show profit or loss by calculating the revenues & costs
 */
function _calculateROI() {
  if (_depositList.length && Object.keys(_exchangeRates).length) {
    _depositList = _depositList.map((deposit) => _withPL(deposit));
    window.dispatchEvent(new CustomEvent('depositlistchanged', {
      detail: {
        success: true,
        action: 'calculateROI',
        result: _depositList,
      },
    }));
  }
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
    return _withPL(deposit, timeDepositAccount);
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
    if (_depositList.length && Object.keys(_exchangeRates).length) {
      _calculateROI();
    } else {
      window.dispatchEvent(new CustomEvent('depositlistchanged', {
        detail: {
          success,
          action: 'getDeposits',
          result: _depositList,
        },
      }));
    }
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
      _withPL(data, timeDepositAccount),
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
        action: 'createDepositAccount',
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
        action: 'updateDepositHistory',
        result: _depositList,
      },
    }));
  }
}

/**
 * Sort deposit list by given field and options
 * @param {string} by The field used to sort data
 * @param {object} options Advanced sorting, such as "order by"
 */
export function sortDepositList(by, options) {
  const field = {
    account: 'time_deposit_account',
    pl: 'pl',
  };
  let dup = [..._depositList];
  switch (by) {
    case 'currency':
      dup.sort((a, b) => {
        if (a.currency === b.currency) {
          return a.time_deposit_account - b.time_deposit_account;
        }
        return a.currency.localeCompare(b.currency);
      });
      break;
    case 'month':
      dup.sort((a, b) => {
        if (a.month === b.month) {
          return a.day - b.day;
        }
        return a.month - b.month;
      });
      if (options?.from === 'current') {
        const currentMonth = new Date().getMonth();
        const index = dup.findIndex((d) => d.month === currentMonth + 1);
        dup = [
          ...dup.slice(index),
          ...dup.slice(0, index),
        ];
      }
      break;
    default:
      dup.sort((a, b) => a[field[by]] - b[field[by]]);
      break;
  }

  window.dispatchEvent(new CustomEvent('depositlistchanged', {
    detail: {
      success: true,
      action: 'sortDepositList',
      result: options?.orderby === 'desc' ? dup.reverse() : dup,
    },
  }));
}

/**
 * Get exchange rates
 * @return {Promise} Promise with an object value.
 */
export async function getExchangeRates() {
  try {
    _exchangeRates = await fetch('/api/exchange-rate')
      .then((res) => res.json());
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
  } finally {
    _calculateROI();
  }
}
