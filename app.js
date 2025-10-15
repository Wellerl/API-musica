const entradaUrlServidor = document.getElementById('serverUrl');
const botaoConectar = document.getElementById('connectBtn');
const elementoStatus = document.getElementById('status');
const listaMusicasEl = document.getElementById('songList');
const audioEl = document.getElementById('audio');
const tocandoAgoraEl = document.getElementById('nowPlaying');

// compatibilidade: lê 'urlServidor' (novo) ou 'serverUrl' (antigo)
const urlSalva = localStorage.getItem('urlServidor') ?? localStorage.getItem('serverUrl');
if (urlSalva) entradaUrlServidor.value = urlSalva;

function juntarUrl(base, relativo) {
  try {
    return new URL(relativo, base).href;
  } catch {
    return base.replace(/\/+$/, '') + '/' + relativo.replace(/^\/+/, '');
  }
}

async function buscarJSON(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  return resposta.json();
}

function definirStatus(mensagem) {
  elementoStatus.textContent = mensagem;
}

botaoConectar.addEventListener('click', async () => {
  const base = entradaUrlServidor.value.trim().replace(/\/$/, '');
  if (!base) { definirStatus('Informe a URL do servidor.'); return; }

  // salva usando a nova chave e também a antiga (compat)
  localStorage.setItem('urlServidor', base);
  localStorage.setItem('serverUrl', base);

  definirStatus('Conectando…');
  try {
    const saude = await buscarJSON(juntarUrl(base, '/api/saude'));
    definirStatus(`Conectado. ${saude.count} músicas disponíveis.`);
    const musicas = await buscarJSON(juntarUrl(base, '/api/musicas'));
    renderizarMusicas(base, musicas);
  } catch (erro) {
    definirStatus('Falha ao conectar. Verifique a URL e a rede.');
    console.error(erro);
  }
});

function renderizarMusicas(base, musicas) {
  listaMusicasEl.innerHTML = '';
  if (!musicas.length) {
    listaMusicasEl.innerHTML = '<li>Nenhuma música encontrada no servidor.</li>';
    return;
  }

  musicas.forEach(musica => {
    const li = document.createElement('li');

    const blocoMeta = document.createElement('div');
    blocoMeta.className = 'meta';

    const tituloEl = document.createElement('div');
    tituloEl.className = 'title';
    tituloEl.textContent = musica.title || '(Sem título)';

    const artistaEl = document.createElement('div');
    artistaEl.className = 'artist';
    artistaEl.textContent = musica.artist || 'Desconhecido';

    blocoMeta.appendChild(tituloEl);
    blocoMeta.appendChild(artistaEl);

    const botaoTocar = document.createElement('button');
    botaoTocar.textContent = 'Tocar';
    botaoTocar.addEventListener('click', () => tocarMusica(base, musica));

    li.appendChild(blocoMeta);
    li.appendChild(botaoTocar);
    listaMusicasEl.appendChild(li);
  });
}

function tocarMusica(base, musica) {
  const url = musica.url?.startsWith('http') ? musica.url : juntarUrl(base, musica.url);
  audioEl.src = url;
  audioEl.play().catch(console.error);
  tocandoAgoraEl.textContent = `Tocando: ${musica.title} — ${musica.artist}`;
}


const audio = document.getElementById('audio');
const btnPlayPause = document.getElementById('btnPlayPause');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');

btnPlayPause.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    btnPlayPause.innerHTML = '<i class="fa fa-pause"></i>';
  } else {
    audio.pause();
    btnPlayPause.innerHTML = '<i class="fa fa-play"></i>';
  }
});

// Atualiza a barra de progresso e o tempo
audio.addEventListener('timeupdate', () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress || 0;

  const currentMinutes = Math.floor(audio.currentTime / 60);
  const currentSeconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
  currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;

  const totalMinutes = Math.floor(audio.duration / 60);
  const totalSeconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
  if (!isNaN(totalMinutes)) {
    totalTimeEl.textContent = `${totalMinutes}:${totalSeconds}`;
  }
});

// Permite arrastar a barra para mudar o ponto da música
progressBar.addEventListener('input', () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});


  // Seleciona todos os corações
  document.querySelectorAll('.fa-heart').forEach(heart => {
    heart.addEventListener('click', () => {
      heart.classList.toggle('active');
    });
  });


 
