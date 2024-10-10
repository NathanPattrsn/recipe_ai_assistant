// Import Supabase client if using ES modules
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://alkeobrltwcjdvptiddy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsa2VvYnJsdHdjamR2cHRpZGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1ODQwOTMsImV4cCI6MjA0NDE2MDA5M30.DwXHOVJ3pGL5AW7jrnyCtgL3lznBoux2oBJXas9fIx4'; // Ensure this key is not exposed publicly
const supabase = createClient(supabaseUrl, supabaseKey);

// Event listener for the registration form submission
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get user inputs
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Call registerUser to save the new user
        await registerUser(username, password, email);
    });
});

// Function to register a new user
async function registerUser(username, password, email) {
    console.log('Attempting to register user:', { username, email }); // Debugging statement

    const { data, error } = await supabase
        .from('accounts') // Ensure 'accounts' is the correct table name
        .insert([{ username, password, email }]);

    // Check for errors
    if (error) {
        console.error('Error registering user:', error.message);
        alert(`Error registering user: ${error.message}`); // Display error to the user
    } else {
        console.log('User registered successfully:', data); // Check if data contains the new user info
        alert('Registration successful!');

        // Optional login logic (if you want to log in the user automatically)
        const { user, error: loginError } = await supabase.auth.signIn({ email, password });
        if (loginError) {
            console.error('Login failed:', loginError.message);
            alert(`Login failed: ${loginError.message}`); // Display login error to the user
        } else {
            console.log('User logged in:', user);
            // Redirect to the recipe assistant page after successful login
            window.location.href = 'recipe_assistant.html'; // Change to your main application page
        }
    }
}
