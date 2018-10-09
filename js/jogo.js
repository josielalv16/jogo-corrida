//Velocidade dos obstaculos
var velocidade = 1000;
//Velocidade da pista
var velocidadePista = 3;
//Linha inicial dos obstaculos
var linhaObstaculo = 0;
var linhaObstaculo2 = 0;
//Colunas iniciais dos obstaculos
var colunaObstaculo = 0;
var colunaObstaculo2 = -1;
//Variavel para remover o obstaculo da posição anterior da atual
var linhaRemove = -1;
//Linha inicial do carrinho do player
var carrinhoL = 7;
//Coluna inicial do carrinho do player
var carrinhoC = 5;
//Interval dos obstaculos e da pista
var interval;
var intervalPista;
//Pontuação
var pontos = 0;
var record = 0;
//Quantidade de px que a pista vai rodar
var rolaPista = 0;
//Lista de obstaculos
var listObs = [];

var linhasObstaculos = [0,0,0,0];
var colunasObstaculos = [0,-1,-1,-1];

$(document).ready(function () {
    criarPista();

    //Pega a tecla digitada, se for alguma das setas atualiza a posição do carrinho
    $("body").bind("keydown", function (e) {
        var keyCode = e.which;
        if (keyCode > 36 && keyCode < 41) {
            andaCarrinho(keyCode);
        }
    });

    //Coloca função de novoJogo no botão
    $("#novoJogo").click(function () {
        novoJogo();
    });

    novoJogo();
    //A cada 2segundos altera a velocidade dos obstaculos e da pista
    setInterval(function () { velocidade -= 50; }, 2000);
    setInterval(function () { velocidadePista++; }, 2000);
});

function novoJogo() {
    //Reseta todas as variaveis, inicia novo jogo
    clearInterval(interval);
    clearInterval(intervalPista);
    intervalPista = setInterval(rolarPista, 50);
    velocidade = 1000;
    velocidadePista = 3;
    linhaObstaculo = 0;
    colunaObstaculo = 0;
    linhaObstaculo2 = 0;
    colunaObstaculo2 = -1;
    linhaRemove = -1;
    carrinhoL = 7;
    carrinhoC = 5;
    pontos = 0;
    linhasObstaculos = [0,0,0,0];
    colunasObstaculos = [0,-1,-1,-1];
    $("#pontos").text(pontos);
    $("#status").text("Jogando");
    criarPista();
    desenharCarrinho(carrinhoL, carrinhoC);
    loop();
}

//Altera o position da imagem de fundo(pista) da tabela
function rolarPista() {
    var tabela = $("table")[0];
    rolaPista += velocidadePista;
    if (rolaPista > 1000) {
        rolaPista = 0;
    }
    tabela.style.backgroundPosition = "0px " + rolaPista + "px";
}

//Loop do jogo, desenhando os obstaculos de acordo com a velocidade
function loop() {
    if (velocidade < 50) {
        velocidade = 50;
    }
    interval = setTimeout(desenhaObstaculo, velocidade);
}

//Criação da pista (table)
function criarPista() {
    var base = $("#basePista");
    var html = "<table id='pista'>";

    for (var linha = 0; linha < 8; linha++) {
        html += "<tr>";
        for (var coluna = 0; coluna < 11; coluna++) {
            html += "<td id='" + linha + "-" + coluna + "' class=''></td>";
        }
        html += "</tr>";
    }

    html += "</table>";
    base.html(html);
}

//Desenha carrinho da linha/coluna da tabela
function desenharCarrinho(linha, coluna) {
    $("#" + linha + "-" + coluna).addClass("carrinho");
}

