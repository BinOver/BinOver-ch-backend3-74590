import { Router } from "express";
import UserModel from "../dao/models/User.js";
import PetModel from "../dao/models/Pet.js";
import { generateMockUser, generateMockPet } from "../mocks/generators.js";

const router = Router();

router.get("/mockingpets", async (req, res) => {
  const pets = await PetModel.find();
  res.json({ status: "success", pets });
});

router.get("/mockingusers", async (req, res) => {
  const users = await UserModel.find();
  res.json({ status: "success", users });
});

router.post("/generateData", async (req, res) => {
  const { users = 0, pets = 0 } = req.body;

  const userMocks = [];
  const petMocks = [];

  for (let i = 0; i < users; i++) {
    userMocks.push(generateMockUser());
  }

  for (let i = 0; i < pets; i++) {
    petMocks.push(generateMockPet());
  }

  try {
    const createdUsers = await UserModel.insertMany(userMocks);
    const createdPets = await PetModel.insertMany(petMocks);

    res.status(201).json({
      status: "success",
      message: "Datos generados e insetados correctamente",
      usersCreated: createdUsers.length,
      petsCreted: createdPets.length,
    });
  } catch (err) {
    req.logger?.error("Error generando los datos:", err);
    res
      .status(500)
      .json({ status: "error", message: "Error al insertar datos mocks" });
  }
});

export default router;
