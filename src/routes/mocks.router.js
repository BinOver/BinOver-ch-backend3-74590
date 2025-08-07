import { Router } from "express";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import UserModel from "../dao/models/User.js";
import PetModel from "../dao/models/User.js";

const router = Router();

router.get("/mockingpets", (req, res) => {
  const pets = [];

  for (let i = 0; i < 10; i++) {
    pets.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.person.firstName(),
      species: faker.animal.type(),
      age: faker.number.int({ min: 1, max: 15 }),
      adopted: faker.datatype.boolean(),
    });
  }
  res.json({ status: "success", pets });
});

const generateMockUser = () => {
  const role = ["user", "admin"];
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("coder123", 10),
    role: role[Math.floor(Math.random() * role.length)],
    pets: [],
  };
};

router.get("/mockingusers", (req, res) => {
  const users = [];

  for (let i = 0; i < 50; i++) {
    users.push({
      _id: faker.database.mongodbObjectId(),
      ...generateMockUser(),
    });
  }
  res.json({ status: "success", users });
});

router.post("/generateData", async (req, res) => {
  const { users = 0, pets = 0 } = req.body;

  const userMocks = [];
  for (let i = 0; i < users; i++) {
    userMocks.push(generateMockUser());
  }

  const petMocks = [];
  for (let i = 0; i < pets; i++) {
    petMocks.push({
      name: faker.person.firstName(),
      species: faker.animal.type(),
      age: faker.number.int({ min: 1, max: 15 }),
      adopted: faker.datatype.boolean(),
    });
  }

  try {
    const createdUsers = await UserModel.insertMany(userMocks);
    const createdPets = await PetModel.insertMany(petMocks);

    res.json({
      status: "success",
      usersCreated: createdUsers.lenght,
      petsCreted: createdPets.legth,
    });
  } catch (err) {
    req.logger?.error("Error generando los datos:", err);
    res
      .status(500)
      .json({ status: "error", message: "Error al insertar datos mocks" });
  }
});

export default router;
