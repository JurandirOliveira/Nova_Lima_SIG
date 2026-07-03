/* ==========================================
SÍMBOLOS
========================================== */

/* ----------------------------- Bairros --------------------------------------- */

const simboloBairro = {
  type: "simple-fill",
  color: [255, 140, 0, 0.25],
  outline: {
    color: [255, 100, 0, 1],
    width: 1.5
  }
};

const simboloBairroSelecionado = {
  type: "simple-fill",
  color: [255, 255, 0, 0.35],
  outline: {
    color: [255, 0, 0],
    width: 3
  }
};

/* ----------------------------- Escolas --------------------------------------- */

const simboloEscola = {
  type: "picture-marker",
  url: "./img/icons/escola.png",
  width: "30px",
  height: "30px"
};

const simboloEscolaSelecionada = {
  type: "picture-marker",
  url: "./img/icons/escola.png",
  width: "60px",
  height: "60px"
};

/* ----------------------------- UBS --------------------------------------- */

const simboloUBS = {
  type: "picture-marker",
  url: "./img/icons/ubs.png",
  width: "30px",
  height: "30px"
};

const simboloUBSSelecionada = {
  type: "picture-marker",
  url: "./img/icons/ubs.png",
  width: "60px",
  height: "60px",
};

/* ----------------------------- Creches --------------------------------------- */

const simboloCreche = {
  type: "picture-marker",
  url: "img/icons/creche.png",
  width: "30px",
  height: "30px"
};

const simboloCrecheSelecionada = {
  type: "picture-marker",
  url: "img/icons/creche.png",
  width: "60px",
  height: "60px"
};

/* ----------------------------- ColetaSeletiva --------------------------------------- */


const simboloColeta = {
  type: "picture-marker",
  url: "./img/icons/coleta.png",
  width: "30px",
  height: "30px"
};

const simboloColetaSelecionada = {
  type: "picture-marker",
  url: "./img/icons/coleta.png",
  width: "60px",
  height: "60px"
};


/* ----------------------------- Ruas --------------------------------------- */

const simboloRua = {
  type: "simple-line",
  color: [110, 110, 110, 0.9],
  width: 2
};

const simboloRuaSelecionada = {
  type: "simple-line",
  color: [220, 38, 38],
  width: 5
};


/* ==========================================
CONFIGURAÇÃO DAS CAMADAS
========================================== */

function criarConfiguracaoCamadas(GraphicsLayer) {
  return {
    bairros: {
      title: "Bairros de teste",
      layer: new GraphicsLayer({
        title: "Bairros de teste"
      }),
      symbol: simboloBairro,
      selectedSymbol: simboloBairroSelecionado,
      geojson: "./data/bairros.geojson",
      popupTemplate: {
        title: "{nome}",
        content: `
          <p><strong>Tipo:</strong> {tipo}</p>
          <p><strong>Área aproximada:</strong> {area}</p>
        `
      }
    },

    escolas: {
      title: "Escolas de teste",
      layer: new GraphicsLayer({
        title: "Escolas de teste"
      }),
      symbol: simboloEscola,
      selectedSymbol: simboloEscolaSelecionada,
      geojson: "./data/escolas.geojson",
      popupTemplate: {
        title: "{nome}",
        content: `
          <p><strong>Tipo:</strong> {tipo}</p>
          <p><strong>Bairro:</strong> {bairro}</p>
          <p><strong>Endereço:</strong> {endereco}</p>
        `
      }
    },

    ubs: {
      title: "UBS de teste",
      layer: new GraphicsLayer({
        title: "UBS de teste"
      }),
      symbol: simboloUBS,
      selectedSymbol: simboloUBSSelecionada,
      geojson: "./data/ubs.geojson",
      popupTemplate: {
        title: "{nome}",
        content: `
          <p><strong>Tipo:</strong> {tipo}</p>
          <p><strong>Bairro:</strong> {bairro}</p>
          <p><strong>Endereço:</strong> {endereco}</p>
          <p><strong>Telefone:</strong> {telefone}</p>
        `
      }
    },
    
    coleta: {
  title: "Coleta Seletiva",
  layer: new GraphicsLayer({
    title: "Coleta Seletiva"
  }),
  symbol: simboloColeta,
  selectedSymbol: simboloColetaSelecionada,
  geojson: "./data/coleta.geojson",
  popupTemplate: {
    title: "{nome}",
    content: `
      <p><strong>Tipo:</strong> {tipo}</p>
      <p><strong>Bairro:</strong> {bairro}</p>
      <p><strong>Endereço:</strong> {endereco}</p>
      <p><strong>Materiais:</strong> {materiais}</p>
      <p><strong>Horário:</strong> {horario}</p>
    `
  }
},

creches: {
  title: "Creches",
  layer: new GraphicsLayer({
    title: "Creches"
  }),
  symbol: simboloCreche,
  selectedSymbol: simboloCrecheSelecionada,
  geojson: "./data/creches.geojson",
  popupTemplate: {
    title: "{nome}",
    content: `
      <p><strong>Tipo:</strong> {tipo}</p>
      <p><strong>Bairro:</strong> {bairro}</p>
      <p><strong>Endereço:</strong> {endereco}</p>
      <p><strong>Município:</strong> {municipio}</p>
    `
  }
},

    ruas: {
  title: "Rede Viária de teste",
  layer: new GraphicsLayer({
    title: "Rede Viária"
  }),
  symbol: simboloRua,
  selectedSymbol: simboloRuaSelecionada,
  geojson: "./data/ruas.geojson",
  popupTemplate: {
    title: "{nome}",
    content: `
      <p><strong>Tipo:</strong> {tipo}</p>
      <p><strong>Bairro:</strong> {bairro}</p>
      <p><strong>Sentido:</strong> {sentido}</p>
      <p><strong>Pavimentação:</strong> {pavimentacao}</p>
      <p><strong>Extensão:</strong> {extensao}</p>
    `
  }
}
  };
}

window.criarConfiguracaoCamadas = criarConfiguracaoCamadas;