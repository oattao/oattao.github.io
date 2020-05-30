var video;
var model;
var canvas;
var draw;
var faces;

async function init() {
    video = document.getElementById("movie");
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: true})
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
    }
    canvas = document.getElementById("facemesh");
    draw = canvas.getContext("2d");
    model = await facemesh.load(maxFaces=1);
    video.addEventListener('play', getMesh);
}

async function delay(delayInms) {
    return new Promise(resolve  => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
    });
}

async function getMesh(){
    while (true) {
        draw.fillStyle = "black";
        draw.fillRect(0, 0, canvas.width, canvas.height);

        // detect faces
        faces = await model.estimateFaces(video);

        if(faces.length != 0){
            // loop through faces array to capture multiple faces
            var mesh = faces[0].scaledMesh;

            /* highlight facial landmark points on canvas board */
            draw.fillStyle = "#00FF00";

            for(i=0; i< mesh.length; i++){
                var [x, y, z] = mesh[i];
                draw.fillRect(Math.round(x), Math.round(y), 3, 3);
            }

        } else {
            console.log('No face detected.');
            alert("No face detected.");
        }
        let delayers = await delay(45);
        await tf.nextFrame();
    }
}

function main(){
    video = document.getElementById("movie");
    if(video.readyState == 4){
        console.log("video is ready for processing..");
        getMesh();
    }
    else{
        console.log("nope, not loaded yet..");
        setTimeout(main, 1000/30);
    }
}

init();
main()
// getMesh();

