const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 2,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.79,    // confidence threshold for predictions.
  }

navigator.getUserMedia = 
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

// select everything in html
const video = document.querySelector('#video');
const audio = document.querySelector('#audio');
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
let model;

handTrack.startVideo(video).then(status=> {
    if (status) {
        navigator.getUserMedia({video: {}}, stream => {
            video.srcObject = stream;
            // setInterval(runDectection, 1000);
            runDectection();
        },
        err => console.log(err));
    }
})

function runDectection() {
    model.detect(video).then(predictions => {
        // console.log(predictions);
        // model.renderPredictions(predictions, canvas, context, video);
        if (predictions.length != 0) {
            let hand1 = predictions[0].bbox;
            let x = hand1[0];
            let y = hand1[1];
            console.log('X: ' + x.toString());
            console.log('Y: ' + y.toString());

            if (y > 300) {
                if (x < 200) {
                    audio.src = '/apps/airdrum/Ba-Bum-Tss-Joke-Drum-A4.mp3';
                } else if (x > 400) {
                    audio.src = '/apps/airdrum/Bass-Drum-Hit-Level-6c.mp3';
                }
            } else if (y > 100) {
                audio.src = '/apps/airdrum/Bass-Drum-Hit-Level-6c.mp3';
            }

            audio.play();
        }
        requestAnimationFrame(runDectection);
    });
}

handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
})