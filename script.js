document.addEventListener('DOMContentLoaded', function () {
  const calculadora = document.getElementById('calculadora');
  const tabela = document.getElementById('tabela');
  const contato = document.getElementById('contato');
  const sobre = document.getElementById('sobre');
  const ajuda = document.getElementById('ajuda');
  const calcBtn = document.getElementById('calcBtn');
  const tabelaBtn = document.getElementById('tabelaBtn');
  const contatoBtn = document.getElementById('contatoBtn');
  const sobreBtn = document.getElementById('sobreBtn');
  const ajudaBtn = document.getElementById('ajudaBtn');
  const sidebar = document.querySelector('.sidebar');

  function showSection(section) {
    calculadora.classList.add('hidden');
    tabela.classList.add('hidden');
    contato.classList.add('hidden');
    sobre.classList.add('hidden');
    ajuda.classList.add('hidden');
    section.classList.remove('hidden');

    if (section === ajuda) {
      sidebar.classList.add('sidebar-hidden');
    } else {
      sidebar.classList.remove('sidebar-hidden');
    }
  }

  calcBtn.addEventListener('click', () => {
    showSection(calculadora);
    sidebar.classList.remove('sidebar-hidden');
  });
  tabelaBtn.addEventListener('click', () => {
    showSection(tabela);
    sidebar.classList.remove('sidebar-hidden');
  });
  contatoBtn.addEventListener('click', () => {
    showSection(contato);
    sidebar.classList.remove('sidebar-hidden');
  });
  sobreBtn.addEventListener('click', () => {
    showSection(sobre);
    sidebar.classList.remove('sidebar-hidden');
  });
  ajudaBtn.addEventListener('click', () => {
    showSection(ajuda);
    sidebar.classList.add('sidebar-hidden');
  });

  showSection(ajuda);
  sidebar.classList.add('sidebar-hidden');

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('dataReferencia').value = today;

  document.querySelectorAll('.ajuda-opcao').forEach(button => {
    button.addEventListener('click', function () {
      switch (this.textContent) {
        case 'Calcular IPVA':
          showSection(calculadora);
          break;
        case 'Ver tabela de serviços':
          showSection(tabela);
          break;
        case 'Entrar em contato':
          showSection(contato);
          break;
        case 'Saber mais sobre nós':
          showSection(sobre);
          break;
      }
    });
  });

  function generatePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    const title = 'Orçamento';
    const pageWidth = doc.internal.pageSize.width;
    const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 20);

    doc.setFontSize(12);
    doc.text(`Nome: ${data.nome}`, 10, 40);
    doc.text(`Marca/Modelo: ${data.tipoCarro}`, 10, 50);
    doc.text(`RENAVAM: ${data.renavam}`, 10, 60);
    doc.text(`Valor do Veículo: ${data.valorVeiculo}`, 10, 70);
    doc.text(`Alíquota: ${data.aliquota}%`, 10, 80);
    doc.text(`Valor Integral do IPVA: ${data.ipvaIntegral}`, 10, 90);
    doc.text(`Valor do IPVA Ajustado: ${data.ipvaAjustado}`, 10, 100);
    doc.text(`Valor Total com Adicional: ${data.totalComAdicional}`, 10, 110);
    doc.text(`${data.mensagemDiferenca}`, 10, 120);

    doc.setFontSize(10);
    const footerLines = [
      'Paulo Augusto Nascimento dos Santos',
      '(41) 99718-5852',
      'Curitiba/PR',
      'CEP: 81750-190'
    ];

    const footerY = 260;
    const lineHeight = 5;

    footerLines.forEach((line, index) => {
      const lineWidth = doc.getStringUnitWidth(line) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const lineX = (pageWidth - lineWidth) / 2;
      doc.text(line, lineX, footerY + (index * lineHeight));
    });

    doc.save('orcamento_ipva.pdf');
  }

  document.getElementById('ipvaForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const tipoCarro = document.getElementById('tipoCarro').value;
    const renavam = document.getElementById('renavam').value;
    const valorVeiculo = parseFloat(document.getElementById('valor_veiculo').value) || 0;
    const aliquota = parseFloat(document.getElementById('aliquota').value) || 0;
    const valorAdicional = parseFloat(document.getElementById('valorAdicional').value) || 0;
    const valorExtra = parseFloat(document.getElementById('valorExtra').value) || 0;
    const valorAdicionalExtra = parseFloat(document.getElementById('valorAdicionalExtra').value) || 0;
    const valorProposta = parseFloat(document.getElementById('valorProposta').value) || 0;
    const dataReferencia = new Date(document.getElementById('dataReferencia').value || new Date());

    const dataLimite = new Date('2024-12-31');

    function calcularMesesRestantes(dataReferencia) {
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

    const mesesRestantes = calcularMesesRestantes(dataReferencia);

    function calcularIpva(valorVeiculo, aliquota, mesesRestantes) {
      const ipvaAnual = valorVeiculo * (aliquota / 100);
      const ipvaMensal = ipvaAnual / 12;
      const ipvaAjustado = ipvaMensal * mesesRestantes;
      return { ipvaAnual, ipvaAjustado };
    }

    function formatarParaMoeda(valor) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor);
    }

    const { ipvaAnual, ipvaAjustado } = calcularIpva(valorVeiculo, aliquota, mesesRestantes);
    const totalComAdicional = ipvaAjustado + valorAdicional + valorExtra + valorAdicionalExtra;

    document.getElementById('ipvaIntegral').textContent = `Valor Integral do IPVA: ${formatarParaMoeda(ipvaAnual)}`;
    document.getElementById('ipvaAjustado').textContent = `Valor do IPVA Ajustado até ${dataLimite.toLocaleDateString('pt-BR')}: ${formatarParaMoeda(ipvaAjustado)} (${mesesRestantes} meses restantes)`;
    document.getElementById('totalComAdicional').textContent = `Valor Total com Adicional: ${formatarParaMoeda(totalComAdicional)}`;

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

    if (document.getElementById('gerarPDF').checked) {
      generatePDF({
        nome,
        tipoCarro,
        renavam,
        valorVeiculo: formatarParaMoeda(valorVeiculo),
        aliquota,
        ipvaIntegral: formatarParaMoeda(ipvaAnual),
        ipvaAjustado: formatarParaMoeda(ipvaAjustado),
        totalComAdicional: formatarParaMoeda(totalComAdicional),
        mensagemDiferenca
      });
    } else {
      console.log('PDF não gerado por escolha do usuário.');
    }

    console.log('Cálculo de IPVA realizado:', {
      valorVeiculo,
      aliquota,
      ipvaAnual,
      ipvaAjustado,
      totalComAdicional,
      mesesRestantes,
      dataReferencia: dataReferencia.toISOString()
    });
  });

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
    doc.text('Orçamento', doc.internal.pageSize.width / 2, 20, { align: 'center' });

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
      'CEP: 81750-190'
    ];

    const footerY = doc.internal.pageSize.height - 30;
    const lineHeight = 5;

    footerLines.forEach((line, index) => {
      doc.text(line, doc.internal.pageSize.width / 2, footerY + (index * lineHeight), { align: 'center' });
    });

    doc.save('orcamento_servicos.pdf');
  }
});
