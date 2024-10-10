// index.js

// Initialize Supabase client
// import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://alkeobrltwcjdvptiddy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsa2VvYnJsdHdjamR2cHRpZGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1ODQwOTMsImV4cCI6MjA0NDE2MDA5M30.DwXHOVJ3pGL5AW7jrnyCtgL3lznBoux2oBJXas9fIx4';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Function to register a new user
async function registerUser(username, password, email) {
    const { data, error } = await supabase
        .from('accounts') // Replace with your users table name
        .insert([
            { username: username, password: password, email: email } // Save the username, email, and password
        ]);

    if (error) {
        console.error('Error registering user:', error.message); // Log error
        alert(`Error registering user: ${error.message}`); // Display error message to user
    } else {
        console.log('User registered successfully:', data); // Log success message
        alert('Registration successful!'); // Notify user of successful registration

        // Optionally, you can log in the user after registration
        const { user, error: loginError } = await supabase.auth.signIn({ email, password });
        if (loginError) {
            console.error('Login failed:', loginError.message); // Log login error
            alert(`Login failed: ${loginError.message}`); // Display login error to user
        } else {
            console.log('User logged in:', user); // Log logged in user
            // Redirect to the main application or home page after successful login
            window.location.href = 'recipe_assistant.html'; // Change this to your main application page
        }
    }
}

// Event listener for the registration form submission
// document.addEventListener('DOMContentLoaded', () => {
//     const registrationForm = document.getElementById('registration-form');
    
//     registrationForm.addEventListener('submit', async (event) => {
//         event.preventDefault(); // Prevent default form submission

//         // Get user inputs
//         const username = document.getElementById('username').value;
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;

//         // Call registerUser to save the new user
//         await registerUser(username, password, email);
//     });
// });
