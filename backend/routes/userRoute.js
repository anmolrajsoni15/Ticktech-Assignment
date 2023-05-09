const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/userController");
const router = express.Router();

router.route("/users").post(createUser).get(getAllUsers);
router.route("/users/:id").get(getUserById).put(updateUserById).delete(deleteUserById);

module.exports = router;
