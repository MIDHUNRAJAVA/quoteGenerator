// JavaScript for Random Quote Generator with Translation and Text-to-Speech

let quote = document.getElementById('quote');
let author = document.getElementById('author');
let btn = document.getElementById('btn');
let favourite = document.getElementById('favourite');
let list = document.getElementById('list-of-favourite-quotes');
let copyButton = document.getElementById('copy');
let showAllListOfFavourite = document.getElementById('show-list');
let clearButton = document.getElementById('clear-button');
let favoriteContainer = document.querySelector('.favorite-container');
let closeButton = document.getElementById('close-favorite');
const url = 'https://api.quotable.io/random';
let favorites = [];

// Function to update the displayed quote and author
const updateQuote = (content, authorName) => {
  quote.innerText = content;
  author.innerText = authorName;
  let existsInFavorites = checkExistence(content, authorName);
  let heartIcon = favourite.firstElementChild;
  if (existsInFavorites) {
    heartIcon.classList.remove('fa-regular');
    heartIcon.classList.add('fa-solid', 'active');
  } else {
    heartIcon.classList.add('fa-regular');
    heartIcon.classList.remove('fa-solid', 'active');
  }
};

// Function to display favorite quotes
const displayFavorites = () => {
  list.innerHTML = '';
  favorites.forEach((q, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${q.content} - ${q.author}`;
    list.appendChild(listItem);
  });
};

// Function to save favorites to local storage
const saveFavoritesToLocalStorage = () => {
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

// Function to fetch a random quote from the API
const getQuote = () => {
  fetch(url)
    .then((data) => data.json())
    .then((item) => {
      updateQuote(item.content, item.author);
    });
};

const checkExistence = (content, authorName) => {
  return favorites.some(
    (q) => q.content === content && q.author === authorName
  );
};

// Function to add a quote to favorite
const addToFavorites = () => {
  let heartIcon = favourite.firstElementChild;
  const content = quote.innerText;
  const authorName = author.innerText;

  // Check if the quote is already in favorites
  const existsInFavorites = checkExistence(content, authorName);

  if (existsInFavorites) {
    // Remove the quote from favorites
    favorites = favorites.filter((q) => q.content !== content || q.author !== authorName);
    saveFavoritesToLocalStorage(); // Save the updated favorites list to local storage
    displayFavorites(); // Update the favorite quotes list
    heartIcon.classList.remove('fa-solid', 'active'); // Remove the filled (red) heart
  } else {
    heartIcon.classList.add('fa-solid', 'active'); // Add the filled (red) heart
    // Add the quote to favorites
    favorites.push({ content, author: authorName });
    saveFavoritesToLocalStorage(); // Save the updated favorites list to local storage
    displayFavorites(); // Update the favorite quotes list
  }
};

// Function to copy text to clipboard
const copyToClipboard = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  const copyMessage = document.getElementById('copy-message');
  copyMessage.style.display = 'block';

  // Hide the message after a short delay (e.g., 2 seconds)
  setTimeout(() => {
    copyMessage.style.display = 'none';
  }, 2000); // 2000 milliseconds = 2 seconds
};

// Event listener for copying the quote to clipboard
copyButton.addEventListener('click', () => {
  copyToClipboard(quote.innerText);
});

// Function to clear favorites from local storage
const clearFavoritesFromLocalStorage = () => {
  localStorage.removeItem('favorites');
  favorites = []; // Clear the favorites array
  displayFavorites(); // Display the cleared favorites list
  favoriteContainer.style.display = 'none';
  list.style.display = 'none';
  let heartIcon = favourite.firstElementChild;
  if (heartIcon.classList.contains('fa-solid')) {
    heartIcon.classList.add('fa-regular');
    heartIcon.classList.remove('fa-solid', 'active');
  }
};

// Event listener for showing the list of favorite quotes
showAllListOfFavourite.addEventListener('click', () => {
  if (favorites.length == 0) {
    list.innerHTML = "<p>You haven't added a favorite yet</p>";
  }
  list.style.display = 'block';
  favoriteContainer.style.display = 'block';
});

// Event listener for closing the list of favorite quotes
closeButton.addEventListener('click', () => {
  list.style.display = 'none';
  favoriteContainer.style.display = 'none';
});

// Initialize the webpage
window.addEventListener('load', () => {
  list.style.display = 'none'; // hide the list when the window loads or refreshes
  favoriteContainer.style.display = 'none';
  favourite.addEventListener('click', addToFavorites);
  clearButton.addEventListener('click', clearFavoritesFromLocalStorage);

  // Load favorites from local storage if available
  const storedFavorites = localStorage.getItem('favorites');
  if (storedFavorites) {
    favorites = JSON.parse(storedFavorites);
    displayFavorites();
  }

  getQuote(); // Fetch and display a random quote when the page loads
});

// Event listener for generating another quote
btn.addEventListener('click', getQuote);

// Function to read the quote aloud
const readAloud = () => {
  const textToRead = `${quote.innerText} by ${author.innerText}`;
  responsiveVoice.speak(textToRead, 'UK English Female'); // You can choose a different voice if needed
};

// Event listener for the "Read Aloud" button
const readAloudButton = document.getElementById('read-aloud');
readAloudButton.addEventListener('click', readAloud);

function googleTranslateElementInit() {
  new google.translate.TranslateElement({ pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE }, 'google_translate_element');
}


const heartIcon = favourite.firstElementChild;
if (existsInFavorites) {
  // Remove the quote from favorites
  favorites = favorites.filter((q) => q.content !== content || q.author !== authorName);
  saveFavoritesToLocalStorage();
  displayFavorites();
  heartIcon.classList.remove('active'); // Remove the 'active' class
} else {
  // Add the quote to favorites
  favorites.push({ content, author: authorName });
  saveFavoritesToLocalStorage();
  displayFavorites();
  heartIcon.classList.add('active'); // Add the 'active' class
}


// Example code to cache quotes when fetched
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open('quote-cache').then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});


// Example code to activate the service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('quote-cache').then((cache) => {
      return cache.addAll([
        '/index.html',
        '/style.css',
        // Include other assets to cache here
      ]);
    })
  );
});


// Example code for periodic background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-quotes') {
    event.waitUntil(fetchNewQuotesAndCache());
  }
});
