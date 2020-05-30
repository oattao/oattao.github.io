const imageUpload = document.getElementById('imageUpload');

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/apps/faceplace/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/apps/faceplace/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/apps/faceplace/models')
]).then(start);

function start() {
    const container = document.createElement('div');
    container.style.position = 'relative';
    document.body.append(container);
    imageUpload.addEventListener('change', async () => {
        const image = await faceapi.bufferToImage(imageUpload.files[0]);
        container.append(image);
        const canvas = faceapi.createCanvasFromMedia(image);
        container.append(canvas);
        const displaySize = {width: image.width, height: image.height}
        faceapi.matchDimensions(canvas, displaySize);
        const detections = await faceapi.detectAllFaces(image)
        .withFaceLandmarks().withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        resizedDetections.forEach(detection => {
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {label: 'Face'});
            drawBox.draw(canvas);
        })
    })
}

// fuction loadLabeledImages() {
//     const labels = ['Rose', 'Jisoo', 'Jenie', 'Lisa'];
//     return Promise.all(
//         labels.map(async label => {
//             for (let i=1; i<2; i++) {
//                 const img = await faceapi.fetchImage('https://github.com')
            
//         }))
// }