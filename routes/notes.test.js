const request = require("supertest");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/user");
const Note = require("../models/note");
const Category = require("../models/category");

const { testCategory } = require('./category.test');

describe("/notes", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

let savedCategory;  
const note = { text: "note text" };
const note2 = { text: "note text two" };

beforeEach(async () => {
    savedCategory = await Category.insertMany(testCategory);
    savedCategory = savedCategory.map((category) => ({
      ...category.toObject(),
      _id: category._id.toString()
    }));

    note.categoryId = savedCategory[0]._id;
    note2.categoryId = savedCategory[1]._id;
/* 
    const savedBooks = await Books.insertMany(testBooks);
    testBooks.forEach((book, index) => {
      book._id = savedBooks[index]._id.toString();
    }); */

    const savedNote1 = await Note.insertMany(note);
    const savedNote2 = await Note.insertMany(note2);
//    note._id = savedNote1._id.toString();
//    note2._id = savedNote2._id.toString();
    
    note._id = savedNote1._id;
    note2._id = savedNote2._id;
  });

  afterEach(testUtils.clearDB);


  describe("Before login", () => {
    describe("POST /", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).post("/notes").send(note);
        expect(res.statusCode).toEqual(401);
      });
      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .post("/notes")
          .set("Authorization", "Bearer BAD")
          .send(note);
        expect(res.statusCode).toEqual(401);
      });
    });
    describe("GET /", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).get("/notes").send(note);
        expect(res.statusCode).toEqual(401);
      });
      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .get("/notes")
          .set("Authorization", "Bearer BAD")
          .send(note);
        expect(res.statusCode).toEqual(401);
      });
    });
    describe("GET /:id", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).get("/notes/123").send(note);
        expect(res.statusCode).toEqual(401);
      });
      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .get("/notes/456")
          .set("Authorization", "Bearer BAD")
          .send(note);
        expect(res.statusCode).toEqual(401);
      });
    });
  });
  describe("after login", () => {
    const user0 = {
      email: "user0@mail.com",
      password: "123password",
      role: "admin"
    };
    const user1 = {
      email: "user1@mail.com",
      password: "456password",
      role: "admin"
    };
    let token0;
    let token1;
    beforeEach(async () => {
      await request(server).post("/auth/signup").send(user0);
      const res0 = await request(server).post("/auth/login").send(user0);
      token0 = res0.body.token;
      await request(server).post("/auth/signup").send(user1);
      const res1 = await request(server).post("/auth/login").send(user1);
      token1 = res1.body.token;
    });
    describe("POST /", () => {
      it("should send 200", async () => {
        const res = await request(server)
          .post("/notes")
          .set("Authorization", "Bearer " + token0)
          .send(note);
        expect(res.statusCode).toEqual(200);
        expect(res.body.text).toEqual(note.text);
      });
    });
    describe("GET /:id", () => {
      let user0Notes;
      let user1Notes;
      beforeEach(async () => {
        user0Notes = [
          (
            await request(server)
              .post("/notes")
              .set("Authorization", "Bearer " + token0)
              .send(note)
          ).body,
          (
            await request(server)
              .post("/notes")
              .set("Authorization", "Bearer " + token0)
              .send(note2)
          ).body,
        ];
        user1Notes = [
          (
            await request(server)
              .post("/notes")
              .set("Authorization", "Bearer " + token1)
              .send(note2)
          ).body,
          (
            await request(server)
              .post("/notes")
              .set("Authorization", "Bearer " + token1)
              .send(note)
          ).body,
        ];
      });
      it("should return 400 if id is invalid", async () => {
        const res = await request(server)
          .get("/notes/123")
          .set("Authorization", "Bearer " + token0)
          .send();
        expect(res.statusCode).toEqual(400);
      });
      it("should return 200 for GET", async () => {
        const res = await request(server)
          .get("/notes")
          .set("Authorization", "Bearer " + token0)
          .send();
        expect(res.statusCode).toEqual(200);
      });
      it.each([0, 1])("should return user0 note #%#", async (index) => {
        const note = user0Notes[index];
        const res = await request(server)
          .get("/notes/" + note._id)
          .set("Authorization", "Bearer " + token0)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(note);
      });
      it.each([0, 1])("should return user1 note #%#", async (index) => {
        const note = user1Notes[index];
        const res = await request(server)
          .get("/notes/" + note._id)
          .set("Authorization", "Bearer " + token1)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(note);
      });
      it.each([0, 1])("should delete user0 note #%#", async (index) => {
        const note = user0Notes[index];
        const res = await request(server)
          .delete("/notes/" + note._id)
          .set("Authorization", "Bearer " + token0)
          .send();
        expect(res.statusCode).toEqual(200);
      });

    });
  });
});
