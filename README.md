# Time Deposit
A responsive and progressive web app built on top of Web Components.

## Technologies

### Frontend
- [Lit](https://lit.dev/)

### Backend
- [Firebase](https://firebase.google.com/)

## Prerequisite
1. Log into Google account and go to [Firebase console](https://console.firebase.google.com/), and then **Add project**.
2. Let's say we've added a new `time-deposit-demo` project, then let's move on to the [Firestore Database](https://console.firebase.google.com/project/time-deposit-demo/firestore) to **Create database**.
3. Navigate to [Project Overview](https://console.firebase.google.com/project/time-deposit-demo/overview), click the web(</>) icon to **Add an app to get started**. After the **Register app** step, we should get the `firebaseConfig` like this:
```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```
Keep it for a later use.

## Get started
1. Clone the project to local environment and change working directory:
```sh
git clone https://github.com/chejen/time-deposit
cd time-deposit
```
2. Create an empty `.env` file.
3. Convert previously saved `firebaseConfig` from JS object to JSON string by using `JSON.stringify()`, and then paste the result into the `.env` file.
```properties
firebaseConfig={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
```
4. Install dependencies and start the server.
```sh
yarn
npm start
```
5. Navigate to http://localhost:8080
