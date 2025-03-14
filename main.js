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

// Function to show feedback messages
function showFeedback(message, type = 'info', duration = 5000) {
  const feedbackElement = document.getElementById('feedback-message');
  if (!feedbackElement) return;

  // Clear previous classes
  feedbackElement.className = 'feedback';
  
  // Add appropriate class based on message type
  feedbackElement.classList.add(type);
  
  // Set message content
  feedbackElement.textContent = message;
  
  // Show the message
  feedbackElement.classList.remove('hidden');
  
  // Auto-hide after duration (if not 0)
  if (duration > 0) {
    setTimeout(() => {
      feedbackElement.classList.add('hidden');
    }, duration);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Setup keyboard navigation
  setupKeyboardNavigation();

  function setDefaultDateToToday() {
    const dataReferenciaInput = document.getElementById('dataReferencia');
    if (dataReferenciaInput) {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      dataReferenciaInput.value = `${year}-${month}-${day}`;
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
  const tutorial = document.getElementById('tutorial');
  const logo = document.getElementById('logo');
  const calcBtn = document.getElementById('calcBtn');
  const servicosBtn = document.getElementById('servicosBtn');
  const novaTabelaBtn = document.getElementById('novaTabelaBtn');
  const contatoBtn = document.getElementById('contatoBtn');
  const sobreBtn = document.getElementById('sobreBtn');
  const ajudaBtn = document.getElementById('ajudaBtn');
  const siteDetranBtn = document.getElementById('siteDetranBtn');
  const tutorialBtn = document.getElementById('tutorialBtn');
  const startCalculatorBtn = document.getElementById('startCalculator');
  const sidebar = document.querySelector('.sidebar');
  
  // Toggle sidebar menu on mobile
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('sidebar-visible');
      menuToggle.classList.toggle('menu-open');
      
      // Update aria-expanded attribute
      const isExpanded = sidebar.classList.contains('sidebar-visible');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close sidebar when clicking outside of it on mobile
    document.addEventListener('click', function(event) {
      if (window.innerWidth <= 768 && sidebar.classList.contains('sidebar-visible') && 
          !sidebar.contains(event.target) && event.target !== menuToggle) {
        sidebar.classList.remove('sidebar-visible');
        menuToggle.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Add resize handler for responsive behavior
  function handleResize() {
    if (window.innerWidth > 768) {
      // Reset sidebar visibility on larger screens
      if (sidebar) {
        sidebar.classList.remove('sidebar-visible');
        if (menuToggle) {
          menuToggle.classList.remove('menu-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    }
  }

  // Initialize and listen for window resize
  window.addEventListener('resize', handleResize);
  handleResize();

  function showSection(section, elements = []) {
    elements.forEach(elem => {
      if (elem) elem.classList.add('hidden');
    });
    if (section) {
      section.classList.remove('hidden');

      if (logo) {
        logo.style.display = section === ajuda ? 'block' : 'none';
      }
      if (sidebar) {
        section === ajuda ? sidebar.classList.add('sidebar-hidden') : sidebar.classList.remove('sidebar-hidden');
      }
      
      // Close mobile sidebar when navigating
      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove('sidebar-visible');
        if (menuToggle) {
          menuToggle.classList.remove('menu-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    }
  }

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      showSection(calculadora, [tabela, tabelaServicos, tabelaDetran, contato, sobre, ajuda, tutorial]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
      showFeedback('Preencha os campos para calcular o IPVA', 'info', 3000);
    });
  }

  if (tutorialBtn) {
    tutorialBtn.addEventListener('click', () => {
      showSection(tutorial, [calculadora, tabela, tabelaServicos, tabelaDetran, contato, sobre, ajuda]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
    });
  }

  if (startCalculatorBtn) {
    startCalculatorBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(calculadora, [tabela, tabelaServicos, tabelaDetran, contato, sobre, ajuda, tutorial]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
      showFeedback('Preencha os campos para calcular o IPVA', 'info', 3000);
    });
  }

  if (servicosBtn) {
    servicosBtn.addEventListener('click', () => {
      showSection(tabela, [calculadora, tabelaServicos, tabelaDetran, contato, sobre, ajuda, tutorial]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
    });
  }

  if (novaTabelaBtn) {
    novaTabelaBtn.addEventListener('click', () => {
      showSection(tabelaServicos, [calculadora, tabela, tabelaDetran, contato, sobre, ajuda, tutorial]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
      showFeedback('Consulte as alíquotas de IPVA para cada estado', 'info', 3000);
    });
  }

  if (contatoBtn) {
    contatoBtn.addEventListener('click', () => {
      showSection(contato, [calculadora, tabela, tabelaServicos, tabelaDetran, sobre, ajuda, tutorial]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
    });
  }

  if (sobreBtn) {
    sobreBtn.addEventListener('click', () => {
      showSection(sobre, [calculadora, tabela, tabelaServicos, tabelaDetran, contato, ajuda, tutorial]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
    });
  }

  if (ajudaBtn) {
    ajudaBtn.addEventListener('click', () => {
      showSection(ajuda, [calculadora, tabela, tabelaServicos, tabelaDetran, contato, sobre, tutorial]);
      if (sidebar) sidebar.classList.add('sidebar-hidden');
    });
  }

  if (siteDetranBtn) {
    siteDetranBtn.addEventListener('click', () => {
      showSection(tabelaDetran, [calculadora, tabela, tabelaServicos, contato, sobre, ajuda, tutorial]);
      if (sidebar) sidebar.classList.remove('sidebar-hidden');
      showFeedback('Consulte os sites dos DETRANs de cada estado', 'info', 3000);
    });
  }

  document.querySelectorAll('.ajuda-opcao').forEach(button => {
    button.addEventListener('click', function () {
      switch (this.textContent) {
        case 'Calcular IPVA':
          showSection(calculadora, [tabela, tabelaServicos, tabelaDetran, contato, sobre, ajuda, tutorial]);
          showFeedback('Preencha os campos para calcular o IPVA', 'info', 3000);
          break;
        case 'Acessar Tutorial':
          showSection(tutorial, [calculadora, tabela, tabelaServicos, tabelaDetran, contato, sobre, ajuda]);
          break;
        case 'Entrar em contato':
          showSection(contato, [calculadora, tabela, tabelaServicos, tabelaDetran, sobre, ajuda, tutorial]);
          break;
        case 'Saber mais sobre nós':
          showSection(sobre, [calculadora, tabela, tabelaServicos, tabelaDetran, contato, ajuda, tutorial]);
          break;
        case 'Site Detran':
          showSection(tabelaDetran, [calculadora, tabela, tabelaServicos, contato, sobre, ajuda, tutorial]);
          showFeedback('Consulte os sites dos DETRANs de cada estado', 'info', 3000);
          break;
      }
    });
  });

  const elementsToHide = [calculadora, tabela, tabelaServicos, tabelaDetran, contato, sobre, ajuda, tutorial];
  showSection(ajuda, elementsToHide);

  // Form validation functions
  function validateInput(input) {
    const errorElement = document.getElementById(`${input.id}-error`);
    let isValid = true;
    let errorMessage = '';

    // Clear previous validation states
    input.classList.remove('valid', 'invalid');
    
    // Check if input is required and empty
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      errorMessage = 'Este campo é obrigatório.';
    }
    // Check minimum length for text inputs
    else if (input.type === 'text' && input.hasAttribute('minlength') && 
             input.value.length < parseInt(input.getAttribute('minlength'))) {
      isValid = false;
      errorMessage = `Mínimo de ${input.getAttribute('minlength')} caracteres.`;
    }
    // Check min/max for number inputs
    else if (input.type === 'number') {
      const value = parseFloat(input.value);
      
      if (isNaN(value)) {
        if (input.hasAttribute('required')) {
          isValid = false;
          errorMessage = 'Por favor, informe um valor numérico.';
        }
      } else {
        if (input.hasAttribute('min') && value < parseFloat(input.getAttribute('min'))) {
          isValid = false;
          errorMessage = `Valor mínimo: ${input.getAttribute('min')}.`;
        }
        if (input.hasAttribute('max') && value > parseFloat(input.getAttribute('max'))) {
          isValid = false;
          errorMessage = `Valor máximo: ${input.getAttribute('max')}.`;
        }
      }
    }
    // Validate date inputs
    else if (input.type === 'date' && input.hasAttribute('required') && !input.value) {
      isValid = false;
      errorMessage = 'Por favor, selecione uma data.';
    }

    // Update input appearance based on validation
    if (isValid) {
      if (input.value) {
        input.classList.add('valid');
      }
    } else {
      input.classList.add('invalid');
      input.classList.add('shake');
      // Remove animation class after it completes
      setTimeout(() => {
        input.classList.remove('shake');
      }, 600);
    }

    // Update error message
    if (errorElement) {
      errorElement.textContent = errorMessage;
    }

    return isValid;
  }

  function validateAllInputs() {
    const form = document.getElementById('ipvaForm');
    const inputs = form.querySelectorAll('input:not([type="checkbox"])');
    let isValid = true;

    inputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Add validation event listeners to all form inputs
  const form = document.getElementById('ipvaForm');
  const inputs = form.querySelectorAll('input:not([type="checkbox"])');
  
  inputs.forEach(input => {
    // Validate on blur (when user leaves the field)
    input.addEventListener('blur', () => {
      validateInput(input);
    });
    
    // Live validation as user types (for better user experience)
    input.addEventListener('input', () => {
      // For text inputs, validate after a short delay to avoid too frequent validation
      if (input.type === 'text') {
        clearTimeout(input.timer);
        input.timer = setTimeout(() => {
          validateInput(input);
        }, 500);
      } else {
        validateInput(input);
      }
    });
  });

  function updateRealTimeResults() {
    // First validate required inputs
    if (!validateInput(document.getElementById('valor_veiculo'))) {
      return;
    }

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
    
    // Show success feedback when calculation is complete
    showFeedback('Cálculo sendo atualizado em tempo real', 'info', 1500);
  }

  ['valor_veiculo', 'aliquota', 'valorAdicional', 'valorExtra', 'valorAdicionalExtra', 'valorProposta', 'dataReferencia'].forEach(function (id) {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', updateRealTimeResults);
    }
  });

  // Only run initial calculation if we have a valid value
  const valorVeiculoInput = document.getElementById('valor_veiculo');
  if (valorVeiculoInput && valorVeiculoInput.value && !isNaN(parseFloat(valorVeiculoInput.value))) {
    updateRealTimeResults();
  }

  document.getElementById('ipvaForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Validate all inputs before submission
    if (!validateAllInputs()) {
      showFeedback('Por favor, corrija os erros no formulário antes de continuar.', 'error', 5000);
      return;
    }

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
      try {
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
          valorProposta: formatarParaMoeda(valorProposta),
          observacoes,
        });
        
        showFeedback('PDF gerado com sucesso!', 'success', 5000);
      } catch (error) {
        showFeedback('Erro ao gerar o PDF. Tente novamente.', 'error', 5000);
        console.error('Erro ao gerar PDF:', error);
      }
    } else {
      showFeedback('Cálculo realizado com sucesso!', 'success', 5000);
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

  const calcIpvaLink = document.querySelector('.calc-ipva-link');
  if (calcIpvaLink) {
    calcIpvaLink.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      
      // Validate all inputs before submission
      if (!validateAllInputs()) {
        showFeedback('Por favor, corrija os erros no formulário antes de continuar.', 'error', 5000);
        return;
      }
      
      document.getElementById('ipvaForm').dispatchEvent(new Event('submit', { 'bubbles': true, 'cancelable': true }));
    });
  }
  
  // Handle state selection to auto-fill the correct aliquota
  document.querySelectorAll('#tabela-servicos tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      const estado = row.cells[0].textContent;
      const aliquota = parseFloat(row.cells[1].textContent.replace('%', '').replace(',', '.'));
      
      document.getElementById('aliquota').value = aliquota;
      showFeedback(`Alíquota de ${estado} (${aliquota}%) aplicada com sucesso!`, 'success', 3000);
      
      // Switch to calculator view
      showSection(calculadora, [tabela, tabelaServicos, tabelaDetran, contato, sobre, ajuda, tutorial]);
      
      // Trigger calculation update
      updateRealTimeResults();
    });
  });

  // Keyboard navigation setup
  function setupKeyboardNavigation() {
    // Make all focusable elements tab-navigable
    const focusableElements = document.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
    
    // Tab index order setup
    focusableElements.forEach((element, index) => {
      element.setAttribute('tabindex', index + 1);
    });

    // Add keyboard event listeners to interactive tables
    const interactiveTables = [
      document.querySelector('#tabela-servicos table'),
      document.querySelector('#tabelaDetran table')
    ];

    interactiveTables.forEach(table => {
      if (!table) return;

      const rows = table.querySelectorAll('tbody tr');
      let currentFocusRow = 0;
      let currentFocusCell = 0;

      // Initialize first cell as keyboard navigable
      if (rows.length > 0) {
        rows[0].cells[0].setAttribute('tabindex', '0');
        rows[0].cells[0].addEventListener('focus', function() {
          this.classList.add('keyboard-focus');
        });
        rows[0].cells[0].addEventListener('blur', function() {
          this.classList.remove('keyboard-focus');
        });
      }

      // Handle keyboard navigation for each table
      table.addEventListener('keydown', function(event) {
        if (rows.length === 0) return;

        const rowCount = rows.length;
        const cellCount = rows[0].cells.length;

        // Store current focused position
        const currentRow = Array.from(rows).findIndex(row => row.contains(document.activeElement));
        if (currentRow >= 0) {
          currentFocusRow = currentRow;
          currentFocusCell = Array.from(rows[currentRow].cells).findIndex(cell => cell === document.activeElement);
        }

        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            if (currentFocusRow > 0) {
              rows[currentFocusRow - 1].cells[currentFocusCell].focus();
            }
            break;
          case 'ArrowDown':
            event.preventDefault();
            if (currentFocusRow < rowCount - 1) {
              rows[currentFocusRow + 1].cells[currentFocusCell].focus();
            }
            break;
          case 'ArrowLeft':
            event.preventDefault();
            if (currentFocusCell > 0) {
              rows[currentFocusRow].cells[currentFocusCell - 1].focus();
            }
            break;
          case 'ArrowRight':
            event.preventDefault();
            if (currentFocusCell < cellCount - 1) {
              rows[currentFocusRow].cells[currentFocusCell + 1].focus();
            }
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            if (table.id === 'tabela-servicos' || table.closest('#tabela-servicos')) {
              // Simulate a click for aliquota selection
              rows[currentFocusRow].click();
            } else if (table.id === 'tabelaDetran' || table.closest('#tabelaDetran')) {
              // For DETRAN table, try to find and activate the link
              const link = rows[currentFocusRow].querySelector('a');
              if (link) link.click();
            }
            break;
        }
      });

      // Make all cells keyboard focusable
      rows.forEach(row => {
        Array.from(row.cells).forEach(cell => {
          cell.setAttribute('tabindex', '0');
          cell.addEventListener('focus', function() {
            this.classList.add('keyboard-focus');
          });
          cell.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
          });
        });
      });
    });

    // Add keyboard shortcuts for navigation buttons
    document.addEventListener('keydown', function(event) {
      // Only process if not in input/textarea to avoid interfering with typing
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      if (event.altKey) {
        switch (event.key) {
          case 'c':
            event.preventDefault();
            if (calcBtn) calcBtn.click();
            break;
          case 'u':
            event.preventDefault();
            if (tutorialBtn) tutorialBtn.click();
            break;
          case 't':
            event.preventDefault();
            if (novaTabelaBtn) novaTabelaBtn.click();
            break;
          case 'd':
            event.preventDefault();
            if (siteDetranBtn) siteDetranBtn.click();
            break;
          case 'o':
            event.preventDefault();
            if (contatoBtn) contatoBtn.click();
            break;
          case 's':
            event.preventDefault();
            if (sobreBtn) sobreBtn.click();
            break;
          case 'h':
          case 'a':
            event.preventDefault();
            if (ajudaBtn) ajudaBtn.click();
            break;
        }
      }
    });

    // Ensure help buttons are keyboard accessible
    document.querySelectorAll('.ajuda-opcao').forEach(button => {
      button.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.click();
        }
      });
    });
  }
  
  // Show/hide keyboard shortcuts help
  const shortcutsButton = document.querySelector('.show-keyboard-shortcuts');
  const shortcutsHint = document.getElementById('keyboard-hint');
  
  if (shortcutsButton && shortcutsHint) {
    shortcutsButton.addEventListener('click', function() {
      const isVisible = !shortcutsHint.classList.contains('hidden');
      if (isVisible) {
        shortcutsHint.classList.add('hidden');
        shortcutsButton.setAttribute('aria-expanded', 'false');
      } else {
        shortcutsHint.classList.remove('hidden');
        shortcutsButton.setAttribute('aria-expanded', 'true');
      }
    });
  }
});