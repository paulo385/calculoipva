
document.getElementById('ipvaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obter valores dos inputs
    const valorVeiculo = parseFloat(document.getElementById('valor_veiculo').value);
    const aliquota = parseFloat(document.getElementById('aliquota').value);
    
    // Função para calcular o IPVA
    function calcularIpva(valorVeiculo, aliquota, mesMultiplicador = 5) {
        const ipvaAnual = valorVeiculo * (aliquota / 100);
        const ipvaMensal = ipvaAnual / 12;
        const ipvaAjustado = ipvaMensal * mesMultiplicador;
        return { ipvaAnual, ipvaAjustado };
    }
    
    // Calcular valores
    const { ipvaAnual, ipvaAjustado } = calcularIpva(valorVeiculo, aliquota);

    // Exibir resultados
    document.getElementById('ipvaIntegral').innerText = `Valor Integral do IPVA: R$ ${ipvaAnual.toFixed(2)}`;
    document.getElementById('ipvaAjustado').innerText = `Valor do IPVA Ajustado para o 5 Meses : R$ ${ipvaAjustado.toFixed(2)}`;
    document.getElementById('results').style.display = 'block';
});
