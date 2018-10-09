//Velocidade dos obstaculos
var velocidade = 1000;
//Velocidade da pista
var velocidadePista = 3;
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
//Lista com linhas e colunas dos obstaculos
var linhasObstaculos = [0, 0, 0, 0];
var colunasObstaculos = [0, -1, -1, -1];

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
    carrinhoL = 7;
    carrinhoC = 5;
    pontos = 0;
    linhasObstaculos = [0, 0, 0, 0];
    colunasObstaculos = [0, -1, -1, -1];
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
    //Se a linhasObstaculos[0] for 0 cria um novo obstaculo em uma coluna aleatoria da tabela
    if (linhasObstaculos[0] == 0) {
        colunasObstaculos[0] = Math.floor((Math.random() * 11));
    }
    //Se a linhasObstaculos[0] for 2, cria um novo obstaculo, colocando dois obstaculos na tabela
    if (linhasObstaculos[0] == 2) {
        colunasObstaculos[1] = Math.floor((Math.random() * 11));
    }
    //Se a linhasObstaculos[0] for 4, cria um novo obstaculo, colocando tres obstaculos na tabela
    if (linhasObstaculos[0] == 4) {
        colunasObstaculos[2] = Math.floor((Math.random() * 11));
    }
    //Se a linhasObstaculos[0] for 6, cria um novo obstaculo, colocando quatro obstaculos na tabela
    if (linhasObstaculos[0] == 6) {
        colunasObstaculos[3] = Math.floor((Math.random() * 11));
    }

    //Adiciona o primeiro obstaculo na lista
    listObs[0] = $("#" + linhasObstaculos[0] + "-" + colunasObstaculos[0]);
    //Somente adiciona os outros obstaculos se a variaval de colunasObstaculos for diferente de -1
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
    for (var i = 0; i < colunasObstaculos.length; i++) {
        if (colunasObstaculos[i] != -1) {
            //Se 'i' for par adiciona o obstaculo1 se for impar adiciona obstaculo2
            if (i % 2 == 0) {
                $(obstaculo[i].addClass("obstaculo1"));
                //Remove o obstaculo da posição anterior da atual
                $("#" + (linhasObstaculos[i] - 1) + "-" + colunasObstaculos[i]).removeClass("obstaculo1");
            } else {
                $(obstaculo[i].addClass("obstaculo2"));
                $("#" + (linhasObstaculos[i] - 1) + "-" + colunasObstaculos[i]).removeClass("obstaculo2");
            }
            //Passa o obstaculo para a proxima linha da tabela
            linhasObstaculos[i]++;
            //Se a linhasObstaculos[i] for maior/igual a 9, obstaculo percorreu todas as linhas, saiu da tabela, então volta para linha 0 e atualiza os pontos
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
            //Remove as classes da coluna/linha
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
    //Captura a td que esta o carrinho, onde ocorreu a batida
    var td = document.getElementsByClassName("carrinho")[0];
    //Adiciona classe da explosão (sprite)
    td.classList.add("explosao");
    //Remove o carrinho
    td.classList.remove("carrinho");

    //Posições X na imagem PNG do sprite de explosão
    var sprite = [0, 76, 152, 228, 304, 380, 456, 532, 608, 684, 760, 836, 912, 988, 1064, 1140, 1216, 1292, 1368, 1444, 1520, 1596, 1672, 1748, 1824, 1900, 1976, 2052, 2128, 2204, 2280, 2356, 2432, 2508, 2584, 2660, 2736];

    //Auxiliar para percorrer as posições do sprite
    var aux = 0;
    //Altera a posição X do sprite a cada 60 milisegundos 
    var i = setInterval(function () {
        //Altera a posição do sprite
        td.setAttribute('style', 'background-position: -' + sprite[aux] + 'px 0px;');
        aux++;
        //Se aux for maior/igual ao tamanho da lista de posições, zera aux e pausa a explosão
        if (aux >= sprite.length) {
            aux = 0;
            clearInterval(i);
        }
    }, 60);
}