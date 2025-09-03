import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import { logger } from "../utils/logger.js";

const getAllPets = async (req, res, next) => {
  try {
    const pets = await petsService.getAll();
    res.send({ status: "success", payload: pets });
  } catch (error) {
    next(error);
  }
};

const createPet = async (req, res, next) => {
  try {
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate) {
      logger.warning(`400 Incomplete values`);
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }
    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    const result = await petsService.create(pet);
    res.send({ status: "success", payload: result });
  } catch (error) {
    next(error);
  }
};

const updatePet = async (req, res, next) => {
  try {
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    //validacion de existencia de mascota
    const isPet = await petsService.getBy({ _id: petId });
    if (!isPet) {
      logger.warning(`${petId} -> 404 Pet not found`);
      return res.status(404).send({ status: "error", error: "Pet not found" });
    }
    //
    const result = await petsService.update(petId, petUpdateBody);
    res.send({ status: "success", message: "pet updated" });
  } catch (error) {
    next(error);
  }
};

const deletePet = async (req, res, next) => {
  try {
    const petId = req.params.pid;
    //validacion de existencia de mascota
    const isPet = await petsService.getBy({ _id: petId });
    if (!isPet) {
      logger.warning(`${petId} -> 404 Pet not found`);
      return res.status(404).send({ status: "error", error: "Pet not found" });
    }
    //
    const result = await petsService.delete(petId);
    res.send({ status: "success", message: "pet deleted" });
  } catch (error) {
    next(error);
  }
};

const createPetWithImage = async (req, res, next) => {
  try {
    const file = req.file;
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate) {
      logger.warning(`400 Incomplete values`);
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }
    console.log(file);
    const pet = PetDTO.getPetInputFrom({
      name,
      specie,
      birthDate,
      image: `${__dirname}/../public/pets/${file.filename}`,
    });
    console.log(pet);
    const result = await petsService.create(pet);
    res.send({ status: "success", payload: result });
  } catch (error) {
    next(error);
  }
};
export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
};
