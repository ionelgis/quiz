import * as firebase from "firebase";
import { config } from "../../config/firebase.js";

firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.database();

export { auth, db };