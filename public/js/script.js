const youBox = document.getElementById("you");
const aiBox = document.getElementById("bot");

document.getElementById("micButton").addEventListener("click", async () => {
  try {
    //converting speech to text
    let recognization = new webkitSpeechRecognition();
   
    recognization.onstart = () => {
      action.innerHTML = "Listening...";
    };
    var transcript;
    recognization.onresult = async (e) => {
      youBox.value = "";
      //alert("yes");
      transcript = e.results[0][0].transcript;
      typeNextWord(transcript, youBox, 0);
      action.innerHTML = "";
      //printing text to console
      console.log(transcript);

      //sending text to backend
      const data = await fetch("http://localhost:3000/ring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: transcript }),
      });

      //recieving answer from backend via GPT
      const { que, ans } = await data.json();
      aiBox.value = "";

      //calling function to convert text to speech
      speakBot(ans);
      typeNextWord(ans, aiBox, 0);
    };
    recognization.start();

    // const data = await fetch("http://localhost:3000/call");
    //const { que, ans } = await data.json();
  } catch (error) {
    console.log(error);
  }
});
//stop button
document.getElementById("stopBtn").addEventListener("click", () => {
  speakBot("cancelit");
  exitMe();
  aiBox.value = "";
});

//function to convert text to speech
function speakBot(ans) {
  let text = ans;
  let utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.voice = window.speechSynthesis.getVoices()[1];
  if (ans == "cancelit") {
    window.speechSynthesis.cancel();
  } else {
    window.speechSynthesis.speak(utterance);
  }
}

//typing in UI
function typeNextWord(sentence, ele, index) {
  const typeDelay = 50;
  const newLineDelay = 1000;
  if (index < sentence.length) {
    const word = sentence[index];
    ele.value += word;
    index++;
    setTimeout(function () {
      typeNextWord(sentence, ele, index);
    }, typeDelay);
  } else {
    setTimeout(() => {
      ele.value += "\n";
    }, newLineDelay);
  }
}

function exitMe() {
  return 0;
}
