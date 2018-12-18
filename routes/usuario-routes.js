"use strict"

const router = require("express").Router();
const controller = require("../controllers/usuario-controller");
const auth = require("../middlewares/authentication");

router.post("/register", controller.register);
router.post("/auth", controller.authenticate);
router.get("/", auth, controller.getAll);
router.get("/:id", auth, controller.getById);
router.put("/:id", auth, controller.put);
router.delete("/:id", auth, controller.delete);

module.exports = router;