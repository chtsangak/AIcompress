//option1 style
const radioButtons = document.getElementsByName('compression-type');
const labels = document.getElementsByClassName('radio-button');

for (let i = 0; i < radioButtons.length; i++) {
  if (radioButtons[i].checked) {
    const label = radioButtons[i].parentNode;
    label.classList.add('selected');
    break;
  }
}

for (let i = 0; i < radioButtons.length; i++) {
  radioButtons[i].addEventListener('click', function() {
    for (let j = 0; j < labels.length; j++) {
      labels[j].classList.remove('selected');
    }

    if (this.checked) {
      const label = this.parentNode;
      label.classList.add('selected');
    }
  });
}

/*
function showSecondOption() {
    var secondOption = document.querySelector('.second-option');
    secondOption.style.display = 'block';
}

function hideSecondOption() {
    var secondOption = document.querySelector('.second-option');
    secondOption.style.display = 'none';

    var compressionTypeRadios = document.getElementsByName('compression');
    for (var i = 0; i < compressionTypeRadios.length; i++) {
        compressionTypeRadios[i].checked = false;
    } 
}
*/

//Upload reagion style
const uploadRegion = document.querySelector('.upload-region');

uploadRegion.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadRegion.classList.add('dragover');
});

uploadRegion.addEventListener('dragleave', () => {
    uploadRegion.classList.remove('dragover');
});

uploadRegion.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadRegion.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files);
});

const fileUpload = document.getElementById('file-upload');
fileUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFiles(files);
});


function handleFiles(files) {

    //setting check
    const firstOption = document.querySelector('.first-option input[name="compression-type"]:checked');
    /*
    const secondOption = document.querySelector('.second-option input[name="compression"]:checked');

    if (!firstOption) {
        alert('Upload failed, please select lossless/lossy');
        return;
    }

    if (firstOption.value === 'compress' && !secondOption) {
        alert('Upload failed, please select compress/decompress');
        return;
    }
*/
    const file = files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop();

    if (fileExtension !== 'jpg' ) {
        alert('Upload failed, only support jpg file');
        return;
    }

    // Uploading
    uploadRegion.classList.add('uploading');
    uploadRegion.querySelector('.waiting').style.display = 'none';
    uploadRegion.querySelector('.uploading').style.display = 'block';
    console.log("uploading")

    const formData = new FormData();
    formData.append('file', file);
    formData.append('option1', firstOption.value);
    //formData.append('option2', secondOption.value);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        uploadRegion.classList.remove('uploading');
        uploadRegion.classList.add('processing');
        uploadRegion.querySelector('.uploading').style.display = 'none';
        uploadRegion.querySelector('.processing').style.display = 'block';
        console.log("processing")
        return response.blob()
    })
    .then(blob => {
        uploadRegion.classList.remove('processing');
        uploadRegion.classList.add('success');
        uploadRegion.querySelector('.processing').style.display = 'none';
        uploadRegion.querySelector('.success').style.display = 'block';
        console.log("success")

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'processed_image.jpg';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("downloading");
    })
    .catch(error => {
        uploadRegion.classList.remove('processing');
        uploadRegion.classList.add('failure');
        uploadRegion.querySelector('.processing').style.display = 'none';
        uploadRegion.querySelector('.failure').style.display = 'block';
        console.error(error);
    });
}

const tryAgain = document.getElementById('try-again');
tryAgain.addEventListener('click', (e) => {
    e.preventDefault();
    uploadRegion.classList.remove('success');
    uploadRegion.querySelector('.success').style.display = 'none';
    uploadRegion.querySelector('.failure').style.display = 'none';
    uploadRegion.querySelector('.waiting').style.display = 'block';
  });
