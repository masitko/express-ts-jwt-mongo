import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors';

// import Role, { IRole } from "./app/models/role.model";
// import mongoose from "mongoose";

const app: Express = express();

dotenv.config();

var corsOptions = {
  // origin: 'http://localhost:5173'
  origin: '*'
}

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to backend api.' });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/role.routes')(app);

export default app;