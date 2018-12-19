"use strict"

const router = require("express").Router();
const controller = require("../controllers/tarefa-controller");
const auth = require("../middlewares/authentication");

router.get("/", auth, controller.getAll);
router.get("/:id", auth, controller.getById);
router.post("/", auth, controller.post);
router.put("/:id", auth, controller.put);
router.delete("/:id", auth, controller.delete);

module.exports = router;