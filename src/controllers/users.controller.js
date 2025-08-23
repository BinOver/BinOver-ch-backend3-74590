import { usersService } from "../services/index.js";
import __dirname from "../utils/index.js";

const getAllUsers = async (req, res) => {
  const users = await usersService.getAll();
  res.send({ status: "success", payload: users });
};

const getUser = async (req, res) => {
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user)
    return res.status(404).send({ status: "error", error: "User not found" });
  res.send({ status: "success", payload: user });
};

const updateUser = async (req, res) => {
  const updateBody = req.body;
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user)
    return res.status(404).send({ status: "error", error: "User not found" });
  const result = await usersService.update(userId, updateBody);
  res.send({ status: "success", message: "User updated" });
};

const deleteUser = async (req, res) => {
  const userId = req.params.uid;
  const result = await usersService.getUserById(userId);
  //
  if (!result)
    return res.status(404).send({ status: "error", error: "User not found" });
  await usersService.delete(userId);
  //
  res.send({ status: "success", message: "User deleted" });
};

const postUser = async (req, res) => {
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
    res.status(500).send({ status: "error", error: err.message });
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  postUser,
};
