var velocidade = 500;
var linhaObstaculo = 0;
var colunaObstaculo = 0;
var linhaRemove = -1;
var carrinhoL = 6;
var carrinhoC = 2;
var interval;
var pontos = 0;
var record = 0;

$(document).ready(function () {
    criarPista();

    desenharCarrinho(carrinhoL, carrinhoC);
    $("body").bind("keydown", function (e) {
        var keyCode = e.which;
        if (keyCode > 36 && keyCode < 41) {
            andaCarrinho(keyCode);
        }
    });

    $("#novoJogo").click(function(){
        novoJogo();
    });

    novoJogo();
    setInterval(function () { velocidade -= 50; }, 2000);
});

function novoJogo(){
    velocidade = 1000;
    linhaObstaculo = 0;
    colunaObstaculo = 0;
    linhaRemove = -1;
    carrinhoL = 6;
    carrinhoC = 2;
    pontos = 0;
    criarPista();
    desenharCarrinho(carrinhoL, carrinhoC);
    loop();
    
    
}

function loop() {
    interval = setTimeout(desenhaObstaculo, velocidade);
}

function criarPista() {
    var base = $("#basePista");
    var html = "<table id='pista'>";

    for (var linha = 0; linha < 7; linha++) {
        html += "<tr>";
        for (var coluna = 0; coluna < 5; coluna++) {
            html += "<td id='" + linha + "-" + coluna + "' class=''></td>";
        }
        html += "</tr>";
    }

    html += "</table>";
    base.html(html);
}

function desenharCarrinho(linha, coluna) {
    $("#" + linha + "-" + coluna).addClass("carrinho");
}

function andaCarrinho(key) {
    $("#" + carrinhoL + "-" + carrinhoC).removeClass("carrinho");
    if (key == 37 && carrinhoC > 0) {
        carrinhoC--;
    } else if (key == 38 && carrinhoL > 5) {
        carrinhoL--;
    } else if (key == 39 && carrinhoC < 4) {
        carrinhoC++;
    } else if (key == 40 && carrinhoL < 6) {
        carrinhoL++;
    }
    desenharCarrinho(carrinhoL, carrinhoC);
    verificaBatida();
}


function atualizaObstaculo(obstaculo) {
    obstaculo.addClass("obstaculo");
    $("#" + (linhaObstaculo - 1) + "-" + colunaObstaculo).removeClass("obstaculo");

    linhaObstaculo++;
    if (linhaObstaculo >= 8) {
        linhaObstaculo = 0;
        pontos++;
        $("#pontos").text(pontos);
    }
}

function desenhaObstaculo() {
    if (linhaObstaculo == 0) {
        colunaObstaculo = Math.floor((Math.random() * 5));
    }

    atualizaObstaculo($("#" + linhaObstaculo + "-" + colunaObstaculo));
    loop();
    verificaBatida();
}

function verificaBatida() {
    var tds = document.getElementsByTagName("td");
    for (var i = 0; i < tds.length; i++) {
        if (tds[i].className.indexOf("obstaculo") != -1 && tds[i].className.indexOf("carrinho") != -1) {
            alert("bateu");
            if(record < pontos){
                record = pontos;
                $("#record").text(record);
            }
            clearInterval(interval);
            console.log(tds[i]);
            // tds[i].removeClass("obstaculo");
        }
    }
}