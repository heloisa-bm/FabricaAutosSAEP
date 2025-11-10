const express = require("express");
const router = express.Router();

const Automovel = require("./controllers/automovel");
const Concessionaria = require("./controllers/concessionaria");
const Cliente = require("./controllers/cliente");
const Alocacao = require("./controllers/alocacao");
const Venda = require("./controllers/venda");

router.get("/", (req, res) => {
  res.json({ titulo: "Fábrica de Automóveis 2025" });
});

router.get("/automoveis", Automovel.read);
router.get("/concessionarias", Concessionaria.read);
router.get("/clientes", Cliente.read);
router.get("/alocacoes", Alocacao.read);
router.get("/vendas", Venda.read);

module.exports = router;
