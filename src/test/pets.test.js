import app from "../app.js";
import request from "supertest";
import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

const { expect } = chai;
chai.use(chaiHttp);

describe("Pets API", function () {
  let createdPetId;
  before(async function () {
    await mongoose.connect(process.env.MONGO_URI);
  });

  after(async function () {
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

    const res = await request(app).post("/api/pets").send(newPet);
    expect(res).to.have.status(200);
    expect(res.body.payload).to.include.keys("_id", "name");
    createdPetId = res.body.payload._id;
    console.log(createdPetId);
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
