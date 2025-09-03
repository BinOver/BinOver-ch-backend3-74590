import {
  adoptionsService,
  petsService,
  usersService,
} from "../services/index.js";
import { logger } from "../utils/logger.js";

const getAllAdoptions = async (req, res, next) => {
  try {
    const result = await adoptionsService.getAll();
    res.send({ status: "success", payload: result });
  } catch (error) {
    next(error);
  }
};

const getAdoption = async (req, res, next) => {
  try {
    const adoptionId = req.params.aid;
    const adoption = await adoptionsService.getBy({ _id: adoptionId });
    if (!adoption) {
      logger.warning(
        `GET /api/adoptions/${adoptionId} -> 404 Adoption not found`
      );
      return res
        .status(404)
        .send({ status: "error", error: "Adoption not found" });
    }
    res.send({ status: "success", payload: adoption });
  } catch (error) {
    next(error);
  }
};

const createAdoption = async (req, res, next) => {
  try {
    const { uid, pid } = req.params;
    const user = await usersService.getUserById(uid);
    if (!user) {
      logger.warning(`${user} -> 404 User not found`);
      return res.status(404).send({ status: "error", error: "user Not found" });
    }
    const pet = await petsService.getBy({ _id: pid });
    if (!pet) {
      logger.warning(`${pet} -> 404 Pet not found`);
      return res.status(404).send({ status: "error", error: "Pet not found" });
    }
    if (pet.adopted) {
      logger.warning(`${pet.id} -> 400 Pet is already adopted`);
      return res
        .status(400)
        .send({ status: "error", error: "Pet is already adopted" });
    }
    user.pets.push(pet._id);
    await usersService.update(user._id, { pets: user.pets });
    await petsService.update(pet._id, { adopted: true, owner: user._id });
    await adoptionsService.create({ owner: user._id, pet: pet._id });
    res.send({ status: "success", message: "Pet adopted" });
  } catch (error) {
    next(error);
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};
