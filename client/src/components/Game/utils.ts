const audio_knock = [new Audio('audio_knock1.mp3'), new Audio('audio_knock2.mp3'), new Audio('audio_knock3.mp3')]; //in dev
// audio_knock[0].load();
let knockNumber = 0;
export const playKnock = () => {
  // audio_knock[knockNumber % 3].play();
  knockNumber++;
}