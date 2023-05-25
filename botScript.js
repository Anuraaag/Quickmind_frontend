
const login_section = document.getElementById("login-section");
const signup_section = document.getElementById("signup-section");
const query_section = document.getElementById("query-section");
const signup_to_login = document.getElementById("signup-to-login");
const verify_to_login = document.getElementById("verify-to-login");
const login_to_signup = document.getElementById("login-to-signup");
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
const default_timeout = 8000;
const logout_button = document.getElementById("logout-button");
const verify_screen = document.getElementById("verify-screen");
const verify_text = document.getElementById("verify-text");
const premium_screen = document.getElementById("premium-screen");
const query_to_premium = document.getElementById("query-to-premium");
const premium_to_query = document.getElementById("premium-to-query");
const push_notification = document.getElementById("push-notification");
const default_response = `Please try again in some time`;

const base = `https://s2y5wy39ma.execute-api.us-east-1.amazonaws.com`; /** `http://localhost:3000`; */

const removeError = (element, timer) => setTimeout(() => element.innerText = '', timer);
const unsetLocalStorage = keys => keys.forEach(key => localStorage.removeItem(key));
const showError = (element, error, timer = default_timeout) => {
    element.innerText = error;
    removeError(element, timer);
}
const logout = () => {
    unsetLocalStorage(["qm_Token", "qm_freeRequestsBalance", "qm_username"]);
    query_section.style.display = `none`;
}
const notify_user = (notification) => {
    if (notification && notification.message)
        showError(push_notification, notification.message, 12000);
}
const error_array = [
    "Enter valid credentials",
    "Please verify your email ID!",
    "Invalid data",
    "Enter a valid name",
    "Enter a valid email",
    "Password must be at least 5 characters",
    "Account with this email already exists"
];


/** Initial state */
loadSpinner.style.display = `none`;
verify_screen.style.display = `none`;
query_section.style.display = `none`;
signup_section.style.display = `none`;
login_section.style.display = `none`;
premium_screen.style.display = `none`;

if (localStorage.getItem('qm_Token') && localStorage.getItem('qm_username') && localStorage.getItem('qm_freeRequestsBalance')) {
    query_section.style.display = `block`;
    response_container.style.display = "none";
    greeting_text.innerText = `Hi ${localStorage.getItem('qm_username')}, how may I help?`;
    free_query_balance.innerText = `Free queries left for the month: ${localStorage.getItem('qm_freeRequestsBalance')}`;

} else if (localStorage.getItem('qm_username') && localStorage.getItem('qm_verify')) {
    verify_text.innerText = `Hi ${localStorage.getItem('qm_username')}`;
    verify_screen.style.display = `block`;
}

else if (localStorage.getItem('qm_username'))
    login_section.style.display = `block`;

else
    signup_section.style.display = `block`;


signup_to_login.addEventListener(`click`, () => {
    signup_section.style.display = `none`;
    login_section.style.display = `block`;
});

verify_to_login.addEventListener(`click`, () => {
    verify_screen.style.display = `none`;
    login_section.style.display = `block`;
});

login_to_signup.addEventListener(`click`, () => {
    login_section.style.display = `none`;
    signup_section.style.display = `block`;
});

query_to_premium.addEventListener(`click`, () => {
    query_section.style.display = `none`;
    premium_screen.style.display = `block`;
});

premium_to_query.addEventListener(`click`, () => {
    query_section.style.display = `block`;
    premium_screen.style.display = `none`;
});


