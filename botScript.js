
const login_section = document.getElementById("login-section");
const signup_section = document.getElementById("signup-section");
const query_section = document.getElementById("query-section");
const toLogin = document.getElementById("toLogin");
const toSignup = document.getElementById("toSignup");
const query_input = document.getElementById("query-input");
const response_container = document.getElementById('response-container');
const loadSpinner = document.getElementById('loadSpinner');
const submit_query = document.getElementById('submit-query');

/** Hide login section initially */
login_section.style.display = `none`;
response_container.style.display = "none";
loadSpinner.style.display = "none";

/** Show query section if logged in */
query_section.style.display = `none`;

/**temp */
signup_section.style.display = `none`;
login_section.style.display = `none`;
query_section.style.display = `block`;
query_input.focus();
/**temp */


toLogin.addEventListener(`click`, () => {
    signup_section.style.display = `none`;
    login_section.style.display = `block`;
});

toSignup.addEventListener(`click`, () => {
    login_section.style.display = `none`;
    signup_section.style.display = `block`;
});


/** Signing up */
const signup_form = document.getElementById("signup-form");
signup_form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(signup_form);
    const data = {};
    for (const [key, value] of formData.entries())
        data[key] = value;

    const requestData = JSON.stringify(data);

    const requestHeaders = new Headers({
        'Content-Type': 'application/json',
        'Content-Length': requestData.length
    });

    let requestOptions = {
        method: 'POST',
        headers: requestHeaders,
        body: requestData
    };

    fetch(`http://192.168.1.7:5000/api/auth/create-user`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // console.log(result.payload.message);
                /** showing querying screen */
                signup_section.style.display = `none`;
                login_section.style.display = `none`;
                query_section.style.display = `block`;
                query_input.focus();
            } else {
                console.log(result.payload);
            }
        })
        .catch(error => console.log('error', error));
});


/** Logging in */
const login_form = document.getElementById("login-form");
login_form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(login_form);
    const data = {};
    for (const [key, value] of formData.entries())
        data[key] = value;

    const requestData = JSON.stringify(data);

    const requestHeaders = new Headers({
        'Content-Type': 'application/json',
        'Content-Length': requestData.length
    });

    let requestOptions = {
        method: 'POST',
        headers: requestHeaders,
        body: requestData
    };

    fetch(`http://192.168.1.7:5000/api/auth/log-in`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // console.log(result.payload.message);
                /** showing querying screen */
                signup_section.style.display = `none`;
                login_section.style.display = `none`;
                query_section.style.display = `block`;
                query_input.focus();
            } else {
                console.log(result.payload);
            }
        })
        .catch(error => console.log('error', error));
});


/** Querying */
const form = document.getElementById("query-form");
const responseDiv = document.getElementById("response");
let responseText = "";

/** Add a submit event listener to the form */
form.addEventListener("submit", async (event) => {
    /** Prevent the form from submitting */
    event.preventDefault();

    /** Show loading */
    submit_query.style.display = `none`
    loadSpinner.style.display = `block`;
    response_container.style.display = `none`;

    /** Get the query from the form */
    if (event.target && event.target.query && event.target.query.value != "") {

        /** send the query to the api and update the  responseText with that. */
        const requestData = JSON.stringify({
            "query": event.target.query.value
        });

        const requestHeaders = new Headers({
            'Content-Type': 'application/json',
            'Content-Length': requestData.length
        });

        let requestOptions = {
            method: 'POST',
            headers: requestHeaders,
            body: requestData,
        };

        /** background communication start */
        // requestOptions.credentials = `include`;
        // chrome.runtime.sendMessage({
        //     requestOptions: requestOptions,
        //     url: `http://192.168.1.7:5000/api/query/make`,
        //     type: `query`
        // });

        // chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        //     if (request.type === `response`) {
        //         console.log(request.data);
        //         const result = request.data;

        //         if (result.success) {

        //             if (result.payload.data) {
        //                 responseText = result.payload.data;

        //                 /** Hide loading and show response and submit button */
        //                 loadSpinner.style.display = `none`;
        //                 response_container.style.display = `block`;
        //                 submit_query.style.removeProperty(`display`);
        //                 responseDiv.textContent = responseText;
        //             }
        //         }
        //         else {
        //             if (result.payload.message === `JWT missing`) {
        //                 //redirect to login
        //                 loadSpinner.style.display = `none`;
        //                 submit_query.style.removeProperty(`display`);
        //                 query_section.style.display = `none`;
        //                 login_section.style.display = `block`;
        //             }
        //             console.log(result.payload);
        //         }
        //     }
        // });
        /** background communication end */


        fetch(`http://192.168.1.7:5000/api/query/make`, requestOptions)
            .then(response => response.json())

            .then(result => {
                if (result.success) {

                    if (result.payload.data) {
                        responseText = result.payload.data;

                        /** Hide loading and show response and submit button */
                        loadSpinner.style.display = `none`;
                        response_container.style.display = `block`;
                        submit_query.style.removeProperty(`display`);
                        responseDiv.textContent = responseText;
                    }
                } else {
                    if (result.payload.message === `JWT missing`) {
                        //redirect to login
                        loadSpinner.style.display = `none`;
                        submit_query.style.removeProperty(`display`);
                        query_section.style.display = `none`;
                        login_section.style.display = `block`;
                    }
                    console.log(result.payload);
                }
            })
            .catch(error => console.log('error', error));
    } else {
        /** Hide loading and show response and submit button */
        loadSpinner.style.display = `none`;
        response_container.style.display = `block`;
        submit_query.style.removeProperty(`display`);
        responseText = "Your query is blank.";
        responseDiv.textContent = responseText;
    }
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