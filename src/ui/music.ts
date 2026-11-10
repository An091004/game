/** Web Audio chỉ khởi động từ thao tác người chơi; không phát khi ở nền. */
export function createMusic(
  enabled: () => boolean,
  active: () => boolean,
  failed: () => void,
) {
  let ctx: AudioContext | null = null;
  let timer: ReturnType<typeof setInterval> | undefined;
  function bell(audio: AudioContext, destination: AudioNode) {
    const now = audio.currentTime;
    [1, 2.01, 3.95].forEach((harmonic, i) => {
      const osc = audio.createOscillator(),
        gain = audio.createGain();
      osc.frequency.setValueAtTime(440 * harmonic, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(
        [0.044, 0.018, 0.006][i],
        now + 0.05,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, now + [3.5, 2.3, 1.3][i]);
      osc.connect(gain).connect(destination);
      osc.start(now);
      osc.stop(now + 3.7);
    });
  }
  function stop() {
    clearInterval(timer);
    const old = ctx;
    ctx = null;
    void old?.close().catch(() => {});
  }
  async function start() {
    if (ctx || !enabled() || !active()) return;
    let audio: AudioContext | null = null;
    try {
      audio = new AudioContext();
      ctx = audio;
      await audio.resume();
      if (ctx !== audio || !enabled() || !active()) return;
      const master = audio.createGain();
      master.gain.value = 0.35;
      master.connect(audio.destination);
      const buffer = audio.createBuffer(
        1,
        audio.sampleRate * 3,
        audio.sampleRate,
      );
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++)
        data[i] = (Math.random() * 2 - 1) * 0.17;
      const wind = audio.createBufferSource(),
        filter = audio.createBiquadFilter(),
        gain = audio.createGain();
      wind.buffer = buffer;
      wind.loop = true;
      filter.type = "lowpass";
      filter.frequency.value = 220;
      gain.gain.value = 0.18;
      wind.connect(filter).connect(gain).connect(master);
      wind.start();
      const lfo = audio.createOscillator(),
        lfoGain = audio.createGain();
      lfo.frequency.value = 0.07;
      lfoGain.gain.value = 0.065;
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();
      bell(audio, master);
      const running = audio;
      timer = setInterval(() => {
        if (running.state === "running") bell(running, master);
      }, 17000);
    } catch {
      if (ctx === audio) {
        stop();
        failed();
      }
    }
  }
  return { start, stop };
}
