const url =
  "https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=20&format=json&origin=*&srsearch=";

// select form,input,results
const formDOM = document.querySelector(".form");
const inputDOM = document.querySelector(".form-input");
const resultsDOM = document.querySelector(".results");

// listen for submit events
formDOM.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = inputDOM.value;
  // if empty value, display error
  if (!value) {
    resultsDOM.innerHTML =
      '<div class="error"> please enter valid search term</div>';
    return;
  }
  fetchPages(value);
});

// create fetch function
const fetchPages = async (searchValue) => {
  // display loading while fetching
  resultsDOM.innerHTML = '<div class="loading"></div>';
  try {
    // fetch url & construct dynamic url
    const response = await fetch(`${url}${searchValue}`);
    const data = await response.json();
    // console.log(data);
    // {batchcomplete: '', continue: {…}, query: {…}}
    // batchcomplete: ""
    // continue: {sroffset: 20, continue: '-||'}
    // query: {searchinfo: {…}, search: Array(20)} =>>
    // =>> search: (20) [{…}, {…}, {…}, {…}, {…}, {…},...
    // [[Prototype]]:Object
    // we'll need querry => search from the data
    const results = data.query.search;
    // console.log(results); // @ "apple" search
    // (20) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}] When open =>
    // 0: {ns: 0, title: 'Apple', pageid: 18978754, size: 82301, wordcount: 8269, …}
    // 1: {ns: 0, title: 'Apple Inc.', pageid: 856, size: 248663, wordcount: 23600, …}
    // 2: {ns: 0, title: 'Apple (disambiguation)', pageid: 36071326, size: 4156, wordcount: 493, …}
    // 3: {ns: 0, title: 'Apples to Apples', pageid: 277985, size: 5155, wordcount: 517, …}
    // 4: {ns: 0, title: 'IOS', pageid: 16161443, size: 167542, wordcount: 15092, …}
    // 5: {ns: 0, title: 'MacOS', pageid: 20640, size: 179218, wordcount: 15506, …} + other results

    // error message if no results
    if (results.length < 1) {
      resultsDOM.innerHTML =
        '<div class="error">no matching results. Please try again</div>';
      return;
    }
    renderResults(results);
    // fetch errors
  } catch (error) {
    resultsDOM.innerHTML = '<div class="error"> there was an error...</div>';
  }
};

//
const renderResults = (list) => {
  // - iterate over the list
  const cardsList = list
    .map((item) => {
      // console.log(item); // @ "apple" search
      // {ns: 0, title: 'Apple', pageid: 18978754, size: 82301, wordcount: 8269, …}
      // {ns: 0, title: 'Apple Inc.', pageid: 856, size: 248663, wordcount: 23600, …}
      // {ns: 0, title: 'Apple (disambiguation)', pageid: 36071326, size: 4156, wordcount: 493, …}
      // {ns: 0, title: 'Apples to Apples', pageid: 277985, size: 5155, wordcount: 517, …}
      // {ns: 0, title: 'IOS', pageid: 16161443, size: 167542, wordcount: 15092, …} + other results

      // - pull out title, snippet, pageid
      const { title, snippet, pageid } = item;
      // - setup a card
      return `<a href=http://en.wikipedia.org/?curid=${pageid} target="_blank">
            <h4>${title}</h4>
            <p>
              ${snippet}
            </p>
          </a>`;
    })
    .join("");
  // - set results with div.articles and list inside
  resultsDOM.innerHTML = `<div class="articles">
          ${cardsList}
        </div>`;
};
