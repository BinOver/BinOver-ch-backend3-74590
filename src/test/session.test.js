import app from "../app.js";
import request from "supertest";
import chai from "chai";
import mongoose from "mongoose";

const { expect } = chai;

describe("Session API", function () {
  let testUser = {
    first_name: "Test First",
    last_name: "Test Last ",
    email: "testuser@test.com",
    password: "coder123",
  };

  before(async function () {
    await mongoose.connect(process.env.MONGO_URI);
  });

  after(async function () {
    await mongoose.connection
      .collection("user")
      .deleteMany({ first_name: "Test First" });
    await mongoose.connection.close();
  });

  it("Deberia registrar un usuario nuevo", async function () {
    const res = await request.post("/api/sessions/register").send(testUser);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("payload");
  });

  it("Deberia loguear la usuario resgistrado", async function () {
    const res = await request
      .post("/api/sessions/login")
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("message", "Logged in");

    const cookies = res.headers["set-cookie"];
    expect(cookies).to.satisfy((arr) =>
      arr.some((c) => c.include("coderCookie"))
    );
  });
  it("Deberia fallar si la constrasenia es incorrecta", async function () {
    const res = await request
      .post("/api/sessions/login")
      .send({ email: testUser.email, password: "passwordincorrecto" });
  });
});
