console.log("Arya");
// const languageList = require("./gettranslatedData.json");
// console.log(languageList);
const body = document.querySelector("body");
const ul = document.createElement("ul");
const createLi = (code, name) => {
  const list = document.createElement("li");
  list.innerText = `${name}`;
  list.setAttribute("id", code);
};

const languageList = async () => {
  const url = "https://text-translator2.p.rapidapi.com/getLanguages";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "475ffacf66msh6a09364be8109ddp12df85jsn8cc3202fc331",
      "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    const responseResult = await result.data.languages.map((ele) => console.log(ele));
    console.log(responseResult);
  } catch (error) {
    console.error(error);
  }
};
languageList();

const tranlatorContainer = () => {
  const container = document.createElement("div");
  container.classList.add("tranlator-container");
  container.style.position = "absolute";
  container.style.top = 0;
  container.style.right = 0;
  container.style.padding = "4rem";
  container.style.display = "fixed";
  container.style.backgroundColor = "black";
  container.style.color = "white";
  container.innerText = "This is container";
//   body.appendChild(container);
};

document.addEventListener("mouseup", function () {
  const text = getSectedText();
  console.log(text);
  tranlatorContainer();
});

function getSectedText() {
  let text = "";

  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text;
}

// window.open(
//   "index.html",
//   "Arya",
//   "width=400,height=150,status=yes,scrollbars=yes"
// );
