// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCIrCnml3xhtPOFyEh-0rqrDR604F3f58o",
  authDomain: "react-pos-42df8.firebaseapp.com",
  projectId: "react-pos-42df8",
  storageBucket: "react-pos-42df8.appspot.com",
  messagingSenderId: "390225017526",
  appId: "1:390225017526:web:4e2190d6df0d4cf7614417",
  measurementId: "G-S9GEGPN57J",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
