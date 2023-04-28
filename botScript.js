
const login_section = document.getElementById("login-section");
const signup_section = document.getElementById("signup-section");
const query_section = document.getElementById("query-section");
const toLogin = document.getElementById("toLogin");
const toSignup = document.getElementById("toSignup");
const query_input = document.getElementById("query-input");
const response_container = document.getElementById('response-container');
const loadSpinner = document.getElementById('loadSpinner');
const submit_query = document.getElementById('submit-query');
const signup_action = document.getElementById('signup-action');
const greeting_text = document.getElementById('greeting-text');
const free_query_balance = document.getElementById('free-query-balance');

const base = `https://s2y5wy39ma.execute-api.us-east-1.amazonaws.com`;
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

/** Hide login section initially */
response_container.style.display = "none";
loadSpinner.style.display = "none";

/** Show query section if logged in (token present) - if server tells that it is expired, then rediect to login page */
if (localStorage.getItem('qm_Token') && localStorage.getItem('qm_username')) {
    query_section.style.display = `block`;
    signup_section.style.display = `none`;
    greeting_text.innerText = `Hi ${localStorage.getItem('qm_username')}, how may I help?`;

} else {
    query_section.style.display = `none`;
    signup_section.style.display = `block`;
}
login_section.style.display = `none`;

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

    /** Show loading */
    signup_action.style.display = `none`
    loadSpinner.style.display = `block`;

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

    fetch(`${base}/signup`, requestOptions)
        .then(response => {
            return response.json();
        })
        .then(result => {
            if (result.success) {

                localStorage.setItem('qm_Token', result.payload.data.jwtToken);
                localStorage.setItem('qm_freeRequestsBalance', result.payload.data.freeRequestsBalance);
                localStorage.setItem('qm_username', capitalize(result.payload.data.username));

                loadSpinner.style.display = `none`;

                signup_action.style.display = `block`
                signup_section.style.display = `none`;
                login_section.style.display = `none`;

                /** showing querying screen */
                greeting_text.innerText = `Hi ${localStorage.getItem('qm_username')}, how may I help?`;
                query_section.style.display = `block`;
                query_input.focus();
                free_query_balance.innerText = `Free queries left: ${localStorage.getItem('qm_freeRequestsBalance')}`;

            } else {
                console.log(result.payload);
                loadSpinner.style.display = `none`;
                //show error response to user
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
        credentials: 'include',
        headers: requestHeaders,
        body: requestData
    };

    fetch(`${base}/login`, requestOptions)

        .then(response => {
            return response.json();
        })

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
    submit_query.style.display = `none`;
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
            'Content-Length': requestData.length,
            'qm_Token': localStorage.getItem('qm_Token')
        });

        let requestOptions = {
            method: 'POST',
            // credentials: 'include',
            headers: requestHeaders,
            body: requestData,
        };

        fetch(`${base}/query`, requestOptions)
            .then(response => response.json())
            .then(result => {

                /** Hide loading and show response and submit button */
                loadSpinner.style.display = `none`;
                submit_query.style.display = `block`;

                if (result.success && result.payload && result.payload.data && result.payload.data.queryResponse && result.payload.data.freeRequestsBalance) {

                    responseText = result.payload.data.queryResponse;
                    responseDiv.textContent = responseText;
                    response_container.style.display = `block`;

                    localStorage.setItem('qm_freeRequestsBalance', result.payload.data.freeRequestsBalance);
                    free_query_balance.innerText = `Free queries left: ${localStorage.getItem('qm_freeRequestsBalance')}`;

                } else if (result.payload && result.payload.message && result.payload.message === `JWT missing`) {
                    /** redirect to login */
                    query_section.style.display = `none`;
                    login_section.style.display = `block`;
                }
            })
            .catch(error => console.log('error:', error));
    } else {
        /** Hide loading and show response and submit button */
        loadSpinner.style.display = `none`;
        response_container.style.display = `block`;
        submit_query.style.display = `block`;
        responseText = "Your query is blank.";
        responseDiv.textContent = responseText;
    }
});