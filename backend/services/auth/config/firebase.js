import { cert, initializeApp } from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json";

export const app = initializeApp({
  credential: cert(serviceAccount)
});