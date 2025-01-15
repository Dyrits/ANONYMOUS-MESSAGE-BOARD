const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const Board = require("../data/models/Board");
const Thread = require("../data/models/Thread");
const argon2 = require("argon2");

chai.use(chaiHttp);

describe("Functional Tests", function () {
  let identifier;

  afterEach(async function () {
    if (identifier) {
      await Thread.deleteOne({ _id: identifier });
      identifier = null;
    }
  });

  it("should create a new thread", (done) => {
    chai
      .request(server)
      .post("/api/threads/testing-thread")
      .send({
        text: "Hello, World!",
        delete_password: "Goodbye, World!",
      })
      .end(async (error, response) => {
        // Check the status code :
        assert.equal(response.status, 201);
        // Check if the response contains the thread :
        assert.exists(response.body["thread"]);
        // Check the existence of the board and thread :
        const board = await Board.findOne({ name: "testing-thread" });
        assert.isNotNull(board);
        const thread = await Thread.findOne({ text: "Hello, World!" });
        assert.isNotNull(thread);
        // Check if the thread is in the board :
        assert.isTrue(board.threads.includes(thread._id));
        // Check the password hashing :
        argon2.verify(thread.password, "Goodbye, World!").then((match) => {
          assert.isTrue(match);
        });
        // Clean up :
        identifier = thread._id;
        done();
      });
  });
});
