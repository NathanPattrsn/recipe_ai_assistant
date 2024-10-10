// Get references to the elements
const form = document.getElementById('recipe-form');
const resultDiv = document.getElementById('recipe-result');
const recipeInput = document.getElementById('recipe-input');
const typeSelect = document.querySelector('select[name="type"]');
const startRecordBtn = document.getElementById('start-record-btn');

// Check if the user is on the root page and redirect to registration
if (window.location.pathname === '/') {
    loadRegistrationPage(); // Call the function to load the registration page content
}

async function loadRegistrationPage() {
    try {
        const response = await fetch('/registration.html'); // Fetch the HTML file
        if (!response.ok) {
            throw new Error('Failed to load the registration page');
        }

        const html = await response.text(); // Get the HTML content as text

        // Insert the content into a specific element (e.g., a div)
        document.body.innerHTML = html;

        // Optionally, run any scripts you need from the fetched page
        loadExternalScripts();
    } catch (error) {
        console.error('Error loading registration page:', error);
    }
}

function loadExternalScripts() {
    // If you need to load any external JS files, do it here
    const script = document.createElement('script');
    script.src = '../static/index2.js';
    document.body.appendChild(script);
}

let recognition;
let isRecording = false; // Track the recording state

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition(); // Use webkit prefix for compatibility
    recognition.continuous = false; // Stop recognizing after one phrase
    recognition.interimResults = false; // Show only final results

    // Event when recognition result is received
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // Get the recognized text
        recipeInput.value = transcript; // Set the recognized text to the input field
        console.log('Recognized text:', transcript);
        recognition.stop(); // Stop recognition after getting result
    };

    // Event when recognition ends
    recognition.onend = () => {
        console.log('Speech recognition ended.');
        isRecording = false; // Update the recording state
        startRecordBtn.textContent = '🎤 Start Voice Recognition'; // Reset button text
    };

    // Event for errors
    recognition.onerror = (event) => {
        console.error('Error occurred in recognition:', event.error);
        isRecording = false; // Update the recording state
        startRecordBtn.textContent = '🎤 Start Voice Recognition'; // Reset button text
    };
} else {
    console.error('Speech recognition not supported in this browser.');
}

// Start/stop voice recognition when button is clicked
startRecordBtn.addEventListener('click', () => {
    if (recognition) {
        if (!isRecording) {
            recognition.start(); // Start the voice recognition
            console.log('Voice recognition started. Speak now.');
            recipeInput.focus(); // Auto-select the input field
            startRecordBtn.textContent = '⏹️ Stop Voice Recognition'; // Change button text to Stop
            isRecording = true; // Update the recording state
        } else {
            recognition.stop(); // Stop the voice recognition
            console.log('Voice recognition stopped.');
            startRecordBtn.textContent = '🎤 Start Voice Recognition'; // Reset button text
        }
    }
});

// Existing recipe fetching logic
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission
    const recipeName = recipeInput.value.trim(); // Get the recipe name (if provided)
    const recipeType = typeSelect.value; // Get the selected type

    // Prepare the query string based on provided inputs
    let query = `https://recipe-assistant-yj8h.onrender.com/recipe?`; // Full backend URL
    const params = new URLSearchParams();

    if (recipeName) {
        params.append('name', recipeName.toLowerCase());
    }
    if (recipeType) {
        params.append('type', recipeType.toLowerCase());
    }

    query += params.toString(); // Append parameters to the query

    try {
        const response = await fetch(query); // Make the request to the backend

        // Clear previous results
        resultDiv.innerHTML = '';
        resultDiv.classList.remove('d-none');
        resultDiv.classList.add('visible');

        if (response.ok) {
            const data = await response.json(); // Parse the JSON response
            if (recipeName && data[recipeName.toLowerCase()]) { // Check if a specific recipe was requested
                const recipe = data[recipeName.toLowerCase()]; // Single recipe case
                displayRecipe(recipe, recipeName, 1); // Pass the count as 1
            } else {
                // Loop through all matched recipes if no specific name was requested
                const recipesCount = Object.keys(data).length; // Get the total count of recipes
                let count = 0; // Initialize counter

                for (const [name, recipe] of Object.entries(data)) {
                    count++; // Increment the counter
                    displayRecipe(recipe, name, recipesCount); // Pass the count to displayRecipe
                }
            }
        } else {
            const errorData = await response.json();
            resultDiv.innerHTML = `<p class="error">${errorData.error}</p>`;
        }
    } catch (error) {
        console.error('Failed to fetch:', error);
        resultDiv.innerHTML = `<p class="error">Failed to fetch recipes. Please check your connection or try again later.</p>`;
    }
});

// Function to display a single recipe
function displayRecipe(recipe, name, totalCount) {
    resultDiv.innerHTML += `
        <h3>${name.charAt(0).toUpperCase() + name.slice(1)}</h3>
        <h5>Type:</h5>
        <ul>
        <li>${recipe.type}</li>
        </ul>
        <h5>Ingredients:</h5>
        <ul>
            ${Object.entries(recipe.ingredients).map(([ingredient, quantity]) => 
                `<li>${ingredient}: ${quantity}</li>`).join('')}
        </ul>
        <h5>Instructions:</h5>
        <ol>
            ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
        </ol>
        ${totalCount > 1 ? '<hr>' : ''} <!-- Conditionally add <hr> -->
    `;
}

function setSelectWidth() {
    const input = document.getElementById('recipe-input');
    const select = document.getElementById('recipe-type');

    // Set the select width to match the input width
    select.style.width = `${input.offsetWidth}px`;
}

// Set width on page load
window.onload = setSelectWidth;

// Optional: Adjust width on window resize
window.onresize = setSelectWidth;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelector('#recipe-form').style.display = 'flex';
    }, 3000); // Show form after 3 seconds (same as fadeInForm timing)
});
