function formatarDistancia(metros) {
  return metros.toLocaleString("pt-BR", {
    maximumFractionDigits: 0
  });
}

function criarIconeServico(classe) {
  const caminhos = {
    escola: "./img/icons/escola.png",
    ubs: "./img/icons/ubs.png",
    coleta: "./img/icons/coleta.png"
  };

  return `
    <div class="service-icon ${classe}">
      <img src="${caminhos[classe]}" alt="">
    </div>
  `;
}

function criarBotaoMostrarMapa() {
  return `
    <button class="btn-mostrar-mapa" type="button">
      <span>Mostrar<br>no mapa</span>
    </button>
  `;
}

<div
  class="service-card service-card-bairro"
  data-recurso="${classe}"
  data-nome="${graphic.attributes.nome}"
>

function criarServicoMaisProximo(classe, titulo, graphic, distanciaMetros) {
  return `
    <div
      class="service-card service-card-clickable"
      data-recurso="${classe}">

      ${criarIconeServico(classe)}

      <div class="service-content">
        <div class="service-label">${titulo}</div>
        <div class="service-name">${graphic.attributes.nome}</div>
        <div class="service-detail">${formatarDistancia(distanciaMetros)} m</div>
      </div>

      ${criarBotaoMostrarMapa()}
    </div>
  `;
}

function criarIconePrincipal(classe) {
  const caminhos = {
    escola: "./img/icons/escola.png",
    ubs: "./img/icons/ubs.png",
    coleta: "./img/icons/coleta.png",
    municipio: "./img/icons/municipio.png"
  };

  if (classe === "rua") {
    return `<div class="resource-main-icon rua"></div>`;
  }

  return `
    <div class="resource-main-icon ${classe}">
      <img src="${caminhos[classe]}" alt="">
    </div>
  `;
}

function criarCampoRecurso(label, valor, full) {
  if (!valor) {
    return "";
  }

  return `
    <div class="resource-box ${full ? "full" : ""}">
      <div class="resource-box-label">${label}</div>
      <div class="resource-box-value">${valor}</div>
    </div>
  `;
}

function criarPainelRecurso(config) {
  return `
    <div class="resource-panel">
      <div class="resource-header">
        ${criarIconePrincipal(config.classe)}
        <h3>${config.titulo}</h3>
      </div>

      <div class="resource-grid">
        ${config.campos.join("")}
      </div>
    </div>
  `;
}

function renderizarPainelEscola(attr) {
  return criarPainelRecurso({
    classe: "escola",
    titulo: attr.nome,
    campos: [
      criarCampoRecurso("Tipo", attr.tipo, false),
      criarCampoRecurso("Bairro", attr.bairro, false),
      criarCampoRecurso("Endere&ccedil;o", attr.endereco, true),
      criarCampoRecurso("Munic&iacute;pio", "Nova Lima - MG", true)
    ]
  });
}

function renderizarPainelUBS(attr) {
  return criarPainelRecurso({
    classe: "ubs",
    titulo: attr.nome,
    campos: [
      criarCampoRecurso("Tipo", attr.tipo, false),
      criarCampoRecurso("Bairro", attr.bairro, false),
      criarCampoRecurso("Endere&ccedil;o", attr.endereco, true),
      criarCampoRecurso("Telefone", attr.telefone, true),
      criarCampoRecurso("Munic&iacute;pio", "Nova Lima - MG", true)
    ]
  });
}

function renderizarPainelColeta(attr) {
  return criarPainelRecurso({
    classe: "coleta",
    titulo: attr.nome,
    campos: [
      criarCampoRecurso("Tipo", attr.tipo, false),
      criarCampoRecurso("Bairro", attr.bairro, false),
      criarCampoRecurso("Endere&ccedil;o", attr.endereco, true),
      criarCampoRecurso("Materiais", attr.materiais, true),
      criarCampoRecurso("Hor&aacute;rio", attr.horario, true),
      criarCampoRecurso("Munic&iacute;pio", "Nova Lima - MG", true)
    ]
  });
}

function renderizarPainelRua(attr) {
  return criarPainelRecurso({
    classe: "rua",
    titulo: attr.nome,
    campos: [
      criarCampoRecurso("Tipo", attr.tipo, false),
      criarCampoRecurso("Bairro", attr.bairro, false),
      criarCampoRecurso("Sentido", attr.sentido, false),
      criarCampoRecurso("Pavimenta&ccedil;&atilde;o", attr.pavimentacao, false),
      criarCampoRecurso("Extens&atilde;o", attr.extensao, false),
      criarCampoRecurso("Munic&iacute;pio", "Nova Lima - MG", false),
      criarCampoRecurso("Camada", "Rede Vi&aacute;ria", true)
    ]
  });
}

