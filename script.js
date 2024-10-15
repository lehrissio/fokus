const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
const startPauseBt = document.querySelector('#start-pause');
const audioPlay = new Audio('/sons/play.wav');
const audioPause = new Audio('/sons/pause.mp3');
const audioTempoFinalizado = new Audio('/sons/beep.mp3');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const imagemIniciarOuPausar = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');

let tempoDecorridoEmSegundos = 1500;
let intervaloId = null;

musica.loop = true;

musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play();
    }
    else {
        musica.pause();
    }
})

function alterarContexto(contexto) {
    mostrarTempo();

    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    })

    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;

        case "descanso-curto":
            titulo.innerHTML = `
            Que tal dar uma respirada?<br>
            <strong class="app__title-strong"> Faça uma pausa curta.</strong>
            `
            break; 

        case "descanso-longo":
            titulo.innerHTML = `
            Hora de voltar à superfície.<br>
            <strong class="app__title-strong"> Faça uma pausa longa.</strong>
            `
            break; 
    }
}

focoBt.addEventListener('click', () => {
    intervaloIdENulo();
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active');

})

curtoBt.addEventListener('click', () => {
    intervaloIdENulo();
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');

})

longoBt.addEventListener('click', () => {
    intervaloIdENulo();
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');

})

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0) {
        audioTempoFinalizado.play();
        alert('Tempo finalizado!');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';

        if(focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento); 
        } // se o foco estiver ativo, dispara o evento FocoFinalizado

        zerar();

        return
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();

}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId === null) {
        intervaloId = setInterval(contagemRegressiva, 1000);
        audioPlay.play();
        imagemIniciarOuPausar.setAttribute('src', '/imagens/pause.png');
        iniciarOuPausarBt.textContent = "Pausar";
    }
    else {
        intervaloIdENulo();
    }
    
}

function intervaloIdENulo () {
    if(intervaloId){
        audioPause.play();
        zerar();

        return
    }
}

function zerar() {
    clearInterval(intervaloId);
    imagemIniciarOuPausar.setAttribute('src', '/imagens/play_arrow.png');
    iniciarOuPausarBt.textContent = "Começar";
    intervaloId = null;
    
}

function  mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pr-br', {minute: '2-digit', second: '2-digit' })
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();