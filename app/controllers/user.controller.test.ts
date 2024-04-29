
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";

import { Response } from "express";

import User, { IUser } from "../models/user.model";

const dbConfig = require('../config/db.config.js');
const databaseName = 'auth_jwt_db'
const databaseHost = 'localhost';


beforeAll(async () => {
  // Connect to a Mongo DB
  const mongoURI = `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${databaseHost}:${dbConfig.PORT}/${databaseName}`;
  await mongoose.connect(mongoURI, {})
    .then(() => {
      // console.log('Successfully connect to MongoDB.');
    })
    .catch((err: Error) => {
      console.error('Connection error', err);
    });
});

describe("USER API:", () => {
  test('allAccess should return Public Content.', async () => {
    await request(app).get('/api/test/all')
      .expect("Content-Type", /^text\/html/)
      .expect(200, /Public Content./);
  });

  test('adminBoard should return 403 when not authenticated.', async () => {
    await request(app).get('/api/test/admin')
      // .expect("Content-Type", /^text\/html/)
      .expect(403);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});