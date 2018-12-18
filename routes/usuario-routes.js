"use strict"

const router = require("express").Router();
const controller = require("../controllers/usuario-controller");

router.post("/", controller.register);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.put);
router.delete("/:id", controller.delete);

module.exports = router;