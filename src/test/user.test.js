import app from "../app.js";
import request from "supertest";
import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

const { expect } = chai;
chai.use(chaiHttp);

describe("User API", function () {
  let createdUserId;
  let notFoundUserId = "00000000ffffffffffffffff";
  before(async function () {
    await mongoose.connect(process.env.MONGO_URI);

    const newUser = await mongoose.model("Users").create({
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "coder123",
      role: "user",
    });
    createdUserId = newUser._id;
  });

  after(async function () {
    await mongoose.model("Users").deleteOne({ _id: createdUserId });
    await mongoose.connection.close();
  });

  it("Deberia obtener todos los usuarios", async function () {
    const res = await request(app).get("/api/users");
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an("array");
  });

  it("Deberia obtener un usuario por uid", async function () {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");

    const res404 = await request(app).get(`/api/users/${notFoundUserId}`);
    expect(res404.status).to.equal(404);
    expect(res404.body.status).to.equal("error");
  });

  it("Deberia actualizar un usuario", async function () {
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send({ first_name: "TestUpdate" });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("User updated");

    const res404 = await request(app).get(`/api/users/${notFoundUserId}`);
    expect(res404.status).to.equal(404);
    expect(res404.body.status).to.equal("error");
  });

  it("Deberia eliminar un usuario", async function () {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("User deleted");

    const check = await request(app).get(`/api/users/${createdUserId}`);
    expect(check.status).to.equal(404);
  });
});
