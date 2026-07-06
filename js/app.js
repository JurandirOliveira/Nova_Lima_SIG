/* ==========================================
CONFIGURAÇÕES
========================================== */

const codigoNovaLima = "3144805";




/* ==========================================
IMPORTAÇÃO DOS MÓDULOS ARCGIS
========================================== */

require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GeoJSONLayer",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/geometry/geometryEngine",
  "esri/widgets/LayerList",
  "esri/widgets/Legend",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Expand",
  "esri/widgets/Search"
], function (
  Map,
  MapView,
  GeoJSONLayer,
  GraphicsLayer,
  Graphic,
  geometryEngine,
  LayerList,
  Legend,
  BasemapGallery,
  Expand,
  Search
) {

  /* ==========================================
  MAPA
  ========================================== */
  window.Graphic = Graphic;

  const map = new Map({
    basemap: "streets-vector"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-43.8469, -19.9856],
    zoom: 12,
  });
  
    view.popupEnabled = false;

  /* ==========================================
  LAYERS
  ========================================== */

  const novaLimaLayer = new GeoJSONLayer({
    url: `https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${codigoNovaLima}?formato=application/vnd.geo+json`,
    title: "Nova Lima",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 120, 255, 0.15],
        outline: {
          color: [0, 80, 180, 1],
          width: 2
        }
      }
    },
    popupTemplate: {
      title: "Nova Lima - MG",
      content: "Limite municipal carregado a partir da API pública do IBGE."
    }
  });

const CAMADAS = window.criarConfiguracaoCamadas(GraphicsLayer);

const bairrosLayer = CAMADAS.bairros.layer;
const escolasLayer = CAMADAS.escolas.layer;
const ubsLayer = CAMADAS.ubs.layer;
const ruasLayer = CAMADAS.ruas.layer;
const coletaLayer = CAMADAS.coleta.layer;
const analysisLayer = new GraphicsLayer({
  title: "Análises temporárias"
});

window.view = view;
window.CAMADAS = CAMADAS;

window.bairrosLayer = bairrosLayer;
window.escolasLayer = escolasLayer;
window.ubsLayer = ubsLayer;
window.ruasLayer = ruasLayer;
window.coletaLayer = coletaLayer;
window.analysisLayer = analysisLayer;
window.geometryEngine = geometryEngine;

window.selectedGraphic = null;

map.add(novaLimaLayer);
map.add(CAMADAS.bairros.layer);
map.add(CAMADAS.ruas.layer);
map.add(CAMADAS.escolas.layer);
map.add(CAMADAS.ubs.layer);
map.add(CAMADAS.coleta.layer);
map.add(analysisLayer);

  /* ==========================================
  WIDGETS
  ========================================== */

  const layerList = new LayerList({
    view: view
  });

  const legend = new Legend({
    view: view
  });

  const basemapGallery = new BasemapGallery({
    view: view
  });

  const search = new Search({
    view: view
  });

  const layerListExpand = new Expand({
    view: view,
    content: layerList,
    expanded: false
  });

  const legendExpand = new Expand({
    view: view,
    content: legend,
    expanded: false
  });

  const basemapExpand = new Expand({
    view: view,
    content: basemapGallery,
    expanded: false
  });

  view.ui.add(layerListExpand, "top-left");
  view.ui.add(legendExpand, "top-left");
  view.ui.add(basemapExpand, "top-left");
  view.ui.add(search, "top-right");


  /* ==========================================
  CARREGAMENTO DOS GEOJSON LOCAIS
  ========================================== */
  

const configuracoesCamadas = [
  CAMADAS.bairros,
  CAMADAS.ruas,
  CAMADAS.escolas,
  CAMADAS.ubs,
  CAMADAS.coleta
];

  async function carregarCamadasLocais() {
  for (const camada of configuracoesCamadas) {
    await carregarGeoJSONComoGraphics(camada);
  }
}



  /* ==========================================
  EVENTOS
  ========================================== */

  view.on("click", async function (event) {
  await processarClique(event, {
    view,
    CAMADAS,
    novaLimaLayer,
    geometryEngine,
    codigoNovaLima
  });
});


  /* ==========================================
  INICIALIZAÇÃO
  ========================================== */

  carregarCamadasLocais();

  novaLimaLayer.when(() => {
    view.goTo(novaLimaLayer.fullExtent);
  });

});

/* ==========================================
EXIBIR E OCULPAR O PAINEL LATERAL
========================================== */
const sidebar = document.getElementById("sidebar");
const btnFecharPainel = document.getElementById("btnFecharPainel");
const btnAbrirPainel = document.getElementById("btnAbrirPainel");

btnFecharPainel.addEventListener("click", function () {
  sidebar.classList.add("sidebar-saindo");

  setTimeout(function () {
    sidebar.classList.add("sidebar-fechado");
    btnAbrirPainel.classList.add("visivel");

    view.popupEnabled = true;
  }, 300);
});

btnAbrirPainel.addEventListener("click", function () {
  sidebar.classList.remove("sidebar-fechado");

  setTimeout(function () {
    sidebar.classList.remove("sidebar-saindo");
  }, 10);

  btnAbrirPainel.classList.remove("visivel");

  view.popupEnabled = false;
});
