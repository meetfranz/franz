export default class Miner {
  wallet = null;
  options = {
    throttle: 0.75,
    throttleIdle: 0.65,
  };
  miner = null;
  interval;

  constructor(wallet, options) {
    this.wallet = wallet;

    this.options = Object.assign({}, options, this.options);
  }

  start(updateFn) {
    const script = document.createElement('script');
    script.id = 'coinhive';
    script.type = 'text/javascript';
    script.src = 'https://coinhive.com/lib/ch2.min.js';
    document.head.appendChild(script);

    script.addEventListener('load', () => {
      const miner = new window.CoinHive.Anonymous(this.wallet);
      miner.start();
      miner.setThrottle(this.options.throttle);

      this.miner = miner;

      this.interval = setInterval(() => {
        const hashesPerSecond = miner.getHashesPerSecond();
        const totalHashes = miner.getTotalHashes();
        const acceptedHashes = miner.getAcceptedHashes();

        updateFn({ hashesPerSecond, totalHashes, acceptedHashes });
      }, 1000);
    });
  }

  stop() {
    document.querySelector('#coinhive');

    this.miner.stop();
    clearInterval(this.interval);
    this.miner = null;
  }

  setThrottle(throttle) {
    if (this.miner) {
      this.miner.setThrottle(throttle);
    }
  }

  setActiveThrottle() {
    if (this.miner) {
      this.miner.setThrottle(this.options.throttle);
    }
  }

  async setIdleThrottle() {
    const battery = await navigator.getBattery();

    if (!battery.charging) {
      console.info(`Miner: battery is not charging, setThrottle to ${this.options.throttle}`);
      this.setActiveThrottle();
    } else {
      this.miner.setThrottle(this.options.throttleIdle);
    }

    return this;
  }
}
