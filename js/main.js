var submitButton = document.querySelector(".data-input .btn-primary"),
  updateButton = document.querySelector(".data-input .btn-success"),
  searchInput = document.querySelector("input[placeholder='Search']"),
  bookmarkNameInput = document.getElementById("bookmarkName"),
  bookmarkUrlInput = document.getElementById("bookmarkUrl"),
  dataOutput = document.querySelector("div .data-output"),
  alerts = document.querySelectorAll(".alert"),
  deleteAll = document.querySelector(".data-input .btn-danger"),
  updateIndex,
  bookmarksArr;

/* Check Local Storage to get data */
if (localStorage.getItem("bookmarksKey") != null) {
  bookmarksArr = JSON.parse(localStorage.getItem("bookmarksKey"));
  displayBookmarks();
} else {
  bookmarksArr = [];
}

submitButton.addEventListener("click", addBookmark); // Add Onclick Event on Submit Button

/*Add New Bookmark to the Bookmarks Array then update local storage, display and clear inputs for user*/
function addBookmark() {
  if (checkEmptyValues()) {
    var bookmark = {
      name: bookmarkNameInput.value,
      url: bookmarkUrlInput.value.includes("https://")
        ? bookmarkUrlInput.value
        : `https://${bookmarkUrlInput.value}`,
    };
    bookmarksArr.push(bookmark);
    localStorage.setItem("bookmarksKey", JSON.stringify(bookmarksArr));
    displayBookmarks();
    clearInputs();
  }
}

/*Check Inputs if empty then unvalid */
function checkEmptyValues() {
  alerts[0].classList.add("d-none");
  alerts[1].classList.add("d-none");
  if (bookmarkNameInput.value == "" && bookmarkUrlInput.value == "") {
    alerts[0].classList.remove("d-none");
    alerts[1].classList.remove("d-none");
    return false;
  } else if (bookmarkNameInput.value == "") {
    alerts[0].classList.remove("d-none");
    return false;
  } else if (bookmarkUrlInput.value == "") {
    alerts[1].classList.remove("d-none");
    return false;
  } else return true;
}

/*Display All Bookmarks Divs and add update,delete Events */
function displayBookmarks() {
  var outputDivs = "";
  for (var i = 0; i < bookmarksArr.length; i++) {
    outputDivs += `<div class="p-4 m-3" id="${i}">
        <h2>${bookmarksArr[i].name}</h2>
        <a href="${bookmarksArr[i].url}" target="_blank" class="btn btn-outline-primary">Visit</a>
        <button class="btn btn-outline-danger delete-btn">Delete</button>
        <button class="btn btn-outline-warning update-btn" >Update</button>
    </div>`;
  }
  dataOutput.innerHTML = outputDivs;
  addDeleteEvent();
  addUpdateEvent();
}

/* Add Onclick Event to all Delete Buttons at the Output Div */
function addDeleteEvent() {
  var deleteButtons = document.querySelectorAll(".delete-btn");
  for (var i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", function (e) {
      deleteBookmark(e.target.parentElement.id); // id of the selected div
    });
  }
}

/* Delete Selected Bookmark from Array then update local Storage then display bookmarks */
function deleteBookmark(index) {
  bookmarksArr.splice(index, 1);
  localStorage.setItem("bookmarksKey", JSON.stringify(bookmarksArr));
  displayBookmarks();
}

/*Delete All Bookmarks from local storage and array */
deleteAll.addEventListener("click", function () {
  var confirm = window.confirm("Do you want to delete all bookmarks?");
  if (confirm == true) {
    bookmarksArr = [];
    localStorage.removeItem("bookmarksKey");
    displayBookmarks();
  } else {
    return;
  }
});

/* Add Onclick Event to all Update Buttons at the Output Div */
function addUpdateEvent() {
  var updateButtons = document.querySelectorAll(".update-btn");
  for (var i = 0; i < updateButtons.length; i++) {
    updateButtons[i].addEventListener("click", function (e) {
      showSelectedBookmark(e.target.parentElement.id); // id of the selected div
    });
  }
}

/*Show Selected Bookmark data to user, change the button to make update
 * and make the global variable updateIndex equal to selected bookmark
 */
function showSelectedBookmark(index) {
  var update = bookmarksArr[index];
  bookmarkNameInput.value = update.name;
  bookmarkUrlInput.value = update.url.replace("https://", "");
  submitButton.classList.add("d-none");
  updateButton.classList.remove("d-none");
  updateIndex = index;
}

/*update the selected bookmark with the new data */
updateButton.addEventListener("click", function (e) {
  if (checkEmptyValues()) {
    var updated = {
      name: bookmarkNameInput.value,
      url: bookmarkUrlInput.value.includes("https://")
        ? bookmarkUrlInput.value
        : `https://${bookmarkUrlInput.value}`,
    };
    bookmarksArr[updateIndex] = updated;
    submitButton.classList.remove("d-none");
    updateButton.classList.add("d-none");
    localStorage.setItem("bookmarksKey", JSON.stringify(bookmarksArr));
    clearInputs();
    displayBookmarks();
  }
});

/* Clear Inputs(Bookmark Name, Website URL)*/
function clearInputs() {
  bookmarkNameInput.value = "";
  bookmarkUrlInput.value = "";
}

/*Add Event OnKeyUp on search input */
searchInput.addEventListener("keyup", searchBookmark);
function searchBookmark() {
  var searchWord = searchInput.value,
    searchOutput = "";
  for (var i = 0; i < bookmarksArr.length; i++) {
    if (bookmarksArr[i].name.toLowerCase().includes(searchWord.toLowerCase())) {
      searchOutput += `<div class="p-4 m-3" id="${i}">
        <h2>${bookmarksArr[i].name}</h2>
        <a href="https://${bookmarksArr[i].url}" target="_blank" class="btn btn-outline-primary">Visit</a>
        <button class="btn btn-outline-danger delete-btn">Delete</button>
        <button class="btn btn-outline-warning update-btn" >Update</button>
    </div>`;
    }
  }
  dataOutput.innerHTML = searchOutput;
  addDeleteEvent();
  addUpdateEvent();
}
