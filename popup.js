console.log("popus.js");
const selectTag = document.querySelector("#select-language");

selectTag.addEventListener("change", (e) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const message = { text: e.target.value };
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
});

// get language list from api
const getLanguageList = async () => {
  const url = "https://text-translator2.p.rapidapi.com/getLanguages";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "c97f50abb2msh3616900d606885ep1f45aajsn0970ab5aca5d",
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
    let list = createOptions(ele.code, ele.name);
    selectTag.append(list);
  });
  console.log(selectTag);
};
createLanguageList();

// create list Items
const createOptions = (code, name) => {
  const list = document.createElement("option");
  list.setAttribute("value", code);
  list.innerText = `${name}`;
  return list;
};
