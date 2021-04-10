import knock1 from '../../static/audio/knock/audio_knock1.mp3';
import knock2 from '../../static/audio/knock/audio_knock2.mp3';
import knock3 from '../../static/audio/knock/audio_knock3.mp3';

const audio_knock = [new Audio(knock1), new Audio(knock2), new Audio(knock3)];
let knockNumber = 0;
export const playKnock = () => {
  audio_knock[knockNumber % 3].play();
  knockNumber++;
}