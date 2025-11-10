const uri = "http://localhost:3001/";
const params = new URLSearchParams(window.location.search);
const numeroArea = params.get("area");
const titulo = document.querySelector("header h1");
const lista = document.getElementById("lista-automoveis");

titulo.textContent = `Área ${numeroArea}`;

async function carregarAutomoveis() {
  const response = await fetch(uri + "automoveis");
  const automoveis = await response.json();
  const alocacoes = await (await fetch(uri + "alocacoes")).json();

  const automoveisNaArea = alocacoes.filter(
    (a) => a.area == numeroArea && a.quantidade > 0
  );

  if (automoveisNaArea.length === 0) {
    lista.innerHTML = `<p>Esta área está vazia.</p>`;
    return;
  }

  for (const aloc of automoveisNaArea) {
    const auto = automoveis.find((a) => a.id === aloc.automovelId);
    if (!auto) continue;

    const card = document.createElement("div");
    card.classList.add("automovel-card");
    card.innerHTML = `
      <h2>${auto.modelo}</h2>
      <p>Preço: R$ ${auto.preco.toFixed(2)}</p>
      <button onclick="vender(${auto.id}, ${numeroArea})">Vender</button>
    `;
    lista.appendChild(card);
  }
}

function vender(idAutomovel, area) {
  window.location.href = `venda.html?automovel=${idAutomovel}&area=${area}`;
}

carregarAutomoveis();
