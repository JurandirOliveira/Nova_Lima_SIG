async function processarClique(event, contexto) {
  const {
    view,
    CAMADAS,
    novaLimaLayer,
    geometryEngine,
    codigoNovaLima
  } = contexto;

  const bairrosLayer = CAMADAS.bairros.layer;
  const escolasLayer = CAMADAS.escolas.layer;
  const ubsLayer = CAMADAS.ubs.layer;
  const ruasLayer = CAMADAS.ruas.layer;
  const coletaLayer = CAMADAS.coleta.layer;

  const response = await view.hitTest(event);

  function buscarResultado(layer) {
    return response.results.find(function (result) {
      return result.graphic && result.graphic.layer === layer;
    });
  }

  function atualizarPainel(html) {
    const info = document.getElementById("info");
    info.innerHTML = html;
    info.scrollTop = 0;
  }
  
  function formatarDistanciaLocal(metros) {
  return metros.toLocaleString("pt-BR", {
    maximumFractionDigits: 0
  });
}

  const ubsResultado = buscarResultado(ubsLayer);

  if (ubsResultado) {
    selecionarFeature({
      graphic: ubsResultado.graphic,
      selectedSymbol: CAMADAS.ubs.selectedSymbol,
      zoom: 16
    });

    atualizarPainel(
      renderizarPainelUBS(ubsResultado.graphic.attributes)
    );
    
return;
  }

  const escolaResultado = buscarResultado(escolasLayer);

  if (escolaResultado) {
    selecionarFeature({
      graphic: escolaResultado.graphic,
      selectedSymbol: CAMADAS.escolas.selectedSymbol,
      zoom: 16
    });

    atualizarPainel(
      renderizarPainelEscola(escolaResultado.graphic.attributes)
    );

    return;
  }

  const coletaResultado = buscarResultado(coletaLayer);

  if (coletaResultado) {
    selecionarFeature({
      graphic: coletaResultado.graphic,
      selectedSymbol: CAMADAS.coleta.selectedSymbol,
      zoom: 16
    });

    atualizarPainel(
      renderizarPainelColeta(coletaResultado.graphic.attributes)
    );

    return;
  }

  const ruaResultado = buscarResultado(ruasLayer);

  if (ruaResultado) {
    selecionarFeature({
      graphic: ruaResultado.graphic,
      selectedSymbol: CAMADAS.ruas.selectedSymbol,
      zoom: 16
    });

    atualizarPainel(
      renderizarPainelRua(ruaResultado.graphic.attributes)
    );

    return;
  }

  const bairroResultado = buscarResultado(bairrosLayer);

  if (bairroResultado) {
    selecionarFeature({
      graphic: bairroResultado.graphic,
      selectedSymbol: CAMADAS.bairros.selectedSymbol,
      zoom: 14
    });

    const bairro = bairroResultado.graphic.attributes;
    const bairroGeometry = bairroResultado.graphic.geometry;

    const escolasDoBairro = escolasLayer.graphics.items.filter(function (graphic) {
      return geometryEngine.contains(bairroGeometry, graphic.geometry);
    });

    const ubsDoBairro = ubsLayer.graphics.items.filter(function (graphic) {
      return geometryEngine.contains(bairroGeometry, graphic.geometry);
    });

    const coletasDoBairro = coletaLayer.graphics.items.filter(function (graphic) {
      return geometryEngine.contains(bairroGeometry, graphic.geometry);
    });

    const ruasDoBairro = ruasLayer.graphics.items.filter(function (graphic) {
      return geometryEngine.intersects(bairroGeometry, graphic.geometry) ||
        graphic.attributes.bairro === bairro.nome;
    });

    let extensaoTotalRuas = 0;

    ruasDoBairro.forEach(function (graphic) {
      extensaoTotalRuas += geometryEngine.geodesicLength(
        graphic.geometry,
        "meters"
      );
    });

    const extensaoTotalFormatada = formatarDistanciaLocal(extensaoTotalRuas);

    let escolaMaisProxima = null;
    let ubsMaisProxima = null;
    let coletaMaisProxima = null;

    if (escolasDoBairro.length === 0) {
      escolaMaisProxima = encontrarMaisProximo(
        bairroGeometry,
        escolasLayer.graphics.items,
        geometryEngine
      );
    }

    if (ubsDoBairro.length === 0) {
      ubsMaisProxima = encontrarMaisProximo(
        bairroGeometry,
        ubsLayer.graphics.items,
        geometryEngine
      );
    }

    if (coletasDoBairro.length === 0) {
      coletaMaisProxima = encontrarMaisProximo(
        bairroGeometry,
        coletaLayer.graphics.items,
        geometryEngine
      );
    }

    atualizarPainel(
      renderizarPainelBairro({
        bairro,
        escolasDoBairro,
        ubsDoBairro,
        coletasDoBairro,
        ruasDoBairro,
        extensaoTotalFormatada,
        escolaMaisProxima,
        ubsMaisProxima,
        coletaMaisProxima
      })
    );
    
    registrarEventosPainel(
      bairroGeometry,
      escolaMaisProxima,
      ubsMaisProxima,
      coletaMaisProxima
    );

    return;
  }

  const municipioResultado = buscarResultado(novaLimaLayer);

  if (!municipioResultado) {
    limparSelecao();
    atualizarPainel("Clique em Nova Lima ou em uma fei&ccedil;&atilde;o");
    return;
  }

  limparSelecao();

  atualizarPainel("Carregando dados...");

  const dados = await buscarDadosMunicipio(codigoNovaLima);

  atualizarPainel(
    renderizarPainelMunicipio(dados)
  );
}

function registrarEventosPainel(
  bairroGeometry,
  escolaMaisProxima,
  ubsMaisProxima,
  coletaMaisProxima
) {
  document
    .querySelectorAll(".service-card-clickable, .service-card-bairro")
    .forEach(function (card) {
      card.addEventListener("click", function () {
        document
          .querySelectorAll(".service-card-clickable, .service-card-bairro")
          .forEach(function (c) {
            c.classList.remove("active");
          });

        card.classList.add("active");

        const tipo = card.dataset.recurso;

        if (card.classList.contains("service-card-clickable")) {
          if (tipo === "escola" && escolaMaisProxima) {
            mostrarConexaoComRecurso(bairroGeometry, escolaMaisProxima.graphic);
          }

          if (tipo === "ubs" && ubsMaisProxima) {
            mostrarConexaoComRecurso(bairroGeometry, ubsMaisProxima.graphic);
          }

          if (tipo === "coleta" && coletaMaisProxima) {
            mostrarConexaoComRecurso(bairroGeometry, coletaMaisProxima.graphic);
          }

          return;
        }

        const nome = card.dataset.nome;
        let camada = null;
        let selectedSymbol = null;

        if (tipo === "escola") {
          camada = window.escolasLayer;
          selectedSymbol = window.CAMADAS.escolas.selectedSymbol;
        }

        if (tipo === "ubs") {
          camada = window.ubsLayer;
          selectedSymbol = window.CAMADAS.ubs.selectedSymbol;
        }

        if (tipo === "coleta") {
          camada = window.coletaLayer;
          selectedSymbol = window.CAMADAS.coleta.selectedSymbol;
        }

        if (!camada) return;

        const graphic = camada.graphics.items.find(function (item) {
          return item.attributes.nome === nome;
        });

        if (!graphic) return;

        selecionarFeature({
          graphic: graphic,
          selectedSymbol: selectedSymbol,
          zoom: 16
        });
      });
    });
}