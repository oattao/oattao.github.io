async function delay(delayInms) {
    return new Promise(resolve  => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

async function get_facemesh(){
    var model = await facemesh.load(maxFaces=1);

    // load HTML canvas

    // process input stream frame by frame
    while(true){

        // fill canvas with black background
        draw.fillStyle = "black";
        draw.fillRect(0, 0, canvas.width, canvas.height);

        // detect faces
        faces = await model.estimateFaces(video);

        if(faces.length != 0){
            // loop through faces array to capture multiple faces
            mesh = faces[0].scaledMesh;
            // mesh = faces[0].mesh;

            /* highlight facial landmark points on canvas board */
            draw.fillStyle = "#00FF00";

            for(i=0; i< mesh.length; i++){
                var [x, y, z] = mesh[i];
                draw.fillRect(Math.round(x), Math.round(y), 4, 4);
            }
        } else {
            console.log(`no faces detected..`);
        }
        let delayres = await delay(100);

        // loop to process the next frame
        await tf.nextFrame();
    }
}

async function init(){
    // capture live video stream from web camera
    if(navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({video: true})
        .then(function (stream) {video.srcObject = stream; });
    }
    // model = await facemesh.load(maxFaces=1);
}

function main(){
    if(video.readyState == 4){
        console.log("video is ready for processing..");
        get_facemesh();
    } else {
        console.log("nope, not loaded yet..");
        setTimeout(main, 1000/30);
    }
}

var video = document.getElementById("movie");
// var model;
var canvas = document.getElementById("facemesh");
var draw = canvas.getContext("2d");
var faces;
var mesh;

init();
main();