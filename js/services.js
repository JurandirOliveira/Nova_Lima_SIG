  /* ==========================================
  SERVIÇOS
  ========================================== */

  async function buscarDadosMunicipio(codigoMunicipio) {
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${codigoMunicipio}`;

    const resposta = await fetch(url);
    const dados = await resposta.json();

    return dados;
  }