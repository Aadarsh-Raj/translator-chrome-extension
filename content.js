const body = document.querySelector("body");
const container = document.createElement("div");
container.innerHTML = `<div>
<div id="closeButton" onClick="hideTranslatorContainer" style="width: min-content;
padding: 3px 6px;
font-weight:bolder;
position: absolute;
top: 6px;
right: 0px;
border-radius: 4.5px;"
><svg fill="red" height="25px" width="25px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
viewBox="0 0 415.188 415.188" xml:space="preserve">
<path d="M412.861,78.976c3.404-6.636,2.831-14.159-0.15-20.404c0.84-7.106-1.02-14.321-7.746-19.855
c-6.262-5.151-12.523-10.305-18.781-15.457c-11.005-9.055-28.237-11.913-38.941,0c-48.619,54.103-99.461,105.856-152.167,155.725
c-39.185-36.605-78.846-72.713-118.223-108.868c-13.82-12.693-33.824-8.71-42.519,6.411c-12.665,6.286-22.931,14.481-31.42,28.468
c-4.042,6.664-3.727,15.076,0,21.764c25.421,45.578,74.557,85.651,114.957,122.529c-5.406,4.839-10.772,9.724-16.287,14.461
c-54.43,46.742-91.144,76.399-23.029,124.325c0.919,0.647,1.856,0.504,2.789,0.882c1.305,0.602,2.557,1.026,4.004,1.264
c0.45,0.017,0.87,0.093,1.313,0.058c1.402,0.114,2.774,0.471,4.195,0.192c36.621-7.18,70.677-35.878,101.576-67.48
c30.1,29.669,62.151,58.013,97.395,74.831c8.391,4.005,18.395,1.671,24.855-3.931c10.832,0.818,20.708-5.913,25.665-15.586
c0.734-0.454,1.207-0.713,2.002-1.21c15.748-9.838,17.187-29.431,5.534-42.936c-26.313-30.492-54.284-59.478-82.798-87.95
C316.426,196.043,380.533,141.939,412.861,78.976z"/>
</svg></div>
<p style="letter-spacing:1px; font-size:1.5rem; word-wrap:break-word"> This is demo changes </p>
</div>`;
var isDragging = false;
var offsetX, offsetY;

addTranslatorContainer();

// Function to add translator container to the body
function addTranslatorContainer() {
  container.style.display = "none";
  container.classList.add("tranlator-container");
  container.style.position = "fixed";
  container.style.top = 0;
  container.style.right = 0;
  container.style.padding = "2rem";
  container.style.borderRadius = "12px";
  container.style.backgroundColor = "rgba(193, 207, 255, 0.877)";
  container.style.zIndex = 55555;
  container.style.color = "rgb(26,13,171)"
  container.style.maxWidth = "300px";
  container.style.textOverflow = "wrap";
  container.style.cursor = "grab";

  // Event listener for mouse down to enable dragging
  container.addEventListener("mousedown", function (e) {
    isDragging = true;

    // Calculate the offset between the mouse position and the top-left corner of the container
    offsetX = e.clientX - container.getBoundingClientRect().left;
    offsetY = e.clientY - container.getBoundingClientRect().top;

    // Change cursor style
    container.style.cursor = "grabbing";
  });
  body.append(container);
}

// Event listener for mouse move to handle dragging
document.addEventListener("mousemove", function (e) {
  if (isDragging) {
    // Update the position of the container based on the mouse movement
    container.style.left = e.clientX - offsetX + "px";
    container.style.top = e.clientY - offsetY + "px";
  }
});


// Event listener for mouse up to stop dragging
document.addEventListener("mouseup", function () {
  isDragging = false;

  // Restore cursor style
  container.style.cursor = "grab";
});

// Chrome extension message listener
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Arya");
  console.log("The language have been selected:", message.text);
  localStorage.setItem("languageSelected", message.text);
  console.log(localStorage.getItem("languageSelected"));
});

// container to be shown on UI
const tranlatorContainer = (text) => {
  container.innerHTML = `
  <div id="closeButton" onClick=${hideTranslatorContainer} style="width: min-content;
padding: 3px 6px;
font-weight: bolder;
position: absolute;
top: 1px;
right: 7px;
color:red;
>X</div>
  <p>${text}</p>`;
  console.log(container);
};

// event to translate on change
document.addEventListener("selectionchange", getSectedText);

// Function to hide translator container
function hideTranslatorContainer() {
  container.style.display = "none";
  console.log("funtion call");
}

// Function to get selected text and trigger translation
function getSectedText() {
  let text = "";

  let crossbtn = document.querySelector("#closeButton");
  crossbtn.addEventListener("click", hideTranslatorContainer);
  console.log(crossbtn);

  if (document.getSelection) {
    text = document.getSelection().toString();
    transtlateText(text);
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text;
}

// Function to translate text using the Text Translator API
const transtlateText = async (text) => {
  const url = "https://text-translator2.p.rapidapi.com/translate";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": "7a99335ba3msh4c15e38dcf8c85cp1d1a93jsnc73ce002621f",
      "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
    },
    body: new URLSearchParams({
      source_language: "auto",
      target_language: localStorage.getItem("languageSelected"),
      text: text,
    }),
  };
  try {
    const response = await fetch(url, options);
    const result = await response.text();
    const translatedText = JSON.parse(result);
    const container = document.querySelector(".tranlator-container");
    tranlatorContainer(translatedText.data.translatedText);
    container.style.display = "initial";
  } catch (error) {
    console.error(error);
    container.style.display = "initial";
  }
};
