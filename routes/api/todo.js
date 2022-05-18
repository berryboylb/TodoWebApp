const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

//for protected routes
const auth = require("../../middleware/auth");
//todo model
const Todo = require("../../models/Todo");

//@route GET
//@description get all todo items for one user
//@access private
router.get("/:page/:perPage", auth, async (req, res) => {
  try {
    //get all items where user is the same as the req.user.id no pagination
    // const todo = await Todo.find({
    //   "user": {
    //     $in: [mongoose.Types.ObjectId(req.user.id)],
    //   },
    // }).sort({ _id: -1});

    //get all items where user is the same as the req.user.id there is pagination pagination
    const { page, perPage } = req.params;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,
      sort: { '_id': -1 }
    };
    const todo = await Todo.paginate(
      {
        user: {
          $in: [mongoose.Types.ObjectId(req.user.id)],
        },
      },
      options
    );
    if (todo.length === 0)
      return res.status(404).json({ msg: "Todo is empty" });
    if (!todo) return res.status(404).json({ msg: "Todo not found" });
    res.json(todo);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route POST
//@description add a new todo
//@access private
router.post(
  "/",
  [
    auth,
    [check("text", "Task length must be longer than 6").isLength({ min: 6 })],
  ],
  async (req, res) => {
    //get valiadtion result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //if there are errors
      return res.status(400).json({ errors: errors.array() });
    }
    //pull the fields out
    const { text } = req.body;
    try {
      //create a new todo instance
      const newTodo = new Todo({
        text: text,
        user: req.user.id,
      });
      //save it
      await newTodo.save();
      //save the todo item
      res.json(newTodo);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route POST
//@description delete a todo
//@access private
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await Todo.findById({ _id: req.params.id });
    if (!item) return res.status(404).json({ msg: "Item does not exist" });
    //check user
    if (item.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });
    //delete the item
    await item.remove();
    res.json({ msg: "Todo Deleted" });
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId")
      return res.status(400).json({ msg: "Item not found" });
    res.status(500).send("Server Error");
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const item = await Todo.findById({ _id: req.params.id });
    if (!item) return res.status(404).json({ msg: "Item does not exist" });
    //check user
    if (item.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });
    //change item.reminder to the inverse of what it was
    item.reminder = !item.reminder;
    await item.save();
    res.json(item);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
