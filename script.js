document.getElementById('sobreBtn').addEventListener('click', function () {
    document.getElementById('sobre').classList.remove('hidden');
    document.getElementById('contato').classList.add('hidden');
});

document.getElementById('contatoBtn').addEventListener('click', function () {
    document.getElementById('contato').classList.remove('hidden');
    document.getElementById('sobre').classList.add('hidden');
});

// Definir a data atual no campo Data de Referência
document.addEventListener('DOMContentLoaded', function () {
    const dataAtual = new Date().toISOString().split('T')[0];
    document.getElementById('dataReferencia').value = dataAtual;
});

// Lógica de cálculo do IPVA
document.getElementById('ipvaForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const valorVeiculo = parseFloat(document.getElementById('valor_veiculo').value) || 0;
    const aliquota = parseFloat(document.getElementById('aliquota').value) || 0;
    const valorAdicional = parseFloat(document.getElementById('valorAdicional').value) || 0;
    const valorExtra = parseFloat(document.getElementById('valorExtra').value) || 0;
    const valorAdicionalExtra = parseFloat(document.getElementById('valorAdicionalExtra').value) || 0;
    const valorProposta = parseFloat(document.getElementById('valorProposta').value) || 0;
    const dataReferencia = new Date(document.getElementById('dataReferencia').value);
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

    document.getElementById('ipvaIntegral').innerText = `Valor Integral do IPVA: ${formatarParaMoeda(ipvaAnual)}`;
    document.getElementById('ipvaAjustado').innerText = `Valor do IPVA Ajustado até ${dataLimite.toLocaleDateString('pt-BR')}: ${formatarParaMoeda(ipvaAjustado)} (${mesesRestantes} meses restantes)`;
    document.getElementById('totalComAdicional').innerText = `Valor Total com Adicional: ${formatarParaMoeda(totalComAdicional)}`;

    let mensagemDiferenca = '';

    if (valorProposta > 0) {
        let valorDiferenca = valorProposta - totalComAdicional;
        mensagemDiferenca = valorDiferenca > 0
            ? `Está sobrando ${formatarParaMoeda(valorDiferenca)}`
            : valorDiferenca < 0
                ? `Está faltando valor, favor corrigir ${formatarParaMoeda(-valorDiferenca)}`
                : 'Valores estão equilibrados.';
    }

    document.getElementById('valorDiferenca').innerText = mensagemDiferenca;
    document.getElementById('results').classList.add('show');

    document.getElementById('ipvaForm').reset();
});
