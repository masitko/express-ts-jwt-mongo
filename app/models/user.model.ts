// const mongoose = require('mongoose')

import mongoose, { Schema, InferSchemaType } from 'mongoose';


const schema = new Schema({
  username: String,
  email: String,
  password: String,
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Role'
    }
  ]
})

export type IUser = InferSchemaType<typeof schema>;

// const User = mongoose.model(
//   'User',
//   new mongoose.Schema({
//     username: String,
//     email: String,
//     password: String,
//     roles: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Role'
//       }
//     ]
//   })
// );

const User = mongoose.model<IUser>('User', schema);
export default User;

// module.exports = User;
