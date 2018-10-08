var velocidade = 1000;
var velocidadePista = 3;
var linhaObstaculo = 0;
var colunaObstaculo = 0;
var linhaRemove = -1;
var carrinhoL = 5;
var carrinhoC = 5;
var interval;
var pontos = 0;
var record = 0;
var carObstaculo = 1;
var rolaPista = 0;
var intervalPista;

$(document).ready(function () {
    criarPista();

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
    setInterval(function () { velocidadePista++; }, 2000);
});

function novoJogo(){
    clearInterval(interval);
    clearInterval(intervalPista);
    intervalPista = setInterval(rolarPista, 50);
    velocidade = 1000;
    velocidadePista = 3;
    linhaObstaculo = 0;
    colunaObstaculo = 0;
    linhaRemove = -1;
    carrinhoL = 5;
    carrinhoC = 5;
    pontos = 0;
    $("#pontos").text(pontos);
    $("#status").text("Jogando");
    criarPista();
    desenharCarrinho(carrinhoL, carrinhoC);
    loop();
}

function rolarPista() {
    var tabela = $("table")[0];
    rolaPista+=velocidadePista;
    if (rolaPista > 500){
        rolaPista = 0;
    }
    tabela.style.backgroundPosition = "0px "+rolaPista+"px";
}

function loop() {
    if(velocidade < 50){
        velocidade = 50;
    }
    interval = setTimeout(desenhaObstaculo, velocidade);
    
}

function criarPista() {
    var base = $("#basePista");
    var html = "<table id='pista'>";

    for (var linha = 0; linha < 6; linha++) {
        html += "<tr>";
        for (var coluna = 0; coluna < 11; coluna++) {
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

function desenhaObstaculo() {
    if (linhaObstaculo == 0) {
        carObstaculo = carObstaculo == 1 ? 2 : 1;
        colunaObstaculo = Math.floor((Math.random() * 11));
    }

    atualizaObstaculo($("#" + linhaObstaculo + "-" + colunaObstaculo));
    loop();
    verificaBatida();
}

function atualizaObstaculo(obstaculo) {
    if(carObstaculo == 1){
        obstaculo.addClass("obstaculo1");
        $("#" + (linhaObstaculo - 1) + "-" + colunaObstaculo).removeClass("obstaculo1");
    }else{
        obstaculo.addClass("obstaculo2");
        $("#" + (linhaObstaculo - 1) + "-" + colunaObstaculo).removeClass("obstaculo2");
    }

    linhaObstaculo++;
    if (linhaObstaculo >= 7) {
        linhaObstaculo = 0;
        pontos++;
        $("#pontos").text(pontos);
    }
}

function verificaBatida() {
    var tds = $("td");
    for (var i = 0; i < tds.length; i++) {
        if (tds[i].className.indexOf("obstaculo") != -1 && tds[i].className.indexOf("carrinho") != -1) {
            $("#status").text("Game Over");
            if(record < pontos){
                record = pontos;
                $("#record").text(record);
            }
            clearInterval(interval);
            clearInterval(intervalPista);
        }
    }
}

function andaCarrinho(key) {
    if($("#status").text() != "Game Over"){
        $("#" + carrinhoL + "-" + carrinhoC).removeClass("carrinho");
        if (key == 37 && carrinhoC > 0) {
            carrinhoC--;
        } else if (key == 38 && carrinhoL > 4) {
            carrinhoL--;
        } else if (key == 39 && carrinhoC < 10) {
            carrinhoC++;
        } else if (key == 40 && carrinhoL < 5) {
            carrinhoL++;
        }
        desenharCarrinho(carrinhoL, carrinhoC);
    }
    verificaBatida();
}
