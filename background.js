chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === `query`) {

        fetch(request.url, request.requestOptions)
            .then(response => response.json())
            .then(data => {
                // Send the response back to the script file
                chrome.runtime.sendMessage({
                    type: `response`,
                    data: data
                });
            })
            .catch(error => console.log('error', error));

    }
});
