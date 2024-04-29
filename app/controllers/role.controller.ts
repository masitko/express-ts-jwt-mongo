import { Request, Response } from "express";
import Role from '../models/role.model';

exports.getAllRoles = (req: Request, res: Response) => {
  Role.find()
    .exec()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};
