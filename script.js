

function formatarParaMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function calcularIpvaNovo(valorVeiculo, aliquota = 3.5, mesesRestantes) {
  const ipvaAnual = valorVeiculo * (aliquota / 100);
  const ipvaAjustado = ipvaAnual * (mesesRestantes / 12);
  return { ipvaAnual, ipvaAjustado };
}

function calcularMesesRestantes(dataReferencia) {
  const dataLimite = new Date(dataReferencia.getFullYear(), 11, 31);
  const anoFim = dataLimite.getFullYear();
  const mesFim = dataLimite.getMonth();
  const anoReferencia = dataReferencia.getFullYear();
  const mesReferencia = dataReferencia.getMonth();

  if (anoReferencia < anoFim) {
    return (12 - mesReferencia) + (mesFim + 1);
  } else if (anoReferencia === anoFim) {
    return (mesFim - mesReferencia) + 1;
  } else {
    return 0;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  function setDefaultDateToToday() {
    const dataReferenciaInput = document.getElementById('dataReferencia');
    if (dataReferenciaInput) {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0'); // Day
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Month +1 since month index is 0-based
      const year = today.getFullYear(); // Year
      dataReferenciaInput.value = `${year}-${month}-${day}`; // YYYY-MM-DD format
    }
  }

  setDefaultDateToToday();

  const calculadora = document.getElementById('calculadora');
  const tabela = document.getElementById('tabela');
  const tabelaServicos = document.getElementById('tabela-servicos');
  const contato = document.getElementById('contato');
  const sobre = document.getElementById('sobre');
  const ajuda = document.getElementById('ajuda');
  const tabelaDetran = document.getElementById('tabelaDetran');
  const logo = document.getElementById('logo');
  const calcBtn = document.getElementById('calcBtn');
  const servicosBtn = document.getElementById('servicosBtn');
  const novaTabelaBtn = document.getElementById('novaTabelaBtn');
  const contatoBtn = document.getElementById('contatoBtn');
  const sobreBtn = document.getElementById('sobreBtn');
  const ajudaBtn = document.getElementById('ajudaBtn');
  const siteDetranBtn = document.getElementById('siteDetranBtn');
  const sidebar = document.querySelector('.sidebar');

  function showSection(section, elements = []) {
    elements.forEach(elem => {
      if (elem) elem.classList.add('hidden');
    });
    if (section) {
      section.classList.remove('hidden');

      logo.style.display = section === ajuda ? 'block' : 'none';
      if (sidebar) {
        section === ajuda ? sidebar.classList.add('sidebar-hidden') : sidebar.classList.remove('sidebar-hidden');
      }
    }
  }

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      showSection(calculadora, [tabela, tabelaServicos, tabelaDetran, contato, sobre, ajuda]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
    });
  }

  if (servicosBtn) {
    servicosBtn.addEventListener('click', () => {
      showSection(tabela, [calculadora, tabelaServicos, tabelaDetran, contato, sobre, ajuda]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
    });
  }

  if (novaTabelaBtn) {
    novaTabelaBtn.addEventListener('click', () => {
      showSection(tabelaServicos, [calculadora, tabela, tabelaDetran, contato, sobre, ajuda]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
    });
  }

  if (contatoBtn) {
    contatoBtn.addEventListener('click', () => {
      showSection(contato, [calculadora, tabela, tabelaServicos, tabelaDetran, sobre, ajuda]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
    });
  }

  if (sobreBtn) {
    sobreBtn.addEventListener('click', () => {
      showSection(sobre, [calculadora, tabela, tabelaServicos, tabelaDetran, contato, ajuda]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
    });
  }

  if (ajudaBtn) {
    ajudaBtn.addEventListener('click', () => {
      showSection(ajuda, [calculadora, tabela, tabelaServicos, tabelaDetran, contato, sobre]);
      if (sidebar) sidebar.classList.add('sidebar-hidden');
    });
  }

  if (siteDetranBtn) {
    siteDetranBtn.addEventListener('click', () => {
      showSection(tabelaDetran, [calculadora, tabela, tabelaServicos, contato, sobre, ajuda]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
    });
  }

  document.querySelectorAll('.ajuda-opcao').forEach(button => {
    button.addEventListener('click', function () {
      switch (this.textContent) {
        case 'Calcular IPVA':
          showSection(calculadora, [tabela, tabelaServicos, tabelaDetran, contato, sobre, ajuda]);
          break;
        case 'Entrar em contato':
          showSection(contato, [calculadora, tabela, tabelaServicos, tabelaDetran, sobre, ajuda]);
          break;
        case 'Saber mais sobre nós':
          showSection(sobre, [calculadora, tabela, tabelaServicos, tabelaDetran, contato, ajuda]);
          break;
        case 'Site Detran':
          showSection(tabelaDetran, [calculadora, tabela, tabelaServicos, contato, sobre, ajuda]);
          break;
      }
    });
  });

  const elementsToHide = [calculadora, tabela, tabelaServicos, tabelaDetran, contato, sobre, ajuda];
  showSection(ajuda, elementsToHide);

  function updateRealTimeResults() {
    const valorVeiculo = parseFloat(document.getElementById('valor_veiculo').value) || 0;
    const aliquota = parseFloat(document.getElementById('aliquota').value) || 3.5;
    const valorAdicional = parseFloat(document.getElementById('valorAdicional').value) || 0;
    const valorExtra = parseFloat(document.getElementById('valorExtra').value) || 0;
    const valorAdicionalExtra = parseFloat(document.getElementById('valorAdicionalExtra').value) || 0;
    const valorProposta = parseFloat(document.getElementById('valorProposta').value) || 0;
    const dataReferencia = new Date(document.getElementById('dataReferencia').value || new Date());

    const mesesRestantes = calcularMesesRestantes(dataReferencia);

    const { ipvaAnual, ipvaAjustado } = calcularIpvaNovo(valorVeiculo, aliquota, mesesRestantes);
    const totalComAdicional = ipvaAjustado + valorAdicional + valorExtra + valorAdicionalExtra;

    document.getElementById('ipvaIntegral').textContent = `Valor Integral do IPVA: ${formatarParaMoeda(ipvaAnual)}`;
    document.getElementById('ipvaAjustado').textContent = `Valor do IPVA Ajustado até ${new Date(dataReferencia.getFullYear(), 11, 31).toLocaleDateString('pt-BR')}: ${formatarParaMoeda(ipvaAjustado)} (${mesesRestantes} meses restantes)`;
    document.getElementById('valorPropostaResultado').textContent = `Valor da Proposta/Minuta: ${formatarParaMoeda(valorProposta)}`;
    document.getElementById('totalComAdicional').textContent = `Valor Total com Adicional: ${formatarParaMoeda(totalComAdicional)}`;

    document.getElementById('valorEmplacamento').textContent = `Valor do Emplacamento: ${formatarParaMoeda(valorAdicional)}`;
    document.getElementById('valorPlaca').textContent = `Valor da Placa: ${formatarParaMoeda(valorExtra)}`;
    document.getElementById('valorGravame').textContent = `Valor da Baixa de Gravame/Débitos: ${formatarParaMoeda(valorAdicionalExtra)}`;

    let mensagemDiferenca = '';
    if (valorProposta > 0) {
      let valorDiferenca = valorProposta - totalComAdicional;
      mensagemDiferenca = valorDiferenca > 0
        ? `Está sobrando ${formatarParaMoeda(valorDiferenca)}`
        : valorDiferenca < 0
          ? `Está faltando valor, favor corrigir ${formatarParaMoeda(-valorDiferenca)}`
          : 'Valores estão equilibrados.';
    }

    document.getElementById('valorDiferenca').textContent = mensagemDiferenca;

    document.getElementById('results').classList.remove('hidden');
  }

  ['valor_veiculo', 'aliquota', 'valorAdicional', 'valorExtra', 'valorAdicionalExtra', 'valorProposta', 'dataReferencia'].forEach(function (id) {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', updateRealTimeResults);
    }
  });

  updateRealTimeResults();

  document.getElementById('ipvaForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const tipoCarro = document.getElementById('tipoCarro').value;
    const renavam = document.getElementById('renavam').value;
    const valorVeiculo = parseFloat(document.getElementById('valor_veiculo').value) || 0;
    const aliquota = parseFloat(document.getElementById('aliquota').value) || 3.5;
    const valorAdicional = formatarParaMoeda(parseFloat(document.getElementById('valorAdicional').value) || 0);
    const valorExtra = formatarParaMoeda(parseFloat(document.getElementById('valorExtra').value) || 0);
    const valorAdicionalExtra = formatarParaMoeda(parseFloat(document.getElementById('valorAdicionalExtra').value) || 0);
    const valorProposta = parseFloat(document.getElementById('valorProposta').value) || 0;
    const dataReferencia = new Date(document.getElementById('dataReferencia').value || new Date());
    const observacoes = document.getElementById('observacoes').value;

    const mesesRestantes = calcularMesesRestantes(dataReferencia);

    const { ipvaAnual, ipvaAjustado } = calcularIpvaNovo(valorVeiculo, aliquota, mesesRestantes);
    const totalComAdicional = ipvaAjustado + parseFloat(document.getElementById('valorAdicional').value || 0)
      + parseFloat(document.getElementById('valorExtra').value || 0)
      + parseFloat(document.getElementById('valorAdicionalExtra').value || 0);

    let mensagemDiferenca = '';
    if (valorProposta > 0) {
      let valorDiferenca = valorProposta - totalComAdicional;
      mensagemDiferenca = valorDiferenca > 0
        ? `Está sobrando ${formatarParaMoeda(valorDiferenca)}`
        : valorDiferenca < 0
          ? `Está faltando valor, favor corrigir ${formatarParaMoeda(-valorDiferenca)}`
          : 'Valores estão equilibrados.';
    }

    if (document.getElementById('gerarPDF').checked) {
      generatePDF({
        nome,
        tipoCarro,
        renavam,
        valorVeiculo: formatarParaMoeda(valorVeiculo),
        aliquota,
        ipvaIntegral: formatarParaMoeda(ipvaAnual),
        ipvaAjustado: `${formatarParaMoeda(ipvaAjustado)} (${mesesRestantes} meses restantes)`,
        valorEmplacamento: valorAdicional,
        valorPlaca: valorExtra,
        valorGravame: valorAdicionalExtra,
        totalComAdicional: formatarParaMoeda(totalComAdicional),
        mensagemDiferenca,
        valorProposta: valorProposta,
        observacoes,
      });
    }
  });

  function generatePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    const title = 'ORÇAMENTO';
    const pageWidth = doc.internal.pageSize.width;
    const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 20);

    doc.setFontSize(12);
    const lineSpacing = 10;
    let y = 40; // Starting Y position

    doc.text(`Nome: ${data.nome}`, 10, y);
    y += lineSpacing;
    doc.text(`Marca/Modelo: ${data.tipoCarro}`, 10, y);
    y += lineSpacing;
    doc.text(`RENAVAM: ${data.renavam}`, 10, y);
    y += lineSpacing;
    doc.text(`Valor do Veículo: ${data.valorVeiculo}`, 10, y);
    y += lineSpacing;
    doc.text(`Alíquota: ${data.aliquota}%`, 10, y);
    y += lineSpacing;
    doc.text(`Valor Integral do IPVA: ${data.ipvaIntegral}`, 10, y);
    y += lineSpacing;
    doc.text(`Valor do IPVA Ajustado: ${data.ipvaAjustado}`, 10, y);
    y += lineSpacing;
    doc.text(`Valor do Emplacamento: ${data.valorEmplacamento}`, 10, y);
    y += lineSpacing;
    doc.text(`Valor da Placa: ${data.valorPlaca}`, 10, y);
    y += lineSpacing;
    doc.text(`Valor da Baixa de Gravame/Débitos: ${data.valorGravame}`, 10, y);
    y += lineSpacing;
    doc.text(`Valor da Proposta/Minuta: ${data.valorProposta}`, 10, y);
    y += lineSpacing;
    doc.text(`Valor Total com Adicional: ${data.totalComAdicional}`, 10, y);
    y += lineSpacing;
    doc.text(`Diferença: ${data.mensagemDiferenca}`, 10, y);
    y += lineSpacing;
    doc.text(`Observações: ${data.observacoes}`, 10, y);

    const currentDate = new Date();
    const dateString = `${currentDate.toLocaleDateString('pt-BR')} ${currentDate.toLocaleTimeString('pt-BR')}`;

    doc.setFontSize(10);
    const footerLines = [
      dateString,
      'Paulo Augusto Nascimento dos Santos',
      '(41) 99718-5852',
      'Curitiba/PR',
      'CEP: 81750-190',
    ];

    const footerY = 260;
    const lineHeight = 5;

    footerLines.forEach((line, index) => {
      const lineWidth = doc.getStringUnitWidth(line) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const lineX = (pageWidth - lineWidth) / 2;
      doc.text(line, lineX, footerY + (index * lineHeight));
    });

    doc.save('Orçamento.pdf');
  }

  const gerarOrcamentoPDFBtn = document.getElementById('gerarOrcamentoPDF');
  const servicosTabela = document.getElementById('servicosTabela');

  gerarOrcamentoPDFBtn.addEventListener('click', gerarOrcamentoPDF);

  function gerarOrcamentoPDF() {
    const servicosSelecionados = [];
    let total = 0;

    const checkboxes = servicosTabela.querySelectorAll('.servico-checkbox:checked');
    checkboxes.forEach(checkbox => {
      const row = checkbox.closest('tr');
      const servico = row.cells[1].textContent;
      const detalhes = row.cells[2].textContent;
      const valor = parseFloat(row.cells[3].dataset.valor);

      servicosSelecionados.push({ servico, detalhes, valor });
      total += valor;
    });

    if (servicosSelecionados.length === 0) {
      alert('Por favor, selecione pelo menos um serviço.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('ORÇAMENTO', doc.internal.pageSize.width / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    let yPos = 40;

    servicosSelecionados.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.servico} - ${item.detalhes}: R$ ${item.valor.toFixed(2)}`, 20, yPos);
      yPos += 10;
    });

    doc.setFontSize(14);
    doc.text(`Total: R$ ${total.toFixed(2)}`, 20, yPos + 10);

    doc.setFontSize(10);
    const footerLines = [
      'Paulo Augusto Nascimento dos Santos',
      '(41) 99718-5852',
      'Curitiba/PR',
      'CEP: 81750-190',
    ];

    const footerY = doc.internal.pageSize.height - 30;
    const lineHeight = 5;

    footerLines.forEach((line, index) => {
      doc.text(line, doc.internal.pageSize.width / 2, footerY + (index * lineHeight), { align: 'center' });
    });

    doc.save('Orçamento.pdf');
  }

  const calcIpvaLink = document.querySelector('.calc-ipva-link');
  if (calcIpvaLink) {
    calcIpvaLink.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      document.getElementById('ipvaForm').dispatchEvent(new Event('submit', { 'bubbles': true, 'cancelable': true }));
    });
  }
});