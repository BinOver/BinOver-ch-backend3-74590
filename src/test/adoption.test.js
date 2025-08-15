import app from "../app.js";
import request from "supertest";
import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import adoptionModel from "../dao/models/Adoption.js";

const { expect } = chai;
chai.use(chaiHttp);

describe("Adoption API", function () {
  let createdAdoptionId;
  before(async function () {
    await mongoose.connect(process.env.MONGO_URI);
  });
  after(async function () {
    await mongoose.connection.close();
  });

  it("Deberia obtener todas las adopciones", async function () {
    const res = await request(app).get("/api/adoptions");
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an("array");
  });

  it("Deberia crear una adopcion", async function () {
    const uid = "68950ff71c89b56bb3b47dbb";
    const pid = "689510775c4d9ded2853c1f3";
    const res = await request(app).post(`/api/adoptions/${uid}/${pid}`);
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Pet adopted");

    const createdAdoption = await adoptionModel
      .findOne({
        owner: uid,
        pet: pid,
      })
      .lean();

    expect(createdAdoption).to.exist;
    createdAdoptionId = createdAdoption._id.toString();
  });

  it("Deberia recupearar una adopcion particular", async function () {
    const res = await request(app).get(`/api/adoptions/${createdAdoptionId}`);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
  });
});