function desenhaObstaculo() {
    //Se a linhaObstaculo for 0 cria um novo obstaculo em uma coluna aleatoria da tabela
    if (linhasObstaculos[0] == 0) {
        colunasObstaculos[0] = Math.floor((Math.random() * 11));
    }
    //Se a linhaObstaculo for 2, cria um novo obstaculo, colocando dois obstaculos na tabela
    if (linhasObstaculos[0] == 2) {
        colunasObstaculos[1] = Math.floor((Math.random() * 11));
    }
    if (linhasObstaculos[0] == 4) {
        colunasObstaculos[2] = Math.floor((Math.random() * 11));
    }
    if (linhasObstaculos[0] == 6) {
        colunasObstaculos[3] = Math.floor((Math.random() * 11));
    }

    //Adiciona o primeiro obstaculo da lista
    listObs[0] = $("#" + linhasObstaculos[0] + "-" + colunasObstaculos[0]);
    //Somente adiciona o segundo obstaculo, se ja tiver criado o mesmo
    if (colunasObstaculos[1] != -1) {
        listObs[1] = $("#" + linhasObstaculos[1] + "-" + colunasObstaculos[1]);
    }
    if (colunasObstaculos[2] != -1) {
        listObs[2] = $("#" + linhasObstaculos[2] + "-" + colunasObstaculos[2]);
    }
    if (colunasObstaculos[3] != -1) {
        listObs[3] = $("#" + linhasObstaculos[3] + "-" + colunasObstaculos[3]);
    }
    //Atualiza os obstaculos na tabela
    atualizaObstaculo(listObs);

    loop();
    verificaBatida();
}

function atualizaObstaculo(obstaculo) {
    for(var i = 0; i < colunasObstaculos.length; i++){
        if(colunasObstaculos[i] != -1){
            if(i%2 == 0){
                $(obstaculo[i].addClass("obstaculo1"));
                $("#" + (linhasObstaculos[i] - 1) + "-" + colunasObstaculos[i]).removeClass("obstaculo1");
            }else{
                $(obstaculo[i].addClass("obstaculo2"));
                $("#" + (linhasObstaculos[i] - 1) + "-" + colunasObstaculos[i]).removeClass("obstaculo2");
            }
            linhasObstaculos[i]++;
            if (linhasObstaculos[i] >= 9) {
                linhasObstaculos[i] = 0;
                pontos++;
                $("#pontos").text(pontos);
            }
        }
    }
}

function verificaBatida() {
    //Pega todas as td's da tabela
    var tds = $("td");
    for (var i = 0; i < tds.length; i++) {
        //Verifica se na td atual existe as classes obstaculo e carrinho, se sim significa que bateu
        if (tds[i].className.indexOf("obstaculo") != -1 && tds[i].className.indexOf("carrinho") != -1) {
            $("#status").text("Game Over");
            //Verifica se os pontos é maior que o record, se sim atualiza record
            if (record < pontos) {
                record = pontos;
                $("#record").text(record);
            }

            tds[i].classList.remove("obstaculo1");
            tds[i].classList.remove("obstaculo2");

            explosao();
            //Pausa o movimento dos obstaculos e da pista
            clearInterval(interval);
            clearInterval(intervalPista);
        }
    }
}

function andaCarrinho(key) {
    if ($("#status").text() != "Game Over") {
        //Remove o carrinho da posição antiga
        $("#" + carrinhoL + "-" + carrinhoC).removeClass("carrinho");
        //Seta para Esquerda, atualiza a coluna do carrinho para Esquerda
        if (key == 37 && carrinhoC > 0) {
            carrinhoC--;
        }
        //Seta para Cima, atualiza a linha do carrinho para Cima
        else if (key == 38 && carrinhoL > 6) {
            carrinhoL--;
        }
        //Seta para Direita, atualiza a coluna do carrinho para Direita
        else if (key == 39 && carrinhoC < 10) {
            carrinhoC++;
        }
        //Seta para Baixo, alualiza a linha do carrinho para Baixo
        else if (key == 40 && carrinhoL < 7) {
            carrinhoL++;
        }
        //Desenha carrinho na nova posição
        desenharCarrinho(carrinhoL, carrinhoC);
    }
    verificaBatida();
}

function explosao() {
    var td = document.getElementsByClassName("carrinho")[0];
    td.classList.add("explosao");
    td.classList.remove("carrinho");

    var sprite = [0, 76, 152, 228, 304, 380, 456, 532, 608, 684, 760, 836, 912, 988, 1064, 1140, 1216, 1292, 1368, 1444, 1520, 1596, 1672, 1748, 1824, 1900, 1976, 2052, 2128, 2204, 2280, 2356, 2432, 2508, 2584, 2660, 2736];
    var explosao = document.getElementsByClassName('explosao')[0];
    var aux = 0;
    var i = setInterval(function () {
        explosao.setAttribute('style', 'background-position: -' + sprite[aux] + 'px 0px;');
        aux++;
        if (aux >= sprite.length) {
            aux = 0;
            clearInterval(i);
        }
    }, 60);
}