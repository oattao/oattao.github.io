var video;
var model;
var canvas;
var draw;
var faces;

function runLoop() {
    init();
    loop();
}

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

async function getMesh(){
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
}

// async function loop(){
//     // draw.fillStyle = "black";
//     // draw.fillRect(0, 0, canvas.width, canvas.height);
//     while(true) {
//         video = document.getElementById("movie");
//         draw.fillStyle = "black";
//         draw.fillRect(0, 0, canvas.width, canvas.height);
//         faces = await model.estimateFaces(video);

//         if(faces.length != 0){
//             // loop through faces array to capture multiple faces
//             var mesh = faces[0].scaledMesh;

//             /* highlight facial landmark points on canvas board */
//             draw.fillStyle = "#00FF00";

//             for(i=0; i< mesh.length; i++){
//                 var [x, y, z] = mesh[i];
//                 draw.fillRect(Math.round(x), Math.round(y), 3, 3);
//             }

//         } else {
//             console.log('No face detected.');
//         }
//         await tf.nextFrame();
//     }
// }

