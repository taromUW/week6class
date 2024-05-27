const request = require("supertest");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/user");
const Category = require("../models/category");

describe("/category", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const category = { text: "category text" };
  const category2 = { text: "category text two" };

  const testCategory = [
    {
      text: "Cat1",
    },
    {
      text: "Cat2",
    },
    {
      text: "Cat3",
    },
    {
      text: "Cat4",
    },
  ];
  module.exports = { testCategory };


  describe("Before login", () => {
    describe("POST /", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).post("/category").send(category);
        expect(res.statusCode).toEqual(401);
      });
      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .post("/category")
          .set("Authorization", "Bearer BAD")
          .send(category);
        expect(res.statusCode).toEqual(401);
      });
    });
    describe("GET /", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).get("/category").send(category);
        expect(res.statusCode).toEqual(401);
      });
      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .get("/category")
          .set("Authorization", "Bearer BAD")
          .send(category);
        expect(res.statusCode).toEqual(401);
      });
    });
    describe("GET /:id", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).get("/category/123").send(category);
        expect(res.statusCode).toEqual(401);
      });
      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .get("/category/456")
          .set("Authorization", "Bearer BAD")
          .send(category);
        expect(res.statusCode).toEqual(401);
      });
    });
  });
  describe("after login", () => {
    const user0 = {
      email: "user0@mail.com",
      password: "123password",
    };
    const user1 = {
      email: "user1@mail.com",
      password: "456password",
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
          .post("/category")
          .set("Authorization", "Bearer " + token0)
          .send(category);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(category);
      });
      it("should store category with userId", async () => {
        await request(server)
          .post("/category")
          .set("Authorization", "Bearer " + token0)
          .send(category);
        const user = await User.findOne({ email: user0.email }).lean();
        const savedCategory = await Category.findOne({ userId: user._id }).lean();
        expect(savedCategory).toMatchObject(category);
      });
      it("should store category with userId for user1", async () => {
        await request(server)
          .post("/category")
          .set("Authorization", "Bearer " + token1)
          .send(category2);
        const user = await User.findOne({ email: user1.email }).lean();
        const savedCategory = await Category.findOne({ userId: user._id }).lean();
        expect(savedCategory).toMatchObject(category2);
      });
    });
    describe("GET /", () => {
      let user0Category;
      let user1Category;
      beforeEach(async () => {
        user0Category = [
          (
            await request(server)
              .post("/category")
              .set("Authorization", "Bearer " + token0)
              .send(category)
          ).body,
          (
            await request(server)
              .post("/category")
              .set("Authorization", "Bearer " + token0)
              .send(category2)
          ).body,
        ];
        user1Category = [
          (
            await request(server)
              .post("/category")
              .set("Authorization", "Bearer " + token1)
              .send(category2)
          ).body,
          (
            await request(server)
              .post("/category")
              .set("Authorization", "Bearer " + token1)
              .send(category)
          ).body,
        ];
      });
      it("should return user0 only their category", async () => {
        const res = await request(server)
          .get("/category")
          .set("Authorization", "Bearer " + token0)
          .send(category);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(user0Category);
      });
      it("should return user1 only their category", async () => {
        const res = await request(server)
          .get("/category")
          .set("Authorization", "Bearer " + token1)
          .send(category);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(user1Category);
      });
    });
    describe("GET /:id", () => {
      let user0Category;
      let user1Category;
      beforeEach(async () => {
        user0Category = [
          (
            await request(server)
              .post("/category")
              .set("Authorization", "Bearer " + token0)
              .send(category)
          ).body,
          (
            await request(server)
              .post("/category")
              .set("Authorization", "Bearer " + token0)
              .send(category2)
          ).body,
        ];
        user1Category = [
          (
            await request(server)
              .post("/category")
              .set("Authorization", "Bearer " + token1)
              .send(category2)
          ).body,
          (
            await request(server)
              .post("/category")
              .set("Authorization", "Bearer " + token1)
              .send(category)
          ).body,
        ];
      });
      it("should return 400 if id is invalid", async () => {
        const res = await request(server)
          .get("/category/123")
          .set("Authorization", "Bearer " + token0)
          .send();
        expect(res.statusCode).toEqual(400);
      });
      it.each([0, 1])("should return user0 category #%#", async (index) => {
        const category = user0Category[index];
        const res = await request(server)
          .get("/category/" + category._id)
          .set("Authorization", "Bearer " + token0)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(category);
      });
      it.each([0, 1])(
        "should not return user0 category #%# from user1",
        async (index) => {
          const category = user1Category[index];
          const res = await request(server)
            .get("/category/" + category._id)
            .set("Authorization", "Bearer " + token0)
            .send();
          expect(res.statusCode).toEqual(404);
        }
      );
      it.each([0, 1])("should return user1 category #%#", async (index) => {
        const category = user1Category[index];
        const res = await request(server)
          .get("/category/" + category._id)
          .set("Authorization", "Bearer " + token1)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(category);
      });
      it.each([0, 1])(
        "should not return user1 category #%# from user0",
        async (index) => {
          const category = user0Category[index];
          const res = await request(server)
            .get("/category/" + category._id)
            .set("Authorization", "Bearer " + token1)
            .send();
          expect(res.statusCode).toEqual(404);
        }
      );
    });
  });
});
