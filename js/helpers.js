  function montarListaEscolas(escolas) {
    return escolas
      .map(function (graphic) {
        return `
          <div class="school-card">
            <strong>${graphic.attributes.nome}</strong>
            <span>${graphic.attributes.tipo}</span>
            <small>${graphic.attributes.endereco}</small>
          </div>
        `;
      })
      .join("");
  }
  
    
  function montarListaUBS(unidades) {
  return unidades
    .map(function (graphic) {
      return `
        <div class="school-card">
          <strong>${graphic.attributes.nome}</strong>
          <span>${graphic.attributes.tipo}</span>
          <small>${graphic.attributes.endereco}</small>
        </div>
      `;
    })
    .join("");
}

  function montarListaColetas(coletas) {
  return coletas
    .map(function (graphic) {
      return `
        <div class="school-card">
          <strong>${graphic.attributes.nome}</strong>
          <span>${graphic.attributes.tipo}</span>
          <small>${graphic.attributes.endereco}</small>
        </div>
      `;
    })
    .join("");
}

function encontrarMaisProximo(geometriaOrigem, graphicsDestino, geometryEngine) {
  if (!geometriaOrigem || !graphicsDestino || graphicsDestino.length === 0) {
    return null;
  }

  const pontoOrigem = geometriaOrigem.centroid || geometriaOrigem;

  let maisProximo = null;
  let menorDistancia = Infinity;

  graphicsDestino.forEach(function (graphic) {
    const pontoDestino = graphic.geometry.centroid || graphic.geometry;

    const linha = {
      type: "polyline",
      paths: [
        [
          [pontoOrigem.longitude, pontoOrigem.latitude],
          [pontoDestino.longitude, pontoDestino.latitude]
        ]
      ],
      spatialReference: {
        wkid: 4326
      }
    };

    const distancia = geometryEngine.geodesicLength(linha, "meters");

    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      maisProximo = graphic;
    }
  });

  return {
    graphic: maisProximo,
    distanciaMetros: menorDistancia
  };
}