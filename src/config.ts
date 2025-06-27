export const appConfig = {
  api_url: import.meta.env.VITE_PUBLIC_API_URL,
  exchange_id: import.meta.env.VITE_EXCHANGE_ID,
  // websocket_url: import.meta.env.VITE_WEBSOCKET_URL
  websocket_url: import.meta.env.VITE_WEBSOCKET_URL,
};

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};
