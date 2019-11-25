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

// Object containing initial books for demo
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
function addBookToLibrary(title, author, pages, read) {
	const book = new Book(title, author, pages, read);
	myLibrary.push(book);
	createBookElement(book);
	localStorage.setItem('bookList', JSON.stringify(myLibrary));
}

// Creates book card for single book and adds to DOM
function createBookElement(book) {
	const div = document.createElement('div');
	const checked = (book.read ? 'checked' : '');
	div.innerHTML =
		`
			<div class="card-title">
				<span class="card-label">Title:</span>
				<span class="title">${book.title}</span>
			</div>
			<div class="card-author">
				<span class="card-label">Author:</span>
				<span class="author">${book.author}</span>
			</div>
			<div class="card-pages">
				<span class="card-label">Pages:</span>
				<span class="pages">${book.pages}</span>	
			</div>
			<label class="switch">
				<span class="card-label">Read?</span>
				<input class="checkbox" type="checkbox" data-id="${book.id}" ${checked}>
			</label> 
			
				<input type="button" class="button delete-card" data-id="${book.id}" value="Remove">

		`
	div.classList.add('book');
	div.dataset.id = book.id;
	container.appendChild(div);
}

// Render all books
function render(saved) {
	saved.forEach(book => {
		addBookToLibrary(book.title, book.author, book.pages, book.read);
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
	const delId = e.target.dataset.id;
	const div = document.querySelector(`div[data-id="${delId}"]`);
	container.removeChild(div);

	// remove object from array
	const arrayItem = myLibrary.find(obj => obj.id == delId);
	const itemIndex = myLibrary.indexOf(arrayItem);
	myLibrary.splice(itemIndex, 1);
	localStorage.setItem('bookList', JSON.stringify(myLibrary));
}

/*
	=================
	CODE TO EXECUTE
	=================
*/

// Event listeners for button clicks
window.addEventListener('click', (e) => {
	console.log(e.target.className);
	switch (e.target.className) {
		case 'button new-book':
			showForm();
			break;
		case 'button cancel':
			hideForm();
			break;
		case 'button submitBook':
			if (validateForm()) {
				getFormData();
				addBookToLibrary(formData.title, formData.author, formData.pages, formData.read);
				hideForm();
			}
			break;
		case 'button delete-card':
			deleteCard(e);
			break;
		case 'checkbox':
			const checkId = e.target.dataset.id;
			const book = myLibrary.find(book => book.id == checkId);
			book.changeReadStatus();
			localStorage.setItem('bookList', JSON.stringify(myLibrary));
			break;
	}
});

// Loads items from local storage if they exist
const bookList = localStorage.getItem('bookList');
let saved = [];
if (bookList === null || JSON.parse(bookList).length < 1) {
	for (const prop in defaultBooks) {
		const book = defaultBooks[prop];
		saved.push(book);
	}
} else {
	saved = JSON.parse(bookList);
};

// Initial render with saved items
render(saved);



