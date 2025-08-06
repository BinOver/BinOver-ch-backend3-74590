import { Router } from "express";
import { faker } from "@faker-js/faker";

const router = Router();

router.get("/pets", (req, res) => {
  const pets = [];

  for (let i = 0; i < 10; i++) {
    pets.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.animal.dog(),
      species: faker.animal.type(),
      age: faker.number.int({ min: 1, max: 15 }),
      adopted: faker.datatype.boolean(),
    });
  }
  res.json({ status: "success", pets });
});

export default router;
