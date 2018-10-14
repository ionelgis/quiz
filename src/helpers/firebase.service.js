import * as firebase from "firebase";
import { config } from "../../config/firebase.config.js";

firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.database();

export { auth, db };