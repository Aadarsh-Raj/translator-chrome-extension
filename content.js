console.log("Arya");

const body = document.querySelector("body");
const ul = document.createElement("ul");
// create list Items
const createList = (code, name) => {
  const list = document.createElement("li");
  list.setAttribute("id", code);
  list.innerText = `${name}`;
  return list;
};
// get language list from api
const getLanguageList = async () => {
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
    return result;
  } catch (error) {
    console.error(error);
  }
};

// create ul with lists of languages from api
const createLanguageList = async () => {
  let languageListResponse = await getLanguageList();

  let languageList = JSON.parse(languageListResponse);
  languageList.data.languages.map((ele) => {
    let list = createList(ele.code, ele.name);
    ul.append(list);
  });
  console.log(ul);
};
createLanguageList();
// container to be show on UI
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
  body.appendChild(container);
};
// need to replace the even as required
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

