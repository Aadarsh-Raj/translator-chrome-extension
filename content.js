const body = document.querySelector("body");
const container = document.createElement("div");
container.innerHTML = `<div id="closeButton" onClick=${hideTranslatorContainer} style="width: min-content;
padding: 3px 6px;
font-weight: bolder;
position: absolute;
top: 6px;
right: 10px;
background-color: red;
border-radius: 4.5px;"
>X</div>`;
var isDragging = false;
var offsetX, offsetY;

addTranslatorContainer();
function addTranslatorContainer() {
  container.style.display = "none";
  container.classList.add("tranlator-container");
  container.style.position = "absolute";
  container.style.top = 0;
  container.style.right = 0;
  container.style.padding = "4rem";
  container.style.backgroundColor = "black";
  container.style.color = "white";
  container.style.zIndex = 55555;
  container.style.maxWidth = "300px";
  container.style.textOverflow = "wrap";
  container.style.cursor = "grab";

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

document.addEventListener("mousemove", function (e) {
  if (isDragging) {
    // Update the position of the container based on the mouse movement
    container.style.left = e.clientX - offsetX + "px";
    container.style.top = e.clientY - offsetY + "px";
  }
});

document.addEventListener("mouseup", function () {
  isDragging = false;

  // Restore cursor style
  container.style.cursor = "grab";
});

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
top: 6px;
right: 10px;
background-color: red;
border-radius: 4.5px;"
>X</div>
  <p>${text}</p>`;
  console.log(container);
};

// event to translate on change
document.addEventListener("selectionchange", getSectedText);

function getSectedText() {
  let text = "";

  if (window.getSelection) {
    text = window.getSelection().toString();
    transtlateText(text);
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text;
}

// translating test
const transtlateText = async (text) => {
  const url = "https://text-translator2.p.rapidapi.com/translate";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": "c97f50abb2msh3616900d606885ep1f45aajsn0970ab5aca5d",
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
  }
};

function hideTranslatorContainer() {
  container.style.display = "none";
}
