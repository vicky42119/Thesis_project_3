document.addEventListener("DOMContentLoaded", function () {
    const answerElement = document.getElementById("answer");
    const questionForm = document.getElementById("question-form");

    // Load the Google Sheets API
    gapi.load('client:auth2', initClient);

    function initClient() {
        gapi.client.init({
            apiKey: 'AIzaSyDHINE-9nuGk1L1M7SZrVb1OG0PadzaS6s', // Replace with your API key
            clientId: '350638424163-avqurhrj154g80kdab5qo8a6ua3od0th.apps.googleusercontent.com', // Replace with your OAuth client ID
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            scope: 'https://www.googleapis.com/auth/spreadsheets',
        }).then(function () {
            // Authenticate the user (you may need to handle user sign-in)
            return gapi.auth2.getAuthInstance().signIn();
        }).then(function () {
            // Continue with the rest of the code after authentication
            questionForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const questionInput = document.getElementById("question");
                const question = questionInput.value;

                if (question.trim() !== "") {
                    // Send the question to the Google Sheets
                    accessGoogleSheets(question);
                    questionInput.value = ""; // Clear the input field
                }
            });
        });
    }

    function accessGoogleSheets(user_question) {
        gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '1fs2SWp0i3vZb_4BZVDHh2EHrespFRGZdCSPDPOZnLSM', // Replace with your Google Sheet ID
            range: 'Sheet1', // Replace with your sheet name
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            values: [[user_question]],
        }).then(function (response) {
            console.log('Question added to Google Sheets', response);
            // Optionally, you can display a confirmation message to the user here
        }, function (reason) {
            console.error('Error adding question to Google Sheets:', reason.result.error.message);
            // Optionally, you can display an error message to the user here
        });
    }
});



