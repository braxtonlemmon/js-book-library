/* 
	================
	VARIABLES
	================
*/
let myLibrary = [];
let formData;
let id = 0;
const newBook = document.querySelector('.new-book');
const bookForm = document.querySelector('.book-form');
const wrapper = document.querySelector('.wrapper');
const container = document.querySelector('.container');
const hasRead = "Yes";
const notRead = "No";

// Object containing initial books for testing
const defaultBooks = {
	bookOne: {
		title: 'Artemis Fowl',
		author: 'Eoin Colfer',
		pages: 234,
		read: true
	},
	bookTwo: {
		title: 'H is for Hawk',
		author: 'Helen Macdonald',
		pages: 300,
		read: true
	},
	bookThree: {
		title: 'Personal Days',
		author: 'Ed Park',
		pages: 256,
		read: false
	}
}

/* 
	================
	FUNCTIONS
	================
*/

// Book constructor
function Book(title, author, pages, read) {
	this.id = id++
	this.title = title
	this.author = author
	this.pages = pages
	this.read = read
}

// Add method to Book prototype to toggle read status
Book.prototype.changeReadStatus = function () {
	this.read = (this.read ? false : true);
	const div = document.querySelector(`div[data-id="${this.id}"]`);
	const span = div.getElementsByClassName('status').item(0);
	span.textContent = (this.read ? hasRead : notRead);
};

// The data entered into the form to be used to make the book card
function getFormData() {
	formData = {
		title: document.getElementById('title').value,
		author: document.getElementById('author').value,
		pages: document.getElementById('pages').value,
		read: getReadStatus(),
	}
}

// Check radio button for read status
function getReadStatus() {
	const radioOptions = document.getElementsByName('read');
	return radioOptions[0].checked ? true : false;
}

// Runs validations on new book form
function validateForm() {
	const title = document.forms['BookForm']['title'];
	const author = document.forms['BookForm']['author'];
	const pages = document.forms['BookForm']['pages'];
	const radioOptions = document.BookForm.read;
	console.log(typeof radioOptions);
	if (title.value == "") {
		window.alert('Please enter a title.');
		title.focus();
		return false;
	}

	if (author.value == "") {
		window.alert('Please enter an author.');
		author.focus();
		return false;
	}

	if (pages.value == "") {
		window.alert('Please enter number of pages.');
		pages.focus();
		return false;
	}

	let found = false;
	for (let i = 0; i < radioOptions.length; i++) {
		if (radioOptions[i].checked) {
			found = true;
		}
	}

	if (found != true) {
		window.alert('Have you read the book?');
		return false;
	}

	return true;
}

// Adds book object to myLibrary array
function addBookToLibrary() {
	getFormData();
	const book = new Book(formData.title, formData.author, formData.pages, formData.read);
	myLibrary.push(book);
	createBookElement(book);
}

// Creates book card for single book and adds to DOM
function createBookElement(book) {
	const div = document.createElement('div');
	const checked = (book.read ? 'checked' : '');
	div.innerHTML =
		`
			<div class="card-title">
				<span class="card-label">Title:</span>
				<span class="title">${book.title}</span	
			</div>
			<div class="card-author">
				<span class="card-label">Author:</span>
				<span class="author">${book.author}</span>
			</div>
			<div class="card-pages">
				<span class="card-label">Pages:</span>
				<span class="pages">${book.pages}</span>	
			</div>
			<div class="card-status">
				<span class="card-label">Read?</span>
				<span class="status">
					${book.read ? hasRead : notRead}
				</span>
			</div>
			<div class="card-buttons">
				<input type="button" class="edit-card" value="Edit">
				<input type="button" class="delete-card" data-id="${book.id}" value="Remove">
			</div>
			<label class="switch">
				<span>Read?</span>
				<input class="checkbox" type="checkbox" data-id="${book.id}" ${checked}>
			</label> 
		`
	div.classList.add('book');
	div.dataset.id = book.id;
	container.appendChild(div);
}

// Render all books
function render() {
	myLibrary.forEach(book => {
		createBookElement(book);
	})
}

// Hide form
function hideForm() {
	bookForm.style.visibility = "hidden";
	wrapper.style.opacity = "1.0";
	bookForm.reset();
}

// Show form
function showForm() {
	bookForm.style.visibility = "initial";
	wrapper.style.opacity = "0.5";
}

function deleteCard(e) {
	// remove div
	const id = e.target.dataset.id;
	const div = document.querySelector(`div[data-id="${id}"]`);
	container.removeChild(div);

	// remove object from array
	const arrayItem = myLibrary.find(obj => obj.id == id);
	const itemIndex = myLibrary.indexOf(arrayItem);
	myLibrary.splice(itemIndex, 1);
}

/* 
	====================
	LOCAL STORAGE
	====================
*/
// Function to test if localStorage is supported and available
function storageAvailable(type) {
	var storage;
	try {
		storage = window[type];
		var x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch (e) {
		return e instanceof DOMException && (
			// everything except Firefox
			e.code === 22 ||
			// Firefox
			e.code === 1014 ||
			// test name field too, because code might not be present
			// everything except Firefox
			e.name === 'QuotaExceededError' ||
			// Firefox
			e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
			// acknowledge QuotaExceededError only if there's something already stored
			(storage && storage.length !== 0);
	}
}

/*
	=================
	CODE TO EXECUTE
	=================
*/

// Trial setup with default books
for (const prop in defaultBooks) {
	const book = defaultBooks[prop];
	const newBook = new Book(book.title, book.author, book.pages, book.read);
	myLibrary.push(newBook);
}

// Initial render with current items from myLibrary
render();

// Event listeners for button clicks
window.addEventListener('click', (e) => {
	switch (e.target.className) {
		case 'new-book':
			showForm();
			break;
		case 'cancel':
			hideForm();
			break;
		case 'submit-book':
			if (validateForm()) {
				addBookToLibrary();
				hideForm();
			}
			break;
		case 'delete-card':
			deleteCard(e);
			break;
		case 'checkbox':
			const id = e.target.dataset.id;
			const book = myLibrary.find(book => book.id == id);
			book.changeReadStatus();
	}
});

// Test for local storage
if (storageAvailable('localStorage')) {
	console.log('Wahoo!');
} else {
	console.log('Booo...');
}

