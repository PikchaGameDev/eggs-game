import { sound } from "@pixi/sound";
import miniWinUrl from "../../assets/audio/miniWin.mp3?inline";
import musicUrl from "../../assets/audio/music.mp3?inline";
import rollBackUrl from "../../assets/audio/rollBack.mp3?inline";
import tapUrl from "../../assets/audio/tap.mp3?inline";
import wrongUrl from "../../assets/audio/wrong.mp3?inline";

const soundUrls = {
  miniWin: miniWinUrl,
  music: musicUrl,
  rollBack: rollBackUrl,
  tap: tapUrl,
  wrong: wrongUrl,
};

class SoundService {
  constructor() {
    Object.entries(soundUrls).forEach(([soundName, url]) => {
      sound.add(soundName, url);
    });
  }

  play(alias, volume = 0.4, isLoop = false) {
    return sound.play(alias, { volume: volume, loop: isLoop });
  }

  stop(alias) {
    sound.stop(alias);
  }
}

export const soundService = new SoundService();
