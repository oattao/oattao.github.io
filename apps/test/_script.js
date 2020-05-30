function loadCamera() {
    var video = document.getElementById("videoElement");

    if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.log("Something went wrong!");
    });
    }
}

function snapImage() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var video = document.getElementById("videoElement");
    context.drawImage(video, 0, 0, 500, 375);
}

function showAlert() {
    alert("Your over me.");
}

document.addEventListener('DOMContentLoaded', loadCamera);
var btnSnap = document.getElementById("snap");
btnSnap.addEventListener('click', snapImage);

var canvas = document.getElementById("canvas");
canvas.addEventListener('mouseover', showAler);

