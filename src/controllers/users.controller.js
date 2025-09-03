import { usersService } from "../services/index.js";
import __dirname from "../utils/index.js";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await usersService.getAll();
    res.send({ status: "success", payload: users });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user)
      return res.status(404).send({ status: "error", error: "User not found" });
    res.send({ status: "success", payload: user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user)
      return res.status(404).send({ status: "error", error: "User not found" });
    const result = await usersService.update(userId, updateBody);
    res.send({ status: "success", message: "User updated" });
  } catch (error) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const result = await usersService.getUserById(userId);
    //validacion de existencia de Usuario
    if (!result)
      return res.status(404).send({ status: "error", error: "User not found" });
    //
    await usersService.delete(userId);
    res.send({ status: "success", message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

const postUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user)
      return res.status(404).send({ status: "error", error: "User not found" });
    const docs = req.files.map((file) => ({
      name: file.originalname,
      reference: `${__dirname}/../public/documents/${file.filename}`,
    }));
    user.documents.push(...docs);
    await user.save();

    res.send({ status: "success", payload: user });
  } catch (err) {
    next(err);
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  postUser,
};