/********************************* Logging Out *****************************************/
logout_button.addEventListener('click', () => logout());


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
            if (result) {

                if (result.success) {

                    if (result.payload && result.payload.data && result.payload.data.username) {
                        unsetLocalStorage(["qm_Token", "qm_freeRequestsBalance"]); /** force reset */
                        localStorage.setItem('qm_username', result.payload.data.username);
                        localStorage.setItem('qm_verify', false);

                        signup_section.style.display = `none`;

                        /** showing verification screen */
                        verify_screen.style.display = "block";
                        verify_text.innerText = `Hi ${localStorage.getItem('qm_username')}`;

                    } else /** null data params */
                        showError(error_signup, default_response);

                    notify_user(result.pushNotification);

                } else if (result.payload && result.payload.message) {    // add option to reset password

                    if (error_array.includes(result.payload.message))
                        showError(error_signup, result.payload.message);

                    else {
                        showError(error_signup, default_response);
                        console.log("Error: ", result.payload.message);
                    }
                } else
                    showError(error_signup, default_response);

            } else /** result is null */
                showError(error_signup, default_response);

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
            if (result) {

                if (result.success) {
                    if (result.payload && result.payload.data && result.payload.data.jwtToken && typeof result.payload.data.freeRequestsBalance === 'number' && result.payload.data.freeRequestsBalance >= 0 && result.payload.data.username) {

                        unsetLocalStorage(["qm_verify"]);
                        localStorage.setItem('qm_Token', result.payload.data.jwtToken);
                        localStorage.setItem('qm_freeRequestsBalance', result.payload.data.freeRequestsBalance);
                        localStorage.setItem('qm_username', result.payload.data.username);
                        login_section.style.display = `none`;

                        /** showing querying screen */
                        query_section.style.display = `block`;
                        greeting_text.innerText = `Hi ${localStorage.getItem('qm_username')}, how may I help?`;
                        query_input.focus();
                        free_query_balance.innerText = `Free queries left for the month: ${localStorage.getItem('qm_freeRequestsBalance')}`;

                    } else if (result.payload && result.payload.data && result.payload.data.username && typeof result.payload.data.verified === `boolean`) {
                        /** login failed */
                        unsetLocalStorage(["qm_Token", "qm_freeRequestsBalance"]); /** kind of an unnecessary forced reset */
                        localStorage.setItem('qm_username', result.payload.data.username);
                        localStorage.setItem('qm_verify', result.payload.data.verified);
                        login_section.style.display = `none`;

                        /** showing verification screen */
                        verify_screen.style.display = `block`;
                        verify_text.innerText = `Hi ${localStorage.getItem('qm_username')}`;

                    } else { /** null data params */
                        showError(error_login, default_response);
                        console.log("Error: ", result);
                    }

                    notify_user(result.pushNotification);

                } else if (result.payload && result.payload.message) {    // add option to reset password

                    if (error_array.includes(result.payload.message))
                        showError(error_login, result.payload.message);

                    else {
                        showError(error_login, default_response);
                        console.log("Error: ", result.payload.message);
                    }
                } else
                    showError(error_login, default_response);

            } else /** result is null */
                showError(error_login, default_response);

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

                if (result) {

                    if (result.success) {
                        if (result.payload && result.payload.data && result.payload.data.queryResponse && result.payload.data.freeRequestsBalance >= 0) {
                            responseText = result.payload.data.queryResponse;
                            responseDiv.textContent = responseText;
                            response_container.style.display = `block`;

                            localStorage.setItem('qm_freeRequestsBalance', result.payload.data.freeRequestsBalance);
                            free_query_balance.innerText = `Free queries left for the month: ${localStorage.getItem('qm_freeRequestsBalance')}`;
                        } else {
                            showError(error_query, default_response);
                            console.log("Error: ", result.payload);
                        }

                        notify_user(result.pushNotification);

                    } else {  /** result.success is false */
                        if (result.payload && result.payload.message) {

                            if (result.payload.message === `JWT missing`) {
                                logout();
                                query_section.style.display = `none`;
                                login_section.style.display = `block`;
                                showError(error_login, `You have been logged out. Log in to continue`);

                            } else if (result.payload.message === `logout`) {
                                logout();
                                login_section.style.display = `none`;
                                signup_section.style.display = `block`;
                            } else
                                showError(error_query, default_response);

                            console.log("Error: ", result.payload.message);
                        } else
                            showError(error_query, default_response);
                    }
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
        logout_button.style.display = `block`;
    }
});
