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

    // Set default reference date to 01/01/2025
    if (document.getElementById('dataReferencia')) {
      // document.getElementById('dataReferencia').value = '2025-01-01';
    }

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
    const calculadoraBtn = document.getElementById('calculadoraBtn'); // New button
    const valorBaixaGravameInput = document.getElementById('valorAdicionalExtra'); // Input element for "Valor Baixa de Gravame/Débitos"

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

    // Adding new event listener to listen for keypress
    document.addEventListener("keydown", handleKeyboardInput);

    function handleKeyboardInput(event) {
      const key = event.key;

      if (!isNaN(key) || key === '.') {
        handleNumber(key);
      } else if (key === ',' || key === ',') { // Check for comma
        handleComma();
      } else if (key === "Backspace") {
        handleBackspace();
      } else if (key === "Escape") {
        clearCalculator();
      } else if (key === "Enter" || key === "=") {
        calculate();
      } else if ("/*-+".includes(key)) {
        handleOperator(key);
      } else if (key === "%") {
        handlePercentage();
      }

      updateDisplay();
    }

    // Handle modal open and close
    calculadoraBtn.addEventListener('click', function () {
      document.getElementById('calculatorModal').style.display = 'block';
    });

    document.getElementById('modalCloseButton').addEventListener('click', function () {
      document.getElementById('calculatorModal').style.display = 'none';
    });

    // Calculator Logic
    let displayValue = '0';
    let firstOperand = null;
    let secondOperand = false;
    let currentOperator = null;

    const calcDisplay = document.getElementById('calcDisplay');

    function updateDisplay() {
      calcDisplay.textContent = displayValue;
    }

    document.querySelectorAll('.calculator-button').forEach((button) => {
      button.addEventListener('click', (event) => {
        const value = event.target.textContent;

        if (!isNaN(value) || value === '.') {
          handleNumber(value);
        } else if (value === ',') { // Handle comma button logic
          handleComma();
        } else if (value === 'C') {
          clearCalculator();
        } else if (value === '=') {
          calculate();
        } else if (value === '%') { // Handle percentage button logic
          handlePercentage();
        } else if (value === '←') { // Handle backspace
          handleBackspace(); // New function to handle backspace
        } else {
          handleOperator(value);
        }
        updateDisplay();
      });
    });

    function handleNumber(value) {
      if (secondOperand) {
        displayValue = value;
        secondOperand = false;
      } else {
        displayValue = displayValue === '0' ? value : displayValue + value;
      }
    }

    function handleOperator(operator) {
      if (firstOperand === null && !isNaN(displayValue)) {
        firstOperand = parseFloat(displayValue);
      } else if (currentOperator) {
        const result = compute(firstOperand, parseFloat(displayValue), currentOperator);
        displayValue = String(result);
        firstOperand = result;
      }
      currentOperator = operator;
      secondOperand = true;
    }

    function compute(a, b, operator) {
      if (operator === '+') return a + b;
      if (operator === '-') return a - b;
      if (operator === '*') return a * b;
      if (operator === '/') return b !== 0 ? a / b : 'Error';
      return b;
    }

    // Updated calculate function to include interaction for linking the result
    function calculate() {
      if (firstOperand !== null && currentOperator && !secondOperand) {
        const result = compute(firstOperand, parseFloat(displayValue), currentOperator);
        displayValue = String(result);
        firstOperand = null;
        currentOperator = null;

        // Prompt user to confirm if they want to send the result to "Valor da Baixa de Gravame/Débitos"
        const confirmation = confirm(
          `O valor calculado é ${displayValue}. Deseja preencher este valor no campo "Valor da Baixa de Gravame/Débitos"?`
        );
        if (confirmation && valorBaixaGravameInput) {
          valorBaixaGravameInput.value = parseFloat(displayValue).toFixed(2); // Set the value in the input field
        }
      }
    }

    function clearCalculator() {
      displayValue = '0';
      firstOperand = null;
      secondOperand = false;
      currentOperator = null;
    }

    function handleComma() {
      if (!displayValue.includes(',')) {
        displayValue += ','; // Add a comma to the current display value
      }
    }

    function handlePercentage() {
      // Convert the current display value to its percentage equivalent
      displayValue = parseFloat(displayValue) / 100;
    }

    function handleBackspace() {
      if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1); // Remove the last character
      } else {
        displayValue = '0'; // Reset to 0 if it's the last character
      }
    }

    const elementsToHide = [calculadora, tabela, tabelaServicos, tabelaDetran, contato, sobre, ajuda];
    showSection(ajuda, elementsToHide);

    if (document.getElementById('dataReferencia')) {
      // document.getElementById('dataReferencia').value = '2025-01-01';
    }

    document.querySelectorAll('.ajuda-opcao').forEach(button => {
      button.addEventListener('click', function () {
        switch (this.textContent) {
          case 'Calcular IPVA':
            showSection(calculadora, elementsToHide);
            break;
          case 'Entrar em contato':
            showSection(contato, elementsToHide);
            break;
          case 'Saber mais sobre nós':
            showSection(sobre, elementsToHide);
            break;
          case 'Site Detran':
            showSection(tabelaDetran, elementsToHide);
            break;
        }
      });
    });

    function updateRealTimeResults() {
      const valorVeiculo = parseFloat(document.getElementById('valor_veiculo').value) || 0;
      const aliquota = 3.5; // Fixed to 3.5%
      const valorAdicional = parseFloat(document.getElementById('valorAdicional').value) || 0; // Valor do Emplacamento
      const valorExtra = parseFloat(document.getElementById('valorExtra').value) || 0; // Valor da Placa
      const valorAdicionalExtra = parseFloat(document.getElementById('valorAdicionalExtra').value) || 0; // Valor da Baixa de Gravame
      const valorProposta = parseFloat(document.getElementById('valorProposta').value) || 0;
      const dataReferencia = new Date(document.getElementById('dataReferencia').value || new Date());

      const mesesRestantes = calcularMesesRestantes(dataReferencia);

      const { ipvaAnual, ipvaAjustado } = calcularIpvaNovo(valorVeiculo, aliquota, mesesRestantes);
      const totalComAdicional = ipvaAjustado + valorAdicional + valorExtra + valorAdicionalExtra;

      // Update Results section
      document.getElementById('ipvaIntegral').textContent = `Valor Integral do IPVA: ${formatarParaMoeda(ipvaAnual)}`;
      document.getElementById('ipvaAjustado').textContent = `Valor do IPVA Ajustado até ${new Date(dataReferencia.getFullYear(), 11, 31).toLocaleDateString('pt-BR')}: ${formatarParaMoeda(ipvaAjustado)} (${mesesRestantes} meses restantes)`;
      document.getElementById('totalComAdicional').textContent = `Valor Total com Adicional: ${formatarParaMoeda(totalComAdicional)}`;

      // Update specific additional values
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

      // Show Results Section
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

      // Collect values from inputs and results
      const nome = document.getElementById('nome').value;
      const tipoCarro = document.getElementById('tipoCarro').value;
      const renavam = document.getElementById('renavam').value;
      const valorVeiculo = parseFloat(document.getElementById('valor_veiculo').value) || 0;
      const aliquota = 3.5; // Fixed to 3.5%
      const valorAdicional = formatarParaMoeda(parseFloat(document.getElementById('valorAdicional').value) || 0); // Emplacamento
      const valorExtra = formatarParaMoeda(parseFloat(document.getElementById('valorExtra').value) || 0); // Placa
      const valorAdicionalExtra = formatarParaMoeda(parseFloat(document.getElementById('valorAdicionalExtra').value) || 0); // Gravame
      const valorProposta = parseFloat(document.getElementById('valorProposta').value) || 0;
      const dataReferencia = new Date(document.getElementById('dataReferencia').value || new Date());

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

      // Generate PDF if the checkbox is checked
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
        });
      }
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
      const lineSpacing = 10;
      let y = 40; // Starting Y position

      // Add all collected information to the PDF
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
      doc.text(`Valor Total com Adicional: ${data.totalComAdicional}`, 10, y);
      y += lineSpacing;
      doc.text(`Diferença: ${data.mensagemDiferenca}`, 10, y);

      // Footer information
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

      doc.save('orcamento_ipva.pdf');
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

    // Add drag functionality
    const calculatorModal = document.getElementById('calculatorModal');
    const calculatorContainer = document.getElementById('calculatorContainer');
    const calculatorHeader = document.getElementById('calculatorHeader');

    let isDragging = false;
    let startX, startY;

    calculatorHeader.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - calculatorContainer.offsetLeft;
      startY = e.clientY - calculatorContainer.offsetTop;
      document.body.style.cursor = 'grabbing'; // Change cursor to grabbing during drag
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const x = e.clientX - startX;
        const y = e.clientY - startY;
        calculatorContainer.style.left = `${x}px`;
        calculatorContainer.style.top = `${y}px`;
        calculatorContainer.style.transform = ''; // Disable centering transform when moved
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = ''; // Reset cursor
      }
    });

    const calculator = document.querySelector('#calculator');

    calculator.innerHTML = `
    <div class="calculator-button">7</div>
    <div class="calculator-button">8</div>
    <div class="calculator-button">9</div>
    <div class="calculator-button">/</div>
    <div class="calculator-button">4</div>
    <div class="calculator-button">5</div>
    <div class="calculator-button">6</div>
    <div class="calculator-button">*</div>
    <div class="calculator-button">1</div>
    <div class="calculator-button">2</div>
    <div class="calculator-button">3</div>
    <div class="calculator-button">-</div>
    <div class="calculator-button">C</div>
    <div class="calculator-button">0</div>
    <div class="calculator-button calculator-comma">,</div>
    <div class="calculator-button">+</div>
    <div class="calculator-button" id="equals">=</div>
    <div class="calculator-button" id="backspace">←</div>
    <div class="calculator-button">%</div>
  `;
  });