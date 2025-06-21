// admin.js - Connection Test Version

document.addEventListener('DOMContentLoaded', () => {
    // This script will now do only ONE thing:
    // Try to fetch data from the Google Script URL as soon as the page loads.

    console.log("Attempting to connect to Google Apps Script...");
    
    // Access the API_URL from data.js, which is loaded first.
    const API_URL = GOOGLE_APPS_SCRIPT_URL; 

    // Use a simple fetch GET request. This matches the doGet function in our script.
    fetch(API_URL)
        .then(response => {
            // Check if the network response is okay (e.g., status 200)
            if (!response.ok) {
                // If not, throw an error to be caught by the .catch block
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            // If it is okay, parse the JSON data
            return response.json();
        })
        .then(data => {
            // If we get here, the connection was successful!
            console.group("✅ SUCCESS: Connection Established!");
            console.log("Data received from Google Sheet:");
            console.table(data.data); // Display the product data in a clean table
            console.groupEnd();
            
            // Display a success message on the page itself
            document.body.innerHTML = `
                <div style="font-family: sans-serif; padding: 40px; color: #333; background: #90ee90;">
                    <h1>Connection Successful!</h1>
                    <p>Data has been successfully fetched from your Google Sheet.</p>
                    <p>Check the browser's developer console (F12) to see the product data printed in a table.</p>
                    <p>We can now proceed to build the full admin panel functionality.</p>
                </div>
            `;
        })
        .catch(error => {
            // If any error occurred during the fetch, it will be caught here.
            console.group("❌ FAILED: Connection Error!");
            console.error("The API call failed. Details below:");
            console.error(error);
            console.groupEnd();

            // Display an error message on the page
            document.body.innerHTML = `
                <div style="font-family: sans-serif; padding: 40px; color: #fff; background: #E74C3C;">
                    <h1>Connection Failed!</h1>
                    <p>Could not fetch data from the Google Apps Script. This is likely still a CORS or deployment issue.</p>
                    <p><b>Please check the following:</b></p>
                    <ol>
                        <li>Did you replace the Code.gs file with the new version?</li>
                        <li>Did you <b>RE-DEPLOY</b> the script with a <b>New version</b> after pasting the code? This is the most common mistake.</li>
                        <li>Is the URL in your 'data.js' file correct?</li>
                    </ol>
                    <p>The error details are in the browser's developer console (F12).</p>
                </div>
            `;
        });
});
