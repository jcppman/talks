import { forEach } from "lodash";
class AudioEnv {
  constructor() {
    this.context = new AudioContext();
    this.nodes = {};
  }

  parameter() {
    const context = this.context;
    const osc = this.nodes.osc = context.createOscillator();
    const gain = this.nodes.gain = context.createGain();

    osc.frequency.value = 220;
    gain.gain.value = 0.3;

    osc.connect(gain);
    gain.connect(context.destination);

    return this.nodes;
  }

  timeWrongly() {
    const { osc, gain } = this.parameter();
    osc.start();
    this.timer = setInterval(() => {
      const value = gain.gain.value;
      if (value === 0.5) {
        gain.gain.value = gain.gain.value = 0.2;
      } else {
        gain.gain.value = 0.5;
      }
    }, 100);
  }

  timeCorrectly() {
    const { osc, gain } = this.parameter();
    osc.start();

    const now = this.context.currentTime;
    for (let i = 1; i <= 100; i++) {
      gain.gain.setValueAtTime(
        (i % 2 === 0) ? 0.2 : 0.5,
        now + i * 0.1
      );
    }
  }

  costy() {
    let i = 0;
    while (i < 10000) {
      console.log("garbage");
      i++;
    }
  }

  destroy() {
    forEach(this.nodes, (n) => n.disconnect());
    this.nodes = {};
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }

    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
    }
  }
}

window.env = new AudioEnv();
