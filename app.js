const BLOB_API_URL = "http://ryeland.pouncelight.games/v1/blob/";

async function fetchAndDisplayLangs() {
  try {
    // Step 1: Fetch the events JSON
    const eventsResponse = await fetch("/events", {
      method: "GET",
      mode: "cors", // Enable CORS
      headers: {
        Accept: "application/json", // Set headers if needed
      },
    });

    if (!eventsResponse.ok) {
      throw new Error(`HTTP error! status: ${eventsResponse.status}`);
    }

    const eventsData = await eventsResponse.json();
    // Debugging the response structure
    console.log("Events API Response:", eventsData);

    // Access the CID from the first event in the 'events' array
    const cid = eventsData.events[0].cid;
    if (!cid) throw new Error("CID not found");
    console.log("CID found:", cid);

    // Step 2: Fetch the zip file using the CID
    const blobResponse = await fetch(`${BLOB_API_URL}${cid}`, {
      method: "GET",
      mode: "cors", // Enable CORS
      headers: {
        Accept: "application/zip", // Set headers if needed
      },
    });

    if (!blobResponse.ok) {
      throw new Error(`HTTP error! status: ${blobResponse.status}`);
    }

    const blob = await blobResponse.blob();

    // Step 3: Unzip the file using JSZip
    const zip = await JSZip.loadAsync(blob);

    // Fetch langs.json
    const langsJson = await zip.file("langs.json").async("string");
    const langsArray = JSON.parse(langsJson);

    // Fetch meta.json
    const metaJson = await zip.file("meta.json").async("string");
    const metaData = JSON.parse(metaJson);

    // Set background based on the state.glade value
    setBackground(metaData.state.glade);

    // Initialize the language dropdown and display
    setupLanguageSelector(langsArray);
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

function setBackground(gladeState) {
  const body = document.body;
  let backgroundImage = "";

  // Set the background image based on the glade state
  switch (gladeState) {
    case "Summer":
      backgroundImage = 'url("assets/summer.jpg")';
      break;
    case "Winter":
      backgroundImage = 'url("assets/winter.jpg")';
      break;
    case "Flowery":
      backgroundImage = 'url("assets/flowery.jpg")';
      break;
    case "Autumn":
      backgroundImage = 'url("assets/autumn.jpg")';
      break;
    case "Olden":
      backgroundImage = 'url("assets/olden.jpg")';
      break;
    default:
      backgroundImage = 'url("assets/default.jpg")'; // Fallback image
  }

  // Apply the background image to the body
  body.style.backgroundImage = backgroundImage;
  body.style.height = "100%";
}

function setupLanguageSelector(langsArray) {
  const selectElement = document.getElementById("lang-select");
  const outputElement = document.getElementById("langs-output");

  // List of language options (you can adjust these names as needed)
  const languageOptions = [
    "English",
    "German",
    "Spanish",
    "French",
    "Italian",
    "Japanese",
    "Korean",
    "Polish",
    "Portuguese",
    "Russian",
    "Swedish",
    "Turkish",
    "Ukrainian",
    "Chinese",
  ];

  // Populate the dropdown with language options
  languageOptions.forEach((language, index) => {
    const option = document.createElement("option");
    option.value = index; // Use the index to reference the language in the array
    option.textContent = language;
    selectElement.appendChild(option);
  });

  // Display the default language (English, first item in array)
  outputElement.textContent = langsArray[0];

  // Add event listener to update the text when language changes
  selectElement.addEventListener("change", function () {
    const selectedLangIndex = selectElement.value;
    outputElement.textContent = langsArray[selectedLangIndex];
  });
}

// Call the function to fetch data and initialize the page
fetchAndDisplayLangs();
