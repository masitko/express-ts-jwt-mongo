import { Request, Response } from "express";
import User from '../models/user.model';
import { RoleNames } from "../models/role.model";

const Roles = Object.values(RoleNames);

let checkDuplicateUsernameOrEmail = (req: Request, res: Response, next: NextCallback) => {
  // Username
  User.findOne({
    username: req.body.username
  })
    .exec()
    .then((user) => {
      if (user) {
        return res.status(400).send({ message: 'Failed! Username is already in use!' });
      }
      // Email
      User.findOne({
        email: req.body.email
      })
        .exec()
        .then((user) => {
          if (user) {
            return res.status(400).send({ message: 'Failed! Email is already in use!' });
          }
          next();
        })
        .catch((err) => {
          return res.status(500).send({ message: err });
        });
    })
    .catch((err) => {
      return res.status(500).send({ message: err });
    });
};

let checkRolesExisted = (req: Request, res: Response, next: NextCallback) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!Roles.includes(req.body.roles[i])) {
        return res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
      }
    }
  }

  next();
};

export const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

// module.exports = verifySignUp;
