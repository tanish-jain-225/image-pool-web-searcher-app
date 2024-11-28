// Unsplash API Access Key
const accessKey = "Qo-3Ie9EYMxAovnBEuJgW8bv-KsOhWzGRX2oEmBu0Bg";

// DOM Elements
const formElement = document.querySelector("form");
const searchInputElement = document.getElementById("search-input");
const searchResultsElement = document.querySelector(".search-results");
const showMoreButtonElement = document.getElementById("show-more-button");

// Variables
let query = "";
let currentPage = 1;
let isLoading = false;

// Create a debounce function to delay the API call after the user stops typing
const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};

// Show loading spinner
const showLoading = () => {
    const loadingSpinner = document.createElement("div");
    loadingSpinner.classList.add("loading-spinner");
    loadingSpinner.innerHTML = "Loading...";
    searchResultsElement.appendChild(loadingSpinner);
};

// Hide loading spinner
const hideLoading = () => {
    const loadingSpinner = document.querySelector(".loading-spinner");
    if (loadingSpinner) {
        loadingSpinner.remove();
    }
};

// Fetch images from Unsplash API
const fetchImages = async () => {
    query = searchInputElement.value.trim();
    
    // If the search query is empty, clear the results container
    if (!query) {
        searchResultsElement.innerHTML = ""; // Clear the container
        showMoreButtonElement.style.display = "none"; // Hide the "Show More" button
        return;
    }

    if (isLoading) return; // Prevent multiple requests at once
    isLoading = true;

    showLoading();

    const url = `https://api.unsplash.com/search/photos?page=${currentPage}&query=${query}&client_id=${accessKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.errors) {
            console.error("Error fetching data from Unsplash API:", data.errors);
            return;
        }

        const images = data.results;
        renderImages(images);
        currentPage++;

        // Show the "Show More" button if more images are available
        if (images.length > 0) {
            showMoreButtonElement.style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert('Error fetching data, please try again later.');
    } finally {
        hideLoading();
        isLoading = false;
    }
};

// Render images to the DOM
const renderImages = (images) => {
    if (currentPage === 1) {
        searchResultsElement.innerHTML = ""; // Clear previous results
    }

    images.forEach(image => {
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("search-result");

        const img = document.createElement("img");
        img.src = image.urls.small;
        img.alt = image.alt_description || "Unsplash Image";
        img.loading = "lazy"; // Lazy load images

        const link = document.createElement("a");
        link.href = image.links.html;
        link.target = "_blank";
        link.textContent = image.alt_description ? image.alt_description.toUpperCase() : "View Image";

        imageWrapper.appendChild(img);
        imageWrapper.appendChild(link);
        searchResultsElement.appendChild(imageWrapper);
    });
};

// Event listeners
formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    currentPage = 1;
    fetchImages();
});

showMoreButtonElement.addEventListener("click", () => {
    fetchImages();
});
