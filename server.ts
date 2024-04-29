import Role, { IRole } from "./app/models/role.model";
import mongoose from "mongoose";
import app from "./app";

const dbConfig = require('./app/config/db.config.js');


// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const mongoURI = `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;
console.log('mongoURI: ', mongoURI);
mongoose
  .connect(mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  })
  .then(() => {
    console.log('Successfully connect to MongoDB.');
    initial();
  })
  .catch((err: Error) => {
    console.error('Connection error', err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount().then((count: Number) => {
    console.log('COUNT: ', count);
    if (count === 0) {
      ['user', 'admin', 'moderator'].forEach((roleName) => {
        new Role({
          name: roleName
        })
          .save()
          .then((role: any) => console.log('==== ROLE CREATED: ', role.name))
          .catch((err: Error) => console.error('error', err))
          .finally(() => console.log('finally: '));
      });
    }
  });
}
