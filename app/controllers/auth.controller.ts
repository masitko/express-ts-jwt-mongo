import { Request, Response } from "express";

const config = require('../config/auth.config');

import User, { IUser } from "../models/user.model";
import Role, { IRole } from "../models/role.model";

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = (req: Request, res: Response) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user
    .save()
    .then((user) => {
      let roles = req.body.roles ? req.body.roles : ['user'];
      Role.find({
        name: { $in: roles }
      })
        .then((roles) => {
          user.roles = roles.map((role) => role._id);
          user
            .save()
            .then((saved) => {
              res.status(201).send({
                message: 'User was registered successfully!',
                user: saved,
              });
            })
            .catch((err) => {
              return res.status(500).send({ message: err });
            });
        })
        .catch((err) => {
          return res.status(500).send({ message: err });
        });
    })
    .catch((err) => {
      return res.status(500).send({ message: err });
    });
};

exports.signin = (req: Request, res: Response) => {
  User.findOne({
    username: req.body.username
  })
    .populate<{ roles: IRole[] }>('roles')
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'User Not found.' });
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!'
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400 // 24 hours
      });

      const authorities: string[] = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push('ROLE_' + (user.roles[i]?.name?.toUpperCase() ?? ''));
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roleNames: authorities,
        accessToken: token
      });
    })
    .catch((err) => {
      return res.status(500).send({ message: err });
    });
};
