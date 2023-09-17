document.addEventListener("DOMContentLoaded", function () {
    const answerElement = document.getElementById("answer");
    const questionForm = document.getElementById("question-form");

    questionForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const questionInput = document.getElementById("question");
        const question = questionInput.value;

        if (question.trim() !== "") {
            // Send the question to the server or store it for later comparison.
            // You can add your storage logic here.
            questionInput.value = ""; // Clear the input field
        }
    });
});

