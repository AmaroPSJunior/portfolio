let audioContext: AudioContext | null = null;
let masterVolume = 1;

export function setRepositoryExplorerVolume(
  volume: number
) {
  masterVolume = Math.max(
    0,
    Math.min(1, volume)
  );
}

export function getRepositoryExplorerVolume() {
  return masterVolume;
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine'
) {
  const context = getAudioContext();

  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  const SOUND_GAIN = 5;

  oscillator.type = type;

  oscillator.frequency.setValueAtTime(
    frequency,
    context.currentTime
  );

  gain.gain.setValueAtTime(
    0.0001,
    context.currentTime
  );

  const targetVolume = Math.max(
    0.0001,
    volume * masterVolume * SOUND_GAIN
  );

  gain.gain.exponentialRampToValueAtTime(
    targetVolume,
    context.currentTime + 0.01
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();

  oscillator.stop(
    context.currentTime + duration + 0.02
  );
}

export function playRepositoryHoverSound() {
  // Hover: curto e agudo
  playTone(680, 0.045, 0.014, 'sine');
}

export function playRepositorySelectSound() {
  // Seleção: confirmação mais marcada
  playTone(420, 0.055, 0.028, 'square');

  setTimeout(() => {
    playTone(760, 0.075, 0.02, 'sine');
  }, 45);
}

export function playRepositoryReturnSound() {
  // Retorno: som próprio, grave e suave.
  // Não é uma variação do hover.
  playTone(260, 0.10, 0.025, 'sine');

  setTimeout(() => {
    playTone(180, 0.14, 0.02, 'triangle');
  }, 70);
}

export function playRepositoryMapChangeSound() {
  playTone(280, 0.05, 0.02, 'triangle');

  setTimeout(() => {
    playTone(560, 0.08, 0.025, 'triangle');
  }, 40);
}

export function playRepositoryOpenSound() {
  // Abertura ~2s:
  // começa grave, cria movimento e termina com uma ativação brilhante.

  playTone(110, 0.18, 0.018, 'sine');

  setTimeout(() => {
    playTone(165, 0.16, 0.018, 'triangle');
  }, 120);

  setTimeout(() => {
    playTone(220, 0.18, 0.02, 'sine');
  }, 260);

  setTimeout(() => {
    playTone(330, 0.18, 0.022, 'triangle');
  }, 410);

  setTimeout(() => {
    playTone(440, 0.16, 0.02, 'sine');
  }, 570);

  setTimeout(() => {
    playTone(550, 0.18, 0.022, 'triangle');
  }, 730);

  setTimeout(() => {
    playTone(660, 0.16, 0.02, 'sine');
  }, 900);

  setTimeout(() => {
    playTone(780, 0.18, 0.022, 'triangle');
  }, 1080);

  setTimeout(() => {
    playTone(880, 0.22, 0.018, 'sine');
  }, 1260);

  setTimeout(() => {
    playTone(1040, 0.3, 0.022, 'sine');
  }, 1450);

  setTimeout(() => {
    playTone(1320, 0.35, 0.016, 'triangle');
  }, 1650);
}

export function playRepositoryCloseSound() {
  // Encerramento ~2s
  // Mais presente e encorpado, com queda progressiva.

  playTone(880, 0.16, 0.045, 'sine');

  setTimeout(() => {
    playTone(740, 0.15, 0.042, 'triangle');
  }, 120);

  setTimeout(() => {
    playTone(620, 0.16, 0.044, 'sine');
  }, 240);

  setTimeout(() => {
    playTone(520, 0.17, 0.046, 'triangle');
  }, 370);

  setTimeout(() => {
    playTone(440, 0.18, 0.048, 'sine');
  }, 510);

  setTimeout(() => {
    playTone(360, 0.18, 0.050, 'triangle');
  }, 650);

  setTimeout(() => {
    playTone(300, 0.20, 0.052, 'sine');
  }, 800);

  setTimeout(() => {
    playTone(250, 0.20, 0.050, 'triangle');
  }, 950);

  setTimeout(() => {
    playTone(210, 0.22, 0.048, 'sine');
  }, 1110);

  setTimeout(() => {
    playTone(175, 0.24, 0.045, 'triangle');
  }, 1280);

  setTimeout(() => {
    playTone(145, 0.27, 0.042, 'sine');
  }, 1460);

  setTimeout(() => {
    playTone(110, 0.32, 0.038, 'triangle');
  }, 1650);
}

