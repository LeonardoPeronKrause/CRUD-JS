// Importa o módulo readline do Node.js, que é usado para ler entradas do usuário no terminal
const readline = require('readline');

const fs = require('fs');

// Cria uma interface readline para interagir com o usuário
const rl = readline.createInterface({
    input: process.stdin,  // configura a entrada como process.stdin (entrada padrão do terminal)
    output: process.stdout // configura a saída como process.stdout (saída padrão do terminal)
});

const empresas = [];

// Aqui começa o seu código para interagir com o usuário através do terminal
// Você pode implementar menus interativos, perguntas e outras interações
// Exemplo de uso:
// rl.question('Qual é o seu nome? ', function(nome) {
//    console.log(`Olá, ${nome}!`);
//    rl.close(); // Fecha a interface readline após interação
// });

// Funçã para inciar o programa
const iniciar = function() {
        exibirMenu();
}
 // Função para exibir o menu 
const exibirMenu = function() {
    console.log('MENU:');
    console.log('[1] CADASTRAR EMPRESA.');
    console.log('[2] EDITAR EMPRESA.');
    console.log('[3] MOSTRAR EMPRESA.');
    console.log('[4] EXCLUIR EMPRESA.');
    console.log('[5] FAZER BACKUP.');
    console.log('[0] SAIR');
    rl.question('Qual opção vc deseja utilizar? ', function(opcao) {
        if (opcao === '1') {
            cadastrarEmpresa();
        } else if (opcao === '2') {
            editarEmpresa();
        } else if (opcao === '3') {
            mostrarEmpresas(); 
        } else if (opcao === '4') {
            excluirEmpresa();
        } else if (opcao === '5') {
            fazerBackup();
        } else if (opcao === '0') {
            sair();
        } else {
            console.log('Opção selecionada incorretamente, por favor digite uma opção válida!');
            exibirMenu();
        }
    })
}

// Função para cadastrar empresas
const cadastrarEmpresa = function() {
    rl.question('Qual o nome da empresa? ', function(nome) {
        rl.question('Qual é o CNPJ da empresa? ', function(cnpj) {
            if (!validarCNPJ(cnpj)) {
                console.log('CNPJ inválido!');
                return exibirMenu();
            }
            rl.question('Qual é o segmento da empresa? (Saúde, Comércio, Financeiro...) ', function(segmento) {
                const empresa = {
                    nome,
                    cnpj,
                    segmento
                };
                empresas.push(empresa);
                console.log(`Empresa cadastrada com sucesso: ${nome}`);
                console.log(empresas);
                exibirMenu();
                }); 
            });
        });
    }        

// Função para validar CNPJ
const validarCNPJ = function(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');  // Remove todos os caracteres que não são dígitos

    if (cnpj.length !== 14) return false; // Verifica se o CNPJ tem 14 números

    if (/^(\d)\1+$/.test(cnpj)) return false; // Elimina CNPJs inválidos conhecidos (sequências de números iguais)

    // Calcula o primeiro dígito verificador
    let tamanho = cnpj.length - 2; 
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;

    // Calcula o segundo dígito verificador
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) return false;

    return true;
}

// Função para editar uma empresa existente
const editarEmpresa = function() {
    if (empresas.length === 0) {
        console.log('Nenhuma empresa cadastrada!');
        exibirMenu();
        return;
    }

    mostrarEmpresas(false); // Passando false para evitar o exibirMenu
    rl.question('Digite o índice da empresa que deseja editar: ', function(indice) {
        const idx = parseInt(indice) - 1;
        if (isNaN(idx) || idx < 0 || idx >= empresas.length) {
            console.log('Índice inválido!');
            exibirMenu();
            return;
        }

        const empresa = empresas[idx];
        rl.question(`Novo nome da empresa (${empresa.nome}) (Se você deixar em branco o nome permenecerá o atual): `, function(nome) {
            rl.question(`Novo CNPJ da empresa (${empresa.cnpj}) (Se você deixar em branco o CNPJ permenecerá o atual): `, function(cnpj) {
                if (cnpj && !validarCNPJ(cnpj)) {
                    console.log('CNPJ inválido!');
                    return exibirMenu();
                }
                rl.question(`Novo segmento da empresa (${empresa.segmento}) (Se você deixar em branco o segmento permenecerá o atual): `, function(segmento) {
                    empresa.nome = nome || empresa.nome;
                    empresa.cnpj = cnpj || empresa.cnpj;
                    empresa.segmento = segmento || empresa.segmento;
                    console.log('Empresa editada com sucesso!');
                    exibirMenu();
                });
            });
        });
    });
}

// Função para mostrar empresas cadastradas
const mostrarEmpresas = function(callMenu = true) {
    if (empresas.length === 0) {
        console.log('Nenhuma empresa cadastrada!');
        exibirMenu();
        return;
    }

    empresas.forEach((empresa, index) => {
        console.log(`[${index + 1}] Nome: ${empresa.nome}, CNPJ: ${empresa.cnpj}, Segmento: ${empresa.segmento}`);
    });

    if (callMenu) exibirMenu();
}

// Função para excluir empresas cadastradas
const excluirEmpresa = function() {
    if (empresas.length === 0) {
        console.log('Nenhuma empresa cadastrada!')
        exibirMenu();
        return;
    }

    mostrarEmpresas(false); // O parâmetro false evita que a função exiba o menu novamente
    rl.question('Digite o indice da empresa você deseja excluir: ', function(indice) {
        const idx = parseInt(indice) - 1;
        if (isNaN(idx) || idx < 0 || idx >= empresas.length) {
            console.log('Índice inválido!');
            exibirMenu();
            return;
        }

        empresas.splice(idx, 1);
        console.log(`Empresa ${idx + 1} excluída com sucesso!`);
        exibirMenu();
    })
}

// Função para fazer o backup dos dados
const fazerBackup = function() {
    if (empresas.length === 0) {
        console.log('Nenhuma empresa cadastrada! Não há dados para fazer backup.');
        exibirMenu();
        return;
    }
    
    const dadosJson = JSON.stringify(empresas, null, 2); // Converte o array 'empresas' para uma string JSON formatada
    const caminhoArquivo = 'backup_empresas.json';
    fs.writeFile(caminhoArquivo, dadosJson, (err) => { // Função de callback que será chamada após a tentativa de escrita no arquivo
        if (err) {
            console.log('Erro ao fazer backup!', err);
            exibirMenu();
        } else {
            console.log(`Backup realizado com sucesso! Dados salvos em ${caminhoArquivo}`);
        }
        exibirMenu();
    });     
}

// Função para sair do programa
const sair = function() {
    console.log('Saindo, até logo...');
    rl.close();
}

module.exports = {
    iniciar
}
