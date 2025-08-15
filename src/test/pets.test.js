import app from "../app.js";
import request from "supertest";
import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import path from "path";

const { expect } = chai;
chai.use(chaiHttp);

describe("Pets API", function () {
  let createdPetId;
  let createdPetWithImageId;
  before(async function () {
    await mongoose.connect(process.env.MONGO_URI);
  });

  after(async function () {
    await mongoose.model("Pets").deleteOne({ _id: createdPetId });
    await mongoose.model("Pets").deleteOne({ _id: createdPetWithImageId });
    await mongoose.connection.close();
  });

  it("Deberia devolver todas las mascotas", async function () {
    const res = await request(app).get("/api/pets");
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an("array");
  });

  it("Deberia crear una mascota", async function () {
    const newPet = {
      name: "Test",
      specie: "test",
      birthDate: "1/1/1981",
    };

    const newPet400 = {
      name: "Test",
      specie: "test",
    };

    const res = await request(app).post("/api/pets").send(newPet);
    expect(res).to.have.status(200);
    expect(res.body.payload).to.include.keys("_id", "name");
    createdPetId = res.body.payload._id;

    const res400 = await request(app).post("/api/pets").send(newPet400);
    expect(res400).to.have.status(400);
    expect(res400.body.error).to.equal("Incomplete values");
  });

  it("Deberia crear una mascota con imagen", async function () {
    const imagePath = path.join(
      process.cwd(),
      "src/public/img/1671549990926-coderDog.jpg"
    );
    const newPetWithImage = {
      name: "Test",
      species: "test",
      birthDate: "1/1/1981",
    };

    const res = await request(app)
      .post("/api/pets/withimage")
      .field("name", newPetWithImage.name)
      .field("specie", newPetWithImage.species)
      .field("birthDate", newPetWithImage.birthDate)
      .attach("image", imagePath);
    expect(res).to.have.status(200);
    expect(res.body.payload).to.include.keys("_id", "name", "image");
    createdPetWithImageId = res.body.payload._id;

    const res400 = await request(app)
      .post("/api/pets/withimage")
      .field("name", newPetWithImage.name)
      .field("specie", newPetWithImage.species);
    // .attach("image", imagePath);
    expect(res400).to.have.status(400);
    expect(res400.body.error).to.equal("Incomplete values");
  });

  it("Deberia actualizar una mascota", async function () {
    const res = await request(app)
      .put(`/api/pets/${createdPetId}`)
      .send({ name: "TestUpdate" });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("pet updated");
  });

  it("Deberia borrar una mascota", async function () {
    const res = await request(app).delete(`/api/pets/${createdPetId}`);
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("pet deleted");

    const check = await request(app).get(`/api/pets/${createdPetId}`);
    expect(check.status).to.equal(404);
  });
});
