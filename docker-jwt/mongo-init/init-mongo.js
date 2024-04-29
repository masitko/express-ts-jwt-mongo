/* eslint-disable no-undef */
console.log(' ===================================================');
console.log(' ++++++   init-mongo.js script is running +++++++++ ');
console.log(' ===================================================');
db.getSiblingDB('admin').auth(
  process.env.MONGO_INITDB_ROOT_USERNAME,
  process.env.MONGO_INITDB_ROOT_PASSWORD
);

db = db.getSiblingDB(process.env.MONGO_DB_NAME);
db.createUser({
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_PASSWORD,
  roles: [
    {
      role: 'dbOwner',
      db: process.env.MONGO_DB_NAME
    }
  ]
});
