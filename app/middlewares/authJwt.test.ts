
import superRequest from "supertest";
import mongoose from "mongoose";
import app from "../../app";

import { Request, Response, NextFunction } from "express";

import User, { IUser } from "../models/user.model";
import Role from "../models/role.model";

const { authJwt } = require('../middlewares');

const httpMocks = require('node-mocks-http');

const dbConfig = require('../config/db.config.js');
const databaseName = 'auth_jwt_db'
const databaseHost = 'localhost';


beforeAll(async () => {
  // const mongoURI = `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${databaseHost}:${dbConfig.PORT}/${databaseName}`;
  // await mongoose.connect(mongoURI, {})
  //   .then(() => {
  //   })
  //   .catch((err: Error) => {
  //     console.error('Connection error', err);
  //   });
  // await User.deleteOne({ username: 'testuser' });
});

describe("AUTH MIDDLEWARE:", () => {

  // let mockRequest: Request;
  // let mockResponse: Response;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
  });

  test('without "authorization" header shoud return 403', async () => {
    const expectedResponse = {
      "message": "No token provided!"
    };
    const mockRequest = httpMocks.createRequest({
      headers: {
      }
    });
    const mockResponse = httpMocks.createResponse()
    authJwt.verifyToken(mockRequest as Request, mockResponse as Response, nextFunction);
    console.log('mockResponse', mockResponse._getData());

    expect(mockResponse.statusCode).toBe(403);
    expect(mockResponse._getData()).toMatchObject(expectedResponse);
  });

});

afterAll(async () => {
  // await mongoose.disconnect();
});