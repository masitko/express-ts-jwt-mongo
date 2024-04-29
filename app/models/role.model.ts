// const mongoose = require('mongoose')
import mongoose, { Schema, InferSchemaType } from 'mongoose';

export enum RoleNames {
  User = 'user',
  Admin = 'admin',
  Moderator = 'moderator',
}

export interface IRole {
  name: RoleNames;
};

const schema = new Schema({
  name: String,
  enum: Object.values(RoleNames),
  // default: RoleNames.User,
});

// export type IRole = InferSchemaType<typeof schema>;

// const Role = mongoose.model(
//   'Role',
//   new mongoose.Schema({
//     name: String
//   })
// )

const Role = mongoose.model<IRole>('Role', schema);
export default Role;

// module.exports = Role
