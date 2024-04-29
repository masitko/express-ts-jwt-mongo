import { Request, Response } from "express";

import User, { IUser } from "../models/user.model";

exports.allAccess = (req: Request, res: Response) => {
  res.status(200).send('Public Content.');
};

exports.userBoard = (req: Request, res: Response) => {
  res.status(200).send('User Content.');
};

exports.adminBoard = (req: Request, res: Response) => {
  res.status(200).send('Admin Content.');
};

exports.moderatorBoard = (req: Request, res: Response) => {
  res.status(200).send('Moderator Content.');
};

exports.getUser = (req: Request, res: Response) => {
  console.log(req.params);
  User.findById(req.params.userId)
    .populate('roles')
    .exec()
    .then((user) => {
      res.send(user);
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err });
    });
};

exports.updateUser = (req: Request, res: Response) => {
  console.log(req.params);
  console.log(req.body);

  User.updateOne({ _id: req.params.userId }, req.body)
    .exec()
    .then(() => {
      res.send({ message: 'User was updated successfully!' });
    })
    .catch((err: Error) => {
      console.log(err);
      res.status(500).send({ message: err });
    });
};

exports.getAllUsers = (req: Request, res: Response) => {
  console.log(req.params);
  console.log(req.body);
  User.find(req.params.searchWord ? { username: { $regex: req.params.searchWord, $options: 'i' } } : {})
    .populate('roles')
    .exec()
    .then((users) => {
      res.send(users);
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err });
    });
};
