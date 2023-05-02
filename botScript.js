
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
const login_action = document.getElementById('login-action');
const greeting_text = document.getElementById('greeting-text');
const free_query_balance = document.getElementById('free-query-balance');
const error_signup = document.getElementById("error-signup");
const error_login = document.getElementById("error-login");
const error_query = document.getElementById("error-query");
const error_timeout = 8000; /** milliseconds */
const logout_button = document.getElementById("logout-button");
// const base = `http://localhost:3000`;
const base = `https://s2y5wy39ma.execute-api.us-east-1.amazonaws.com`;

const removeError = element => setTimeout(() => element.innerText = '', error_timeout);
const unsetLocalStorage = keys => keys.forEach(key => localStorage.removeItem(key));
const setLocalStorage = data => {
    localStorage.setItem('qm_Token', data.jwtToken);
    localStorage.setItem('qm_freeRequestsBalance', data.freeRequestsBalance);
    localStorage.setItem('qm_username', data.username);
}
const responseValid = result => {
    if (result.payload && result.payload.data && result.payload.data.jwtToken && typeof result.payload.data.freeRequestsBalance === 'number' && result.payload.data.freeRequestsBalance >= 0 && result.payload.data.username) {
        setLocalStorage(result.payload.data);
        return true;
    }
    return false;
}
const showError = (element, error) => {
    element.innerText = error;
    removeError(element);
}

loadSpinner.style.display = "none";

/** Show query section if logged in (token present) - if server tells that it is expired, then rediect to login page */
if (localStorage.getItem('qm_Token') && localStorage.getItem('qm_username') && localStorage.getItem('qm_freeRequestsBalance')) {
    query_section.style.display = `block`;
    response_container.style.display = "none";
    signup_section.style.display = `none`;
    greeting_text.innerText = `Hi ${localStorage.getItem('qm_username')}, how may I help?`;
    free_query_balance.innerText = `Free queries left: ${localStorage.getItem('qm_freeRequestsBalance')}`;

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


/******************************* Signing up *****************************************/
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
            if (result && result.success) {

                if (responseValid(result)) {

                    /** showing querying screen */
                    signup_section.style.display = `none`;
                    greeting_text.innerText = `Hi ${localStorage.getItem('qm_username')}, how may I help?`;
                    query_section.style.display = `block`;
                    responseDiv.textContent = ``;

                    query_input.focus();
                    free_query_balance.innerText = `Free queries left: ${localStorage.getItem('qm_freeRequestsBalance')}`;

                } else /** null data params */
                    showError(error_signup, `Server temporarily down.`);


            } else if (result && !result.success && result.payload && result.payload.message)    // add option to reset password
                showError(error_signup, result.payload.message);

            else /** result is null */
                showError(error_signup, `Server temporarily down.`);

            signup_action.style.display = `block`;
            loadSpinner.style.display = `none`;
        })
        .catch(error => console.log('error', error));
});


/****************************************** Logging in *****************************************/
const login_form = document.getElementById("login-form");
login_form.addEventListener("submit", function (event) {
    event.preventDefault();

    /** Show loading */
    login_action.style.display = `none`
    loadSpinner.style.display = `block`;

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
        // credentials: 'include',
        headers: requestHeaders,
        body: requestData
    };

    fetch(`${base}/login`, requestOptions)

        .then(response => {
            return response.json();
        })
        .then(result => {

            if (result && result.success) {

                if (responseValid(result)) {

                    /** showing querying screen */
                    login_section.style.display = `none`;
                    greeting_text.innerText = `Hi ${localStorage.getItem('qm_username')}, how may I help?`;
                    query_section.style.display = `block`;
                    query_input.focus();
                    free_query_balance.innerText = `Free queries left: ${localStorage.getItem('qm_freeRequestsBalance')}`;

                } else  /** null data params */
                    showError(error_login, `Server temporarily down.`);


            } else if (result && !result.success && result.payload && result.payload.message) {    // add option to reset password
                showError(error_login, result.payload.message);

            } else /** result is null */
                showError(error_login, `Server temporarily down.`);

            login_action.style.display = `block`;
            loadSpinner.style.display = `none`;
        })
        .catch(error => console.log('error', error));
});


/****************************************** Querying *****************************************/
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
    logout_button.style.display = "none";

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
                logout_button.style.display = `block`;

                if (result.success && result.payload && result.payload.data && result.payload.data.queryResponse && result.payload.data.freeRequestsBalance >= 0) {

                    responseText = result.payload.data.queryResponse;
                    responseDiv.textContent = responseText;
                    response_container.style.display = `block`;

                    localStorage.setItem('qm_freeRequestsBalance', result.payload.data.freeRequestsBalance);
                    free_query_balance.innerText = `Free queries left: ${localStorage.getItem('qm_freeRequestsBalance')}`;

                } else if (result.payload && result.payload.message && result.payload.message === `JWT missing`) {
                    /** redirect to login */
                    query_section.style.display = `none`;
                    login_section.style.display = `block`;
                    showError(error_login, `You have been logged out. Log in to continue`);

                } else if (!result.success && result.payload && result.payload.message)
                    showError(error_query, result.payload.message);
            })
            .catch(error => console.log('error:', error));
    } else {
        /** Hide loading and show response and submit button */
        loadSpinner.style.display = `none`;
        response_container.style.display = `block`;
        submit_query.style.display = `block`;
        responseText = "Your query is blank.";
        responseDiv.textContent = responseText;
        logout_button.style.display = `block`;
    }
});


/****************************************** Logging Out *****************************************/
logout_button.addEventListener('click', () => {
    unsetLocalStorage(["qm_Token", "qm_freeRequestsBalance", "qm_username"]);
    query_section.style.display = `none`;
    login_section.style.display = `block`;
});