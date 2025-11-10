const uri = "http://localhost:3001/";
const titulo = document.querySelector("header h1");

let alocacoes = [];
let automoveis = [];
let clientes = [];
let concessionarias = [];

const modalArea = document.getElementById("modal-area");
const modalVenda = document.getElementById("modal-venda");
const tituloArea = document.getElementById("tituloArea");
const listaAutomoveis = document.getElementById("listaAutomoveis");
const tituloVenda = document.getElementById("tituloVenda");
const selectCliente = document.getElementById("cliente");
const selectConcessionaria = document.getElementById("concessionaria");
const btnConfirmar = document.getElementById("confirmarVenda");

let automovelSelecionado = null;
let areaSelecionada = null;

async function carregarTitulo() {
  try {
    const response = await fetch(uri);
    const data = await response.json();
    titulo.textContent = data.titulo || "Fábrica de Automóveis";
  } catch (error) {
    console.error("Erro ao buscar título:", error);
    titulo.textContent = "Erro ao conectar com o servidor";
  }
}

async function carregarDados() {
  try {
    const [autoRes, aloRes, cliRes, conRes] = await Promise.all([
      fetch(uri + "automoveis"),
      fetch(uri + "alocacoes"),
      fetch(uri + "clientes"),
      fetch(uri + "concessionarias"),
    ]);

    automoveis = await autoRes.json();
    alocacoes = await aloRes.json();
    clientes = await cliRes.json();
    concessionarias = await conRes.json();

    console.log("Automóveis:", automoveis);
    console.log("Alocações:", alocacoes);
    console.log("Concessionárias:", concessionarias);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    alert("Erro ao carregar dados do servidor");
  }
}

async function montarAreas() {
  const main = document.querySelector("main");
  main.innerHTML = "";
  for (let i = 1; i <= 11; i++) {
    const area = document.createElement("div");
    area.id = `area-${i}`;
    area.innerHTML = `<p>${i}</p>`;
    main.appendChild(area);
    area.addEventListener("click", () => abrirDetalhes(i));
  }
}

async function pintarAreas() {
  for (const aloc of alocacoes) {
    const numeroArea = aloc.area;
    const qtd = aloc.quantidade;
    if (numeroArea && qtd > 0) {
      const area = document.querySelector(`#area-${numeroArea}`);
      if (area) area.classList.add("alocado");
    }
  }
}

function abrirDetalhes(numeroArea) {
  const automoveisNaArea = alocacoes.filter(
    (a) => a.area === numeroArea && a.quantidade > 0
  );

  if (automoveisNaArea.length === 0) {
    alert(`A área ${numeroArea} está vazia!`);
    return;
  }

  tituloArea.textContent = `Área ${numeroArea}`;
  listaAutomoveis.innerHTML = "";
  areaSelecionada = numeroArea;

  automoveisNaArea.forEach((aloc) => {
    const auto = automoveis.find((a) => a.id === aloc.automovel);
    if (!auto) return;

    const card = document.createElement("div");
    card.classList.add("automovel-card");
    card.innerHTML = `
      <h3>${auto.modelo}</h3>
      <p>Preço: R$ ${Number(auto.preco).toFixed(2)}</p>
      <button>Vender</button>
    `;
    card
      .querySelector("button")
      .addEventListener("click", () => abrirVenda(auto, numeroArea));
    listaAutomoveis.appendChild(card);
  });

  modalArea.style.display = "flex";
}

function abrirVenda(auto, area) {
  automovelSelecionado = auto;
  tituloVenda.textContent = `Vender ${auto.modelo}`;
  modalArea.style.display = "none";
  modalVenda.style.display = "flex";

  selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';
  clientes.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.nome;
    selectCliente.appendChild(opt);
  });

  selectConcessionaria.innerHTML =
    '<option value="">Selecione uma concessionária</option>';

  const concessionariasValidas = alocacoes
    .filter(
      (a) => a.automovel === auto.id && a.area === area && a.quantidade > 0
    )
    .map((a) => concessionarias.find((c) => c.id === a.concessionaria))
    .filter(Boolean);

  const unicas = [];
  const idsAdicionados = new Set();

  concessionariasValidas.forEach((c) => {
    if (!idsAdicionados.has(c.id)) {
      idsAdicionados.add(c.id);
      unicas.push(c);
    }
  });

  if (unicas.length === 0) {
    const opt = document.createElement("option");
    opt.textContent = "Nenhuma concessionária disponível";
    selectConcessionaria.appendChild(opt);
  } else {
    unicas.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.concessionaria;
      selectConcessionaria.appendChild(opt);
    });
  }

  verificarCampos();
}

function verificarCampos() {
  btnConfirmar.disabled = !(selectCliente.value && selectConcessionaria.value);
}
selectCliente.addEventListener("change", verificarCampos);
selectConcessionaria.addEventListener("change", verificarCampos);

btnConfirmar.addEventListener("click", async () => {
  if (!automovelSelecionado) return;

  const venda = {
    clienteId: Number(selectCliente.value),
    concessionariaId: Number(selectConcessionaria.value),
    automovelId: Number(automovelSelecionado.id),
    area: Number(areaSelecionada),
  };

  try {
    const response = await fetch(uri + "vendas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(venda),
    });

    if (response.ok) {
      alert("Venda concluída com sucesso!");
      modalVenda.style.display = "none";
      await carregarDados();
      await pintarAreas();
    } else {
      alert("Erro ao realizar a venda.");
    }
  } catch (e) {
    console.error("Erro ao enviar venda:", e);
    alert("Falha na conexão ao registrar venda.");
  }
});

document.getElementById("fecharArea").onclick = () =>
  (modalArea.style.display = "none");
document.getElementById("fecharVenda").onclick = () =>
  (modalVenda.style.display = "none");

async function inicializar() {
  await carregarTitulo();
  await carregarDados();
  await montarAreas();
  await pintarAreas();
}

inicializar();