function renderizarPainelMunicipio(dados) {
  return criarPainelRecurso({
    classe: "municipio",
    titulo: `${dados.nome} - ${dados.microrregiao.mesorregiao.UF.sigla}`,
    campos: [
      criarCampoRecurso("Tipo", "Munic&iacute;pio"),
      criarCampoRecurso("C&oacute;digo IBGE", dados.id),
      criarCampoRecurso("Estado", dados.microrregiao.mesorregiao.UF.nome, true),
      criarCampoRecurso("Regi&atilde;o", dados.microrregiao.mesorregiao.UF.regiao.nome, true),
      criarCampoRecurso("Mesorregi&atilde;o", dados.microrregiao.mesorregiao.nome, true),
      criarCampoRecurso("Microrregi&atilde;o", dados.microrregiao.nome, true)
    ]
  });
}

function renderizarPainelBairro(config) {
  const {
    bairro,
    escolasDoBairro,
    ubsDoBairro,
    coletasDoBairro,
    ruasDoBairro,
    extensaoTotalFormatada,
    escolaMaisProxima,
    ubsMaisProxima,
    coletaMaisProxima
  } = config;

  const existemServicosNoBairro =
    escolasDoBairro.length > 0 ||
    ubsDoBairro.length > 0 ||
    coletasDoBairro.length > 0;

  const existemServicosMaisProximos =
    escolaMaisProxima ||
    ubsMaisProxima ||
    coletaMaisProxima;

  return `
    <div class="bairro-panel">
      <div class="bairro-title">
        <div class="bairro-pin"></div>

        <div class="bairro-title-text">
          <h3>${bairro.nome}</h3>
          <div class="bairro-subtitle">Bairro</div>
        </div>
      </div>

      <div class="bairro-grid">
        <div class="bairro-grid-item col-3">
          <div class="bairro-grid-label">Munic&iacute;pio</div>
          <div class="bairro-grid-value small">NOVA LIMA - MG</div>
        </div>

        <div class="bairro-grid-item col-3">
          <div class="bairro-grid-label">&Aacute;rea aproximada</div>
          <div class="bairro-grid-value small">${bairro.area}</div>
        </div>

        <div class="bairro-grid-item col-2">
          <div class="bairro-grid-label">Escolas</div>
          <div class="bairro-grid-value">${escolasDoBairro.length}</div>
        </div>

        <div class="bairro-grid-item col-2">
          <div class="bairro-grid-label">UBS</div>
          <div class="bairro-grid-value">${ubsDoBairro.length}</div>
        </div>

        <div class="bairro-grid-item col-2">
          <div class="bairro-grid-label">Coleta Seletiva</div>
          <div class="bairro-grid-value">${coletasDoBairro.length}</div>
        </div>

        <div class="bairro-grid-item col-3">
          <div class="bairro-grid-label">Ruas</div>
          <div class="bairro-grid-value">${ruasDoBairro.length}</div>
        </div>

        <div class="bairro-grid-item col-3">
          <div class="bairro-grid-label">Extens&atilde;o da rede vi&aacute;ria</div>
          <div class="bairro-grid-value small">${extensaoTotalFormatada} m</div>
        </div>
      </div>

      ${
        existemServicosNoBairro
          ? `
            <div class="painel-section-title">
              Servi&ccedil;os no bairro
            </div>
          `
          : ""
      }

      ${
        escolasDoBairro.length > 0
          ? escolasDoBairro.map(function (graphic) {
              const escola = graphic.attributes;

              return criarServicoNoBairro(
                "escola",
                "",
                graphic,
                escola.endereco
              );
            }).join("")
          : ""
      }

      ${
        ubsDoBairro.length > 0
          ? ubsDoBairro.map(function (graphic) {
              const ubs = graphic.attributes;

              return criarServicoNoBairro(
                "ubs",
                "",
                graphic,
                ubs.endereco
              );
            }).join("")
          : ""
      }

      ${
        coletasDoBairro.length > 0
          ? coletasDoBairro.map(function (graphic) {
              const coleta = graphic.attributes;

              return criarServicoNoBairro(
                "coleta",
                "",
                graphic,
                coleta.endereco
              );
            }).join("")
          : ""
      }

      ${
        existemServicosMaisProximos
          ? `
            <div class="painel-section-title">
              Servi&ccedil;os mais pr&oacute;ximos
            </div>
          `
          : ""
      }

      ${
        escolaMaisProxima
          ? criarServicoMaisProximo(
              "escola",
              "",
              escolaMaisProxima.graphic,
              escolaMaisProxima.distanciaMetros
            )
          : ""
      }

      ${
        ubsMaisProxima
          ? criarServicoMaisProximo(
              "ubs",
              "",
              ubsMaisProxima.graphic,
              ubsMaisProxima.distanciaMetros
            )
          : ""
      }

      ${
        coletaMaisProxima
          ? criarServicoMaisProximo(
              "coleta",
              "",
              coletaMaisProxima.graphic,
              coletaMaisProxima.distanciaMetros
            )
          : ""
      }

      <div class="dica-card">
        <div class="dica-icon"></div>

        <div>
          <strong>Dica</strong>
          <p>
            Clique em "Mostrar no mapa" para visualizar a localiza&ccedil;&atilde;o do servi&ccedil;o e a dist&acirc;ncia at&eacute; este bairro.
          </p>
        </div>
      </div>
    </div>
  `;
}