// DEBUG settings.
let DEBUG_MODE = true;
let FORCE_EMOTION;
let FAST_EMOTION = false;

// UI Elements.
let canvas;
let mainOKButton;

// Phone setting management.
let soundEnabled = true;
let wakeLock;
let mic;
let recorder;
let soundFile;
let soundTimeout;
let loudEnough = false;
let SOUND_TIME = 1000;

// Welford Sample Averaging
let previousMean = 0;
let sampleCount = 0;

// "Screens" are simple functions that set up and paint UI screens.
// Calling `currentScreen()` will set up the latest screen.
// TODO: We could use a stack of these to get back/next screen navigation.
let currentScreen;

// Which setup screens are complete?
let sayNameSetupComplete = false;
let maxSoundSetupComplete = false;
let maxBrightnessSetupComplete = false;
let disableSleepSetupComplete = false;
let qrSetupComplete = true;

// Is all setup complete?
let setupComplete = false;

function setup() {
  DEBUG_MODE && showDebug();
  
  // Full screen on phones and laptops (can't use `fullscreen()`, so do it oldsk00l):
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  // lockGestures();

  // Not done setup yet...
  setupComplete = false;

  // Early init of support for the sound recording...
  soundFile = new p5.SoundFile();
  mic = new p5.AudioIn();
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  // Style the button. The "mousePressed" action on the button changes per-screen.
  mainOKButton = createButton("OK");
  mainOKButton.style('border-radius', '10px');
  mainOKButton.style('font-size', '22px'); 
  mainOKButton.style('padding', '20px'); 

  sizeMainOKButton();

  // Phone setup.
  angleMode(DEGREES);
  enableGyroTap('Tap to start');

  window.mouseReleased = function() {
    if (!soundEnabled) {
      userStartAudio();
      DEBUG_MODE && print("user sound initialized");
      mic.start();
      soundEnabled = true;
      recordArmed = true;
    }
  };
  
  // Start with QR.
  currentScreen = disableSleep;

  // If we're debugging the emotions, skip setup.
  // if (DEBUG_MODE && FORCE_EMOTION) {
  //   currentScreen = mainGame;
  // }

  // Paint the current screen and kick off the onboarding flow.
  currentScreen();
}

/*
***********************************
*********** GAME CONFIG ***********
***********************************
*/

let delayTimeout;``
function delayTimer() {
  delayTimeout = setTimeout(mainGameName, SOUND_TIME * (1 + random()));
}

function mainGameName() {
  clearTimeout(delayTimeout);
  soundFile.onended(delayTimer);
  let ROTATION_TRUE_OR_ACCELERATION_FALSE = true;
  // let modulation = ROTATION_TRUE_OR_ACCELERATION_FALSE ?
  //   rotationY:
  //   accelerationY;
  let modulation = currentEmotion.speak();
  // let backwards = random() < 0.5;
  // let playBackRate = random(0.5, 1.5);
  let playBackRate = 1.0 + modulation;
  // if (backwards) playBackRate *= -1;
  // print(playBackRate);
  soundFile.rate(playBackRate);
  soundFile.setVolume(100);
  soundFile.play();
}

function mainGame() {
  DEBUG_MODE && print("mainGame");

  // Are we there yet? Sanity check.
  setupComplete = sayNameSetupComplete &&
      maxSoundSetupComplete &&
      maxBrightnessSetupComplete &&
      disableSleepSetupComplete &&
      qrSetupComplete;

  if (setupComplete && DEBUG_MODE) {
    print("Setup complete.");
  }

  // No OK button during gameplay.
  mainOKButton && mainOKButton.remove();
  mainOKButton = null;

  // Pick an emotion and kick off the cycle.
  pickEmotion();

  // Play name with modulation.
  mainGameName();
}

/*
***********************************
***** PAINTING WITH EMOTIONS ******
***********************************
*/

// Emotion picker.
let happy = new Happy();
let sad = new Sad();
let angry = new Angry();
let scary = new Scary();

let emotions = [
  new Happy(),
  new Sad(),
  new Angry(),
  new Scary(),
  new Happy(),
  new Sad(),
  new Angry(),
  new Scary()
];

// FORCE_EMOTION = emotions[0];

// let currEmo = random(Emotions);
// currEmo.draw();

// let emotions = [drawHappy, drawSad, drawAngry, drawScary];
let currentEmotion = FORCE_EMOTION;

// How fast do we cycle emotions?
let EMOTION_TIMER = FAST_EMOTION ? 500 : 20000;
let currentEmotionTimeout;

