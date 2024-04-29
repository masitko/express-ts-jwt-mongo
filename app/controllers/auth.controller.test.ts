
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";

import { Response } from "express";

import User, { IUser } from "../models/user.model";
import Role from "../models/role.model";

const bcrypt = require('bcryptjs');

const dbConfig = require('../config/db.config.js');
const databaseName = 'auth_jwt_db'
const databaseHost = 'localhost';


beforeAll(async () => {
  const mongoURI = `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${databaseHost}:${dbConfig.PORT}/${databaseName}`;
  await mongoose.connect(mongoURI, {})
    .then(() => {
      // console.log('Successfully connect to MongoDB.');
    })
    .catch((err: Error) => {
      console.error('Connection error', err);
    });
  await User.deleteOne({ username: 'testuser' });
});

describe("AUTH API:", () => {

  test('signIn Should not log in nonexisting user and return 401.', async () => {
    const response = await request(app).post('/api/auth/signin')
      .send({
        username: 'nonuser',
        password: 'wrongpass'
      })
      .expect(401);

  });
  test('signIn Should log in an existing user and return token.', async () => {
    const password = 'newuserpass';
    const user = new User({
      username: 'newuser',
      email: 'newuser@test.com',
      password: bcrypt.hashSync(password, 8)
    });
    const userRole = await Role.findOne({ name: 'user' });
    if (userRole) {
      user.roles = [userRole._id];
    }
    const saveResponse = await user.save();
    console.log('saveResponse: ', saveResponse);

    const response = await request(app).post('/api/auth/signin')
      .send({
        username: user.username,
        password: password,
      })
      .expect(200);
    expect(response.body).toHaveProperty('accessToken');
    console.log('response.body: ', response.body);
    // const response = await request(app).post('/api/auth/signin')
    //   .send({
    //     username: 'nonuser',
    //     password: 'wrongpass'
    //   })
    //   .expect(401);

  });


  test('signUp should create a new user and return 201.', async () => {
    const response = await request(app).post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'testuser@test.com',
        password: 'pass1234'
      })
      .expect(201);

    const user = await User.findById(response.body.user._id)
    expect(response.body.user).toMatchObject({
      username: 'testuser',
      email: "testuser@test.com"
    });
    expect(user?.password).not.toBe('pass1234');

    await User.deleteOne({ username: 'testuser' });
  })
});

afterAll(async () => {
  await mongoose.disconnect();
});