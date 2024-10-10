// Import Supabase client if using ES modules
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://alkeobrltwcjdvptiddy.supabase.co';
const supabaseKey = 'your-supabase-key'; // Ensure this key is not exposed publicly
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to register a new user
async function registerUser(username, password, email) {
    console.log('Attempting to register user:', { username, email }); // Debugging statement
    const { data, error } = await supabase
        .from('accounts') // Ensure 'accounts' is the correct table name
        .insert([{ username, password, email }]);

    if (error) {
        console.error('Error registering user:', error.message);
        alert(`Error registering user: ${error.message}`);
        window.location.href = 'recipe_assistant.html';
    } else {
        console.log('User registered successfully:', data); // Check if data contains the new user info
        alert('Registration successful!');
        window.location.href = 'recipe_assistant.html';
        // Optional login logic
        const { user, error: loginError } = await supabase.auth.signIn({ email, password });
        if (loginError) {
            console.error('Login failed:', loginError.message);
            alert(`Login failed: ${loginError.message}`);
        } else {
            console.log('User logged in:', user);
            // Uncomment if you want to redirect after login
            window.location.href = 'recipe_assistant.html';
        }
    }
}

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
        window.location.href = 'recipe_assistant.html';
    });
});