// speechSynthesis
const tts = window.speechSynthesis;

// elements
const listenBtn = document.getElementById("listen-button");
const textArea = document.getElementById("text");
const removeSettCh = document.getElementById("remove-sett");
const voiceList = document.getElementById("voice-list");
const ttsBtn = document.getElementById("tts-button");

// webkitSpeechRecognition
const recognition = new webkitSpeechRecognition();
recognition.lang = "tr";
recognition.onresult = record;
recognition.onerror = recordEnd;
recognition.onend = recordEnd;

//events
listenBtn.addEventListener('click', () => {
  recognition.start();
  listenBtn.classList.remove('btn-primary');
  listenBtn.classList.add('btn-danger');
  listenBtn.setAttribute("disabled", "disabled");
  listenBtn.innerHTML = "Listening... <i class=\"fas fa-microphone-alt\"></i>";

  if (voiceList.options.length === 0) {
    let interval;
    return new Promise((resolve, reject) => {
      interval = setInterval(() => {
        if (tts.getVoices().length > 0) {
          resolve(tts.getVoices());
          clearInterval(interval);
        }
      }, 10);
    }).then(voices => {
      voices.forEach(v => {
        let option = document.createElement('option');
        option.text = option.value = v.name;
        option.setAttribute('data-id', v.lang);
        voiceList.appendChild(option);
      })
    }).catch((e) => {
      alert(e);
    });
  }
});

ttsBtn.addEventListener("click", () => {
  let text = textArea.value;
  if (text !== "" && text !== null && text.trim() !== "" && voiceList.options.length !== 0) {
    let selectedVoice = voiceList.value;
    let speak = new SpeechSynthesisUtterance(text);
    speak.SpeechSynthesisVoice = selectedVoice;
    speak.lang = voiceList.selectedOptions[0].getAttribute("data-id")
    tts.speak(speak);
  } else {
    alert('Error!');
  }
});

// functions
function record(e) {
  recordEnd();
  if (removeSettCh.checked) {
    textArea.value = '';
  }
  textArea.value = textArea.value + " " + e.results[0][0].transcript;
}

function recordEnd() {
  listenBtn.innerHTML = "Listen to me <i class=\"fas fa-microphone-alt\"></i>";
  listenBtn.classList.add('btn-success');
  listenBtn.classList.remove('btn-danger');
  listenBtn.removeAttribute("disabled");
}