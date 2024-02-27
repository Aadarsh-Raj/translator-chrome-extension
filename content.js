chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Arya");
  console.log("The language have been selected:", message.text);
  if (sender.tab.id === currentTabId) {
    localStorage.setItem("languageSelected", message.text);
  } else {
    localStorage.setItem("languageSelected", "");
  }
});
const body = document.querySelector("body");

// container to be shown on UI
const tranlatorContainer = (text) => {
  const container = document.createElement("div");
  container.classList.add("tranlator-container");
  container.style.position = "fixed";
  container.style.top = 0;
  container.style.right = 0;
  container.style.padding = "4rem";
  container.style.backgroundColor = "black";
  container.style.color = "white";
  container.style.zIndex = 55555;
  container.style.maxWidth = "300px";
  container.style.textOverflow = "wrap";
  container.innerText = text;
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
      "X-RapidAPI-Key": "475ffacf66msh6a09364be8109ddp12df85jsn8cc3202fc331",
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
    tranlatorContainer(translatedText.data.translatedText);
  } catch (error) {
    console.error(error);
  }
};
