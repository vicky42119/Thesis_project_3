document.getElementById("generateButton").addEventListener("click", function() {
    const wordInput = document.getElementById("wordInput").value;
    const resultContainer = document.getElementById("resultContainer");

    if (wordInput.trim() === "") {
        alert("Please enter a word.");
        return;
    }

    // Clear previous results
    while (resultContainer.firstChild) {
        resultContainer.removeChild(resultContainer.firstChild);
    }

    const numInstances = Math.floor(Math.random() * 10) + 20; // Generate 50 to 100 instances
    const inputBox = document.getElementById("wordInput");
    const inputBoxRect = inputBox.getBoundingClientRect();

    const fonts = [
        "Times New Roman",
        "Century Gothic",
        "Helvetica",
        "Georgia",
        "Baskerville",
        "Palatino",
        "Garamond",
        "Book Antiqua",
        "Didot",
        "Rockwell",
    ]; // Array of serif and cleaner typefaces

    for (let i = 0; i < numInstances; i++) {
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * (window.innerHeight - inputBoxRect.height); // Prevent words from covering the input box
        const randomFontSize = Math.floor(Math.random() * 1000) + 10; // Random font size between 40 and 100 pixels
        const randomFont = fonts[Math.floor(Math.random() * fonts.length)]; // Random font from the array

        const typographyElement = document.createElement("div");
        typographyElement.style.position = "absolute";

        // Randomly choose orientation (horizontal or vertical)
        const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";

        if (orientation === "horizontal") {
            typographyElement.style.left = randomX + "px";
            typographyElement.style.top = randomY + "px";
        } else {
            typographyElement.style.writingMode = "vertical-lr"; // Set vertical writing mode
            typographyElement.style.left = randomX + "px";
            typographyElement.style.top = randomY + "px";
        }

        typographyElement.style.fontSize = randomFontSize + "px";
        typographyElement.style.color = "black";
        typographyElement.style.fontFamily = randomFont; // Set a random font
        typographyElement.style.zIndex = i; // To control overlay order
        typographyElement.textContent = wordInput;

        // Change the color of overlapping text
        if (i > 0) {
            typographyElement.style.mixBlendMode = "difference"; // Set the blend mode to "difference"
            typographyElement.style.color = "white"; // Change the color of the overlapping part
        }

        resultContainer.appendChild(typographyElement);
    }

    // Randomize the background color of the canvas to a pastel color
    const randomCanvasColor = getRandomPastelColor();
    resultContainer.style.backgroundColor = randomCanvasColor;
});

document.getElementById("resetButton").addEventListener("click", function() {
    const resultContainer = document.getElementById("resultContainer");

    // Clear all generated typography
    while (resultContainer.firstChild) {
        resultContainer.removeChild(resultContainer.firstChild);
    }
});

// Function to get a random pastel color
function getRandomPastelColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Add an event listener to the download button
document.getElementById("downloadButton").addEventListener("click", function() {
    const resultContainer = document.getElementById("resultContainer");

    // Convert the content of the resultContainer to an image
    domtoimage.toBlob(resultContainer).then(function(blob) {
        // Create a temporary anchor element for downloading
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "canvas_image.png";

        // Simulate a click on the anchor element to trigger the download
        a.click();
    });
});




















