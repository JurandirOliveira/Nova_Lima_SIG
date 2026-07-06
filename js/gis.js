  
  /* ==========================================
  FUNÇÕES AUXILIARES
  ========================================== */

function limparSelecao() {
    if (window.analysisLayer) {
    window.analysisLayer.removeAll();
  }
  
  
  if (window.analysisGraphic) {

    if (window.analysisGraphic.layer === window.escolasLayer) {
      window.analysisGraphic.symbol = window.CAMADAS.escolas.symbol;
    }

    if (window.analysisGraphic.layer === window.ubsLayer) {
      window.analysisGraphic.symbol = window.CAMADAS.ubs.symbol;
    }

    if (window.analysisGraphic.layer === window.coletaLayer) {
      window.analysisGraphic.symbol = window.CAMADAS.coleta.symbol;
    }

    window.analysisGraphic = null;
  }


  if (window.selectedGraphic) {
    if (window.selectedGraphic.layer === window.bairrosLayer) {
      window.selectedGraphic.symbol = window.CAMADAS.bairros.symbol;
    }

    if (window.selectedGraphic.layer === window.escolasLayer) {
      window.selectedGraphic.symbol = window.CAMADAS.escolas.symbol;
    }

    if (window.selectedGraphic.layer === window.ubsLayer) {
      window.selectedGraphic.symbol = window.CAMADAS.ubs.symbol;
    }

    if (window.selectedGraphic.layer === window.coletaLayer) {
      window.selectedGraphic.symbol = window.CAMADAS.coleta.symbol;
    }

    if (window.selectedGraphic.layer === window.ruasLayer) {
      window.selectedGraphic.symbol = window.CAMADAS.ruas.symbol;
    }
  }

  window.selectedGraphic = null;
}

function selecionarFeature(config) {
  limparSelecao();

  window.selectedGraphic = config.graphic;
  window.selectedGraphic.symbol = config.selectedSymbol;

  window.view.goTo({
    target: window.selectedGraphic.geometry,
    zoom: config.zoom || window.view.zoom
  });
}

async function carregarGeoJSONComoGraphics(config) {
  const resposta = await fetch(config.geojson);
  const geojson = await resposta.json();

  geojson.features.forEach(function (feature) {
    let geometry = null;

    if (feature.geometry.type === "Point") {
      geometry = {
        type: "point",
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        spatialReference: {
          wkid: 4326
        }
      };
    }

    if (feature.geometry.type === "LineString") {
      geometry = {
        type: "polyline",
        paths: [feature.geometry.coordinates],
        spatialReference: {
          wkid: 4326
        }
      };
    }

    if (feature.geometry.type === "Polygon") {
      geometry = {
        type: "polygon",
        rings: feature.geometry.coordinates,
        spatialReference: {
          wkid: 4326
        }
      };
    }

    const graphic = new window.Graphic({
      geometry: geometry,
      symbol: config.symbol,
      attributes: feature.properties,
      popupTemplate: config.popupTemplate || null
    });

    config.layer.add(graphic);
  });
}

function mostrarConexaoComRecurso(origemGeometry, destinoGraphic) {
  window.analysisLayer.removeAll();
  
    if (window.analysisGraphic) {

    if (window.analysisGraphic.layer === window.escolasLayer) {
      window.analysisGraphic.symbol = window.CAMADAS.escolas.symbol;
    }

    if (window.analysisGraphic.layer === window.ubsLayer) {
      window.analysisGraphic.symbol = window.CAMADAS.ubs.symbol;
    }

    if (window.analysisGraphic.layer === window.coletaLayer) {
      window.analysisGraphic.symbol = window.CAMADAS.coleta.symbol;
    }

    window.analysisGraphic = null;
  }
  
  
  if (destinoGraphic.layer === window.escolasLayer) {
    destinoGraphic.symbol = window.CAMADAS.escolas.selectedSymbol;
  }

  if (destinoGraphic.layer === window.ubsLayer) {
    destinoGraphic.symbol = window.CAMADAS.ubs.selectedSymbol;
  }

  if (destinoGraphic.layer === window.coletaLayer) {
    destinoGraphic.symbol = window.CAMADAS.coleta.selectedSymbol;
  }

  window.analysisGraphic = destinoGraphic;

  const pontoOrigem = origemGeometry.centroid || origemGeometry;
  const pontoDestino = destinoGraphic.geometry.centroid || destinoGraphic.geometry;

  function obterCoordenadas(ponto) {
    return [
      ponto.longitude ?? ponto.x,
      ponto.latitude ?? ponto.y
    ];
  }

  const coordOrigem = obterCoordenadas(pontoOrigem);
  const coordDestino = obterCoordenadas(pontoDestino);

  const linha = {
    type: "polyline",
    paths: [[coordOrigem, coordDestino]],
    spatialReference: {
      wkid: 4326
    }
  };

  const distanciaMetros = window.geometryEngine.geodesicLength(linha, "meters");

  const distanciaFormatada = distanciaMetros.toLocaleString("pt-BR", {
    maximumFractionDigits: 0
  });

  const linhaGraphic = new window.Graphic({
    geometry: linha,
    symbol: {
      type: "simple-line",
      color: [37, 99, 235, 0.95],
      width: 2,
      style: "dash"
    }
  });

  const pontoMedio = {
    type: "point",
    longitude: (coordOrigem[0] + coordDestino[0]) / 2,
    latitude: (coordOrigem[1] + coordDestino[1]) / 2,
    spatialReference: {
      wkid: 4326
    }
  };

  const textoDistanciaGraphic = new window.Graphic({
    geometry: pontoMedio,
    symbol: {
      type: "text",
      text: `${distanciaFormatada} m`,
      color: [15, 23, 42, 1],
      haloColor: [255, 255, 255, 1],
      haloSize: 2,
      font: {
        size: 12,
        weight: "bold"
      }
    }
  });

  window.analysisLayer.addMany([
    linhaGraphic,
    textoDistanciaGraphic
  ]);

  window.view.goTo({
    target: [origemGeometry, destinoGraphic.geometry],
    zoom: 13
  }).catch(function (error) {
    console.warn("Falha ao aproximar conexão:", error);
  });
}

