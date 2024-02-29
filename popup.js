console.log("popus.js");

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const selectTag = document.querySelector("#select-language");
  // Load the selected language from storage
  chrome.storage.sync.get("selectedLanguage", function (data) {
    const selectedLanguage = data.selectedLanguage || "en";
    selectTag.value = selectedLanguage;
  });
  // get value from change in selected text to send on UI storage
  selectTag.addEventListener("change", (e) => {
    // Save the selected language to storage
    chrome.storage.sync.set({ selectedLanguage: e.target.value });
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
        "X-RapidAPI-Key": "7a99335ba3msh4c15e38dcf8c85cp1d1a93jsnc73ce002621f",
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
});

// create list Items
const createOptions = (code, name) => {
  const list = document.createElement("option");
  list.setAttribute("value", code);
  list.innerText = `${name}`;
  return list;
};
