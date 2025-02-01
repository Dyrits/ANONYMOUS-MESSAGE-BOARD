const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const argon2 = require("argon2");

const server = require("../server");
const Board = require("../data/models/Board");
const Thread = require("../data/models/Thread");
const Reply = require("../data/models/Reply");


chai.use(chaiHttp);

describe("Functional Tests", function () {
  this.timeout(10000);
  // Create a data object to store the board, threads, and replies used in the tests:
  const data = {
    board: null,
    threads: [],
    replies: [],
  }

  beforeEach(async function () {
    // Clean up any leftover data from previous tests:
    await Board.deleteMany({ name: data.board });
    await Thread.deleteMany({ _id: { $in: data.threads } });
    await Reply.deleteMany({ _id: { $in: data.replies } });

    // Reset test data:
    data.board = crypto.randomUUID();
    data.threads = [];
    data.replies = [];

    // Create 12 threads, each with 4 replies:
    const board = await Board.create({ name: data.board });
    for (let $thread = 0; $thread < 15; $thread ++) {
      const thread = await Thread.create({
        text: `Thread #${$thread}`,
        password: await argon2.hash("thread-password"),
      });
      data.threads.push(thread._id);
      board.threads.push(thread._id);
      for (let $reply = 0; $reply < 5; $reply++) {
        const reply = await Reply.create({
          text: `Reply ${$reply} to Thread ${$thread}`,
          password: await argon2.hash("password"),
        });
        data.replies.push(reply._id);
        thread.replies.push(reply._id);
      }
      await thread.save();
    }
    await board.save();
  });

  afterEach(async function () {
    // Clean up threads and replies created during this test:
    await Thread.deleteMany({ _id: { $in: data.threads } });
    await Reply.deleteMany({ _id: { $in: data.replies } });

    // Clean up board created during this test:
    await Board.deleteMany({ name: data.board });
  });

  it("should create a new thread", (done) => {
    chai
      .request(server)
      .post(`/api/threads/${data.board}`)
      .send({
        text: "Hello, World!",
        delete_password: "Goodbye, World!",
      })
      .end(async (error, response) => {
        // Check the status code:
        assert.equal(response.status, 201);
        // Check if the response contains the thread:
        assert.exists(response.body["thread"]);
        // Check the existence of the board and thread:
        const board = await Board.findOne({ name: data.board });
        assert.isNotNull(board);
        const thread = await Thread.findOne({ text: "Hello, World!" });
        data.threads.push(thread._id);
        assert.isNotNull(thread);
        // Check if the thread is in the board:
        assert.isTrue(board.threads.includes(thread._id));
        // Check the password hashing:
        argon2.verify(thread.password, "Goodbye, World!").then((match) => {
          assert.isTrue(match);
        });
        // Clean up :
        done();
      });
  });

  it("should get the 10 most recent threads (with 3 replies)", (done) => {
    chai
      .request(server)
      .get(`/api/threads/${data.board}`)
      .end(async (error, response) => {
        // Check the status code:
        assert.equal(response.status, 200);
        // Check if the response contains the threads:
        assert.exists(response.body["threads"]);
        assert.isArray(response.body["threads"]);
        assert.lengthOf(response.body["threads"], 10);
        // Check the replies:
        assert.lengthOf(response.body["threads"][0].replies, 3);
        done();
      });
  });
});
