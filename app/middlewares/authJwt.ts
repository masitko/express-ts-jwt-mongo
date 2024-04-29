import { Request as ExpressRequest, Response } from "express";
import User, { IUser } from '../models/user.model';
import { IRole } from "../models/role.model";


const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');

interface Request extends ExpressRequest {
  userId: Number;
}

let verifyToken = (req: Request, res: Response, next: NextCallback) => {
  let authHeader = req.headers['authorization'];

  let token = authHeader && authHeader.split(' ')[1];
  // console.log(token);
  // console.log(req.headers);

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, config.secret, (err: Error, decoded: any) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!'
      });
    }
    req.userId = decoded.id;
    next();
  });
};

let hasRole = (userId: Number, roleName: String) => {
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .populate<{ roles: IRole[] }>('roles')
      .exec()
      .then((user) => {
        if (user)
          for (let i = 0; i < user.roles.length; i++) {
            if (user.roles[i].name === roleName) {
              return resolve(true);
            }
          }
        return resolve(false);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

let isAdmin = (req: Request, res: Response, next: NextCallback) => {
  hasRole(req.userId, 'admin')
    .then((result) => {
      if (result === true) return next();
      else res.status(403).send({ message: 'Require Admin Role!' });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

let isModerator = (req: Request, res: Response, next: NextCallback) => {
  hasRole(req.userId, 'moderator')
    .then((result) => {
      if (result === true) return next();
      else res.status(403).send({ message: 'Require Moderator Role!' });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

export const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};

// module.exports = authJwt;
