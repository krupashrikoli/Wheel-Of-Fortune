let audioContext: AudioContext | null = null;
let roundWinAudio: HTMLAudioElement | null = null;

const ROUND_WIN_SOUND = "/sounds/orchestral-win.mp3";

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15
) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  oscillator.stop(ctx.currentTime + duration);
}

export async function playRoundWin() {
  if (typeof window === "undefined") return;

  const ctx = getAudioContext();
  if (ctx?.state === "suspended") await ctx.resume();

  if (!roundWinAudio) {
    roundWinAudio = new Audio(ROUND_WIN_SOUND);
    roundWinAudio.volume = 0.75;
  }

  roundWinAudio.currentTime = 0;
  try {
    await roundWinAudio.play();
  } catch {
    // Playback can be blocked until the user interacts with the page.
  }
}

export function stopRoundWin() {
  if (!roundWinAudio) return;
  roundWinAudio.pause();
  roundWinAudio.currentTime = 0;
}

export async function playHappyChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") await ctx.resume();

  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.35, "triangle", 0.12), i * 120);
  });
}

export async function playWrongHorn() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") await ctx.resume();

  const now = ctx.currentTime;

  const playBlare = (
    frequency: number,
    start: number,
    duration: number,
    volume: number
  ) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(frequency, now + start);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 0.75,
      now + start + duration
    );

    gain.gain.setValueAtTime(volume, now + start);
    gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now + start);
    oscillator.stop(now + start + duration);
  };

  playBlare(311, 0, 0.22, 0.16);
  playBlare(233, 0.16, 0.28, 0.18);
  playBlare(185, 0.36, 0.45, 0.14);
}

/** @deprecated use playWrongHorn */
export async function playSadTrumpet() {
  return playWrongHorn();
}

export async function playSpinTick(speed = 1) {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") await ctx.resume();
  const pitch = 620 + speed * 260;
  playTone(pitch, 0.04 + speed * 0.02, "square", 0.03 + speed * 0.02);
}

export async function playWheelLand() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") await ctx.resume();

  playTone(180, 0.18, "sine", 0.22);
  setTimeout(() => playTone(90, 0.35, "triangle", 0.18), 40);
  setTimeout(() => playTone(520, 0.12, "sine", 0.1), 120);
}
