// app.js
import { createClient } from '@supabase/supabase-js'
// Initialize Supabase client
const { createClient } = supabase;
const supabaseUrl = 'https://alkeobrltwcjdvptiddy.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsa2VvYnJsdHdjamR2cHRpZGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1ODQwOTMsImV4cCI6MjA0NDE2MDA5M30.DwXHOVJ3pGL5AW7jrnyCtgL3lznBoux2oBJXas9fIx4'; // Replace with your public API key
const supabase = createClient(supabaseUrl, supabaseKey);

// Check if user exists in the database
async function checkUser() {
    const user = supabase.auth.user(); // Get the currently logged-in user

    if (!user) {
        // If no user is logged in, check the database for the user by email or any identifier
        const { data, error } = await supabase
            .from('users') // Replace with your users table name
            .select('id') // Select the user id or any other identifier
            .eq('email', 'user-email@example.com'); // Replace with the method of checking user (e.g., email)

        if (error) {
            console.error('Error checking user:', error);
        } else if (data.length === 0) {
            // User does not exist, redirect to registration page
            window.location.href = 'registration.html'; // Redirect to the registration page
        } else {
            // User exists, proceed with normal application flow
            console.log('User exists, continue to the app.');
        }
    } else {
        console.log('User is logged in:', user);
    }
}

// Call checkUser function on page load
document.addEventListener('DOMContentLoaded', () => {
    checkUser(); // Check if user exists when the page loads
});

// Get references to the elements
const form = document.getElementById('recipe-form');
const resultDiv = document.getElementById('recipe-result');
const recipeInput = document.getElementById('recipe-input');
const typeSelect = document.querySelector('select[name="type"]');
const startRecordBtn = document.getElementById('start-record-btn');
const registrationForm = document.getElementById('registration-form'); // New registration form reference

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

// New registration functionality
registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Call function to insert data
    await registerUser(username, email, password);
});

// Insert data into Supabase
async function registerUser(username, password, email) {
    const { data, error } = await supabase
        .from('accounts') // Replace with your table name
        .insert([
            { username: username, password: password, email: email }
        ]);

        if (error) {
            console.error('Error:', error);
            alert('Registration failed. Please try again.');
        } else {
            alert('Registration successful!');
            window.location.href = 'index.html'; // Redirect to the main app page after successful registration
        }
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
    }, 3000); // Show form after 5 seconds (same as fadeInForm timing)
});
