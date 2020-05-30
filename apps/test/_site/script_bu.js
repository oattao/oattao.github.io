async function get_facemesh()
    {

        // load HTML canvas
        var canvas = document.getElementById("facemesh");
        var draw = canvas.getContext("2d");

        // get video stream
        const stream = document.getElementById("movie");

        // load facemesh model
        const model = await facemesh.load(maxFaces=1);

        // process input stream frame by frame
        while(1)
        {

            // fill canvas with black background
            draw.fillStyle = "black";
            draw.fillRect(0, 0, canvas.width, canvas.height);

            // detect faces
            const faces = await model.estimateFaces(stream);

            if(faces.length != 0)
            {
                // loop through faces array to capture multiple faces
                var mesh = faces[0].scaledMesh;

                /* highlight facial landmark points on canvas board */
                draw.fillStyle = "#00FF00";

                for(i=0; i< mesh.length; i++)
                {
                    var [x, y, z] = mesh[i];
                    draw.fillRect(Math.round(x), Math.round(y), 3, 3);
                }
                break;
            }
            else
            {
                console.log(`no faces detected..`);
            }

            // loop to process the next frame
            // await tf.nextFrame();
        }
    }

function startVideo() {
    // capture live video stream from web camera
    var video = document.getElementById("movie");
    if(navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({video: true})
            .then(function (stream) {video.srcObject = stream; });
    }
}

function main(){
// check if the video is loaded and ready for processing
    var video = document.getElementById("movie");
    if(video.readyState == 4){
        console.log("video is ready for processing..");
        get_facemesh();
    }
    else {
        console.log("nope, not loaded yet..");
        setTimeout(main, 1000/30);
    }
}    

function run(){
    startVideo();
    main()
}

document.addEventListener('DOMContentLoaded', startVideo);
var video = document.getElementById("movie");
if (video) {
    video.addEventListener("play", get_facemesh, false);    
}