// Every EMOTION_TIMER ms, rotate emotions.
function pickEmotion() {
  DEBUG_MODE && print("pickEmotion");
  // if (DEBUG_MODE && FORCE_EMOTION) {
  //   currentEmotion = random(emotions);//FORCE_EMOTION;
  // } else {
    randomSeed(millis());
    currentEmotion = random(emotions);
  // }

  print(currentEmotion.constructor.name);

  // Kill the previous emotion timeout, which otherwise keeps firing.
  clearTimeout(currentEmotionTimeout);

  // Set a new timeout to call us again in EMOTION_TIMER ms.
  currentEmotionTimeout = setTimeout(pickEmotion, EMOTION_TIMER);
}

// function drawHappy() {
//   background(0);
//   DEBUG_MODE && print("drawHappy");
//   happy && happy.drawHappy();
// }

// function drawSad() {
//   background(100);
//   DEBUG_MODE && print("drawSad");
//   sad && sad.drawSad();
// }

// function drawAngry() {
//   background(175);
//   DEBUG_MODE && print("drawAngry");
//   angry && angry.drawAngry();
// }

// function drawScary() {
//   background(255);
//   DEBUG_MODE && print("drawScary");
//   scary && scary.drawScary();
// }

/*
***********************************
********** SAY YOUR NAME **********
***********************************
*/

// They've tapped "OK" on the "Say Your Name" screen.
function sayNameOKTap() {
  DEBUG_MODE && print("sayNameOKTap");
  clearTimeout(soundTimeout);
  // soundFile.onended = undefined;
  sayNameSetupComplete = true;
  currentScreen = mainGame;
  currentScreen();
}

let newMainButton = false;

// function sayNameDonePlay() {
//   DEBUG_MODE && print("done play");
//   clearTimeout(soundTimeout);
//   soundTimeout = setTimeout(playMyName, SOUND_TIME);
//   // recorder.record(soundFile, 1, playMyName);
//   // sayNameSetupComplete = true;
//   recordArmed = true;
//   // currentScreen = mainGame;
//   // currentScreen();
//   if (!newMainButton) {
//     mainOKButton = createButton("Start!\n(or keep recording)");
//     mainOKButton.style('border-radius', '10px');
//     mainOKButton.style('font-size', '22px');
//     mainOKButton.style('padding', '20px');
//     mainOKButton.mousePressed(sayNameOKTap);
//     sizeMainOKButton();
//     newMainButton = true;
//   }
// }

function playMyName() {
  DEBUG_MODE && print("playMyName");
  clearTimeout(soundTimeout);
  // if (mic && mic.enabled && recorder && soundFile) {
    // DEBUG_MODE && print("stop and go");
    // recorder.stop();
    soundFile.onended(sayNameOKTap);
    soundFile.play();
  // }
}

// Show the "Say Your Name" screen.
function sayName() {
  if (!sayNameSetupComplete) {
    DEBUG_MODE && print("sayName");

    soundEnabled = false;

    showText("You actin' kinda shady...\n(Say my name, say my name...)");
    // mainOKButton.html("Why the sudden change?");
    mainOKButton.remove();
    mainOKButton = null;
    
    // sayNameSetupComplete = true;
  }  
}

/*
***********************************
**********   MAX  NOISE  **********
***********************************
*/

// They've tapped "OK" on the "Maximize Volume" screen.
function maxSoundOKTap() {
  DEBUG_MODE && print("maxSoundOKTap");

  outputVolume(100);
  
  currentScreen = sayName;
  currentScreen();
}

// Show the "Maximize Volume" screen.
function maxSound() {
  if (!maxSoundSetupComplete) {
    DEBUG_MODE && print("maxSound");
    mainOKButton.mousePressed(maxSoundOKTap);

    showText("But... these go to 11.")
    mainOKButton.html("Does that mean it's louder?");
    sizeMainOKButton();
    
    maxSoundSetupComplete = true;
  }  
}

/*
***********************************
**********  VERY BRIGHT  **********
***********************************
*/

// They've tapped "OK" on the "Maximize Brightness" screen.
function maxBrightnessOKTap() {
  DEBUG_MODE && print("maxBrightnessOKTap");
  currentScreen = maxSound;
  currentScreen();
}

// Show the "Maximize Brightness" screen.
function maxBrightness() {
  if (!maxBrightnessSetupComplete) {
    DEBUG_MODE && print("maxBrightness");
    mainOKButton.mousePressed(maxBrightnessOKTap);

    showText("Were it not for shadows,\nthere would be no beauty.\n\n影がなければ、\n美も存在しないだろう。");
    mainOKButton.html("Brightness to maximum!");
    sizeMainOKButton();

    maxBrightnessSetupComplete = true;
  }  
}

/*
***********************************
**********   NO   SLEEP  **********
***********************************
*/

// They've tapped "OK" on the "Disable Sleep" screen.
async function disableSleepOKTap() {
  DEBUG_MODE && print("disableSleepOKTap");
  let screenOn = await keepScreenOn();
  DEBUG_MODE && screenOn && print("locked on!");

  // try {
  //   wakeLock = await navigator.wakeLock.request();
  // } catch (e) {
  //   DEBUG_MODE && print("disableSleep failed: oh well, we tried.");
  // }

  currentScreen = maxBrightness;
  currentScreen();
}

function disableSleep() {
  if (!disableSleepSetupComplete) {
    DEBUG_MODE && print("disableSleep");
    mainOKButton.mousePressed(disableSleepOKTap);
    
    showText("No rest for the wicked.")
    mainOKButton.html("I will stay awake.");
    sizeMainOKButton();

    disableSleepSetupComplete = true;
  }
}

/*
***********************************
**********   QR   CODE   **********
***********************************
*/

// They've tapped "OK" on the "QR" screen.
async function qrOKTap() {
  DEBUG_MODE && print("disableSleepOKTap");
  currentScreen = disableSleep;
  currentScreen();
}

// function showQR() {
//   if (!qrSetupComplete) {
//     DEBUG_MODE && print("showQR");
//     mainOKButton.mousePressed(qrOKTap);
//     qrSetupComplete = true;
//   }  
// }

/*
***********************************
********* { MAIN . DRAW } *********
***********************************
*/

let recordArmed = false;

function draw() {
  // If currentEmotion is a valid function, call it.
  currentEmotion && currentEmotion.draw();

  if (soundEnabled && !sayNameSetupComplete) {
    if (mic && mic.enabled) {
      let micVolume = mic.getLevel();
      
      sampleCount++;
      // Overflow guard: skip this sample.
      if (sampleCount > 0) {
        // Update Welford mean. 
        previousMean = previousMean + (micVolume - previousMean) / sampleCount;
        // if (sampleCount % 120 == 0) print(volume / previousMean);
      }

      // Start recording if the audio peaks to 5x the Welford mean background.
      // (5x is arbitrary, but established through testing.)
      if (recordArmed && (micVolume / previousMean > 5)) {
        DEBUG_MODE && print(`Record fired: ${micVolume}, ${previousMean}, ${micVolume / previousMean}`)
        recorder.record(soundFile, 1, playMyName);
        // Force mean to the recorded volume level.
        previousMean = micVolume;
        sampleCount = 1;
        recordArmed = false;
      }
    }
  } 
}

/*
***********************************
**********    UI UTILS   **********
***********************************
*/

function showText(msg) {
  if (typeof msg !== 'string')
  {
    DEBUG_MODE && print("showText must be passed a string!");
    return false;
  }

  let halfWidth = width / 2;
  let halfHeight = height / 2;

  let boxWidth = width * 0.9;
  let boxHeight = height * 0.9;
  let cornerRadius = 15;

  // UI Colour.
  // Dark end of the range, but RARELY perfect black.
  let boxR = 127 - random(128);
  let boxG = 127 - random(128);
  let boxB = 127 - random(128);
  fill(boxR, boxG, boxB);

  // Backing box
  let leftX = (width - boxWidth) / 2;
  let topY = (height - boxHeight) / 2;
  rect(leftX, topY, boxWidth, boxHeight, cornerRadius);
  
  textAlign(CENTER, CENTER);
  textSize(24);

  // Text colour.
  // fill(255, 255, 255);
  // Light end of the range, related to background colour, and RARELY perfect white.
  fill(255 - random(boxR), 255 - random(boxG), 255 - random(boxB));
  text(msg, halfWidth, halfHeight);
  
  return true;
}

function sizeMainOKButton() {
  if (!mainOKButton) return;
  let buttonWidth = windowWidth / 4;
  let buttonHeight = windowHeight / 8;
  
  mainOKButton.size(AUTO, AUTO);
  // mainOKButton.center();
  // mainOKButton.size(buttonWidth, buttonHeight);
  mainOKButton.position((windowWidth / 2) - (buttonWidth/2), (windowHeight * 0.8) - (buttonHeight / 2));
  mainOKButton.center('horizontal');
}

// Reposition the button if the phone rotates or the screen is otherwise resized.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sizeMainOKButton();
}
