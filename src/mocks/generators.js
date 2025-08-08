import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export const generateMockUser = () => {
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

export const generateMockPet = () => ({
  name: faker.person.firstName(),
  specie: faker.animal.type(),
  age: faker.number.int({ min: 1, max: 15 }),
  adopted: faker.datatype.boolean(),
});
