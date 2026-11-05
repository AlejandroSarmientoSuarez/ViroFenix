const express = require("express");
const router = express.Router();
const { suscribir } = require("../controllers/newsletterController");

router.post("/", suscribir);

module.exports = router;