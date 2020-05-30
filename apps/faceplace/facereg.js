const imageUpload = document.getElementById('imageUpload');

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/apps/faceplace/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/apps/faceplace/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/apps/faceplace/models')
]).then(start);

async function start() {
    const container = document.createElement('div');
    container.style.position = 'relative';
    document.body.append(container);
    const labeledFaceDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    let image
    let canvas
    imageUpload.addEventListener('change', async () => {
        if (image) image.remove()
        if (canvas) canvas.remove()
        image = await faceapi.bufferToImage(imageUpload.files[0]);
        container.append(image);
        canvas = faceapi.createCanvasFromMedia(image);
        container.append(canvas);
        const displaySize = {width: image.width, height: image.height}
        faceapi.matchDimensions(canvas, displaySize);
        const detections = await faceapi.detectAllFaces(image)
        .withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d
            .descriptor));
        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {label: result.toString()});
            drawBox.draw(canvas);
        })
    })
}
         
function loadLabeledImages() {
    const labels = ['Rose', 'Jisoo', 'Jenie', 'Lisa']
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i=1; i<2; i++) {
                const img = await faceapi.fetchImage(`/apps/faceplace/labeled_images/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor) 
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}