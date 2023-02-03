
/** Get the form and response elements from the UI */
const form = document.getElementById("query-form");
const responseDiv = document.getElementById("response");
let responseText = "";

/** Add a submit event listener to the form */
form.addEventListener("submit", async (event) => {
    // Prevent the form from submitting
    event.preventDefault();

    /** Show loading and hide response */
    document.getElementById('response-container').style.display = "none";
    document.getElementById('loadSpinner').style.display = "block";

    // Get the query from the form
    if (event.target && event.target.query && event.target.query.value != "") {

        /** send the query to the api and update the  responseText with that. */
    }
    else {
        responseText = "Your query is blank.";
    }

    responseDiv.textContent = responseText

    /** Hide loading and show response */
    document.getElementById('loadSpinner').style.display = "none";
    document.getElementById('response-container').style.display = "block";

});


// "permissions": [
//     "alarms",
//     "notifications",
//     "tabs",
//     "storage",
//     "https://api.openai.com/*"
// ],

// "background": {
//     "service_worker": "background.js"
// }

// "content_security_policy": {
//     "script-src": "self",
//     "script-src-elem": "https://use.fontawesome.com/",
//     "object-src": "self"
// },

// "content_security_policy": {
//     "script-src-elem": "https://example.com/"
// },


// "content_scripts": [
//     {
//         "matches": [
//             "<all_urls>"
//         ],
//         "js": [
//             "https://use.fontawesome.com/9cd1c736ac.js"
//         ]
//     }
// ],

// "content_scripts": [
//     {
//         "matches": [
//             "https://use.fontawesome.com/*"
//         ],
//         "js": [
//             "botScript.js"
//         ],
//         "css": [
//             "botStyle.css"
//         ]
//     }
// ],