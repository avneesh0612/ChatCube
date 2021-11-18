const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "corporatebytes.in",
      "images.clerk.dev",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "www.gravatar.com",
    ],
  },

  env: {
    firebase_config_api_key: process.env.FIREBASE_CONFIG_API_KEY,
    firebase_authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebase_projectId: process.env.FIREBASE_PROJECT_ID,
    firebase_storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebase_messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebase_appId: process.env.FIREBASE_APP_ID,
    firebase_measurementid: process.env.FIREBASE_MEASUREMENT_ID,
  },
});
