// live_translation/translator/static/js/audio.js

let recorder;
let audioContext;
let gumStream;
let audioElement = document.querySelector("audio");

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
    console.log("getUserMedia() success, stream created, initializing Recorder...");

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gumStream = stream;
    const input = audioContext.createMediaStreamSource(stream);
    recorder = new Recorder(input, { numChannels: 1 });

    console.log("Recorder initialized successfully");
  }).catch(function(err) {
    console.error("getUserMedia() failed: ", err);
  });

function startRecording() {
    console.log("startRecording() called");

    if (recorder) {
        // Clear the previous audio and translated text
        document.getElementById("translatedText").textContent = "";
        if (audioElement) {
            audioElement.src = "";
            audioElement.hidden = true;
        }

        recorder.clear();
        recorder.record();
        document.getElementById("status").textContent = "Recording...";
        document.querySelector("button[onclick='stopRecording()']").disabled = false;
        document.querySelector("button[onclick='startRecording()']").disabled = true;
        console.log("Recording started");
    } else {
        console.error("Recorder not initialized");
    }
}

function stopRecording() {
    console.log("stopRecording() called");

    if (recorder) {
        recorder.stop();
        document.getElementById("status").textContent = "Sending...";
        console.log("Recording stopped");

        recorder.exportWAV(async function(blob) {
            console.log("exportWAV() called, blob created:", blob);

            const formData = new FormData();
            formData.append('audio_data', blob);

            const response = await fetch('/translator/translate_audio/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': csrftoken
                },
            });

            const result = await response.json();
            document.getElementById("status").textContent = "Idle";
            document.getElementById("translatedText").textContent = result.text || "Error: " + result.error;
            console.log("Translation result: ", result);

            // Play the recorded audio
            const audioUrl = URL.createObjectURL(blob);
            audioElement.src = audioUrl;
            audioElement.hidden = false;

            // Reset buttons
            document.querySelector("button[onclick='stopRecording()']").disabled = true;
            document.querySelector("button[onclick='startRecording()']").disabled = false;

            // Fetch and display translation history
            fetchTranslationHistory();
        });
    } else {
        console.error("Recorder not initialized");
    }
}

async function fetchTranslationHistory() {
    const response = await fetch('/translator/translation_history/');
    const history = await response.json();
    const historyContainer = document.getElementById("translationHistory");
    historyContainer.innerHTML = history.map(item => `
        <div>
            <strong>Original:</strong> ${item.original_text}<br>
            <strong>Translated:</strong> ${item.translated_text}<br>
            <em>${new Date(item.timestamp).toLocaleString()}</em>
        </div>
        <hr>
    `).join('');
}
