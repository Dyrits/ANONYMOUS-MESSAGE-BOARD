"use strict";
const Board = require("../data/models/Board.js");
const Thread = require("../data/models/Thread.js");

module.exports = function (app) {
  app.route("/api/threads/:board")
    .post(async function ({ params, body }, response) {
      const { text, delete_password: password } = body;
      try {
        let board = await Board.findOne({ name: params.board });
        if (!board) {
          board = await Board.create({ name: params.board });
        }
        const thread = await Thread.create({ text, password });
        board.threads.push(thread._id);
        await board.save();
        response.status(201).json({ thread });
      } catch (error) {
        response.status(500).json({ error: "An error occurred while creating the thread" });
      }
    })
    .get(async function ({ params }, response) {
      try {
        const board = await Board.findOne({ name: params.board }).populate({
          path: "threads",
          options: {
            sort: { bumped_on: -1 },
            limit: 10,
            populate: {
              path: "replies",
              select: "-reported -delete_password",
              options: {
                sort: { created_on: -1 },
                limit: 3
              }
            }
          }
        });
        if (!board) {
          response.status(404).json({ error: "The requested board does not exist." });
        } else {
          response.json({ threads: board.threads });
        }
      } catch (error) {
        response.status(500).json({ error: "An error occurred while fetching the threads" });
      }
    })
  app.route("/api/replies/:board")
    .post(async function ({ params, body }, response) {
      // Implement the logic for handling replies here
    });
};