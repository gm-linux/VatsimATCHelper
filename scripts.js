let airportsData = [];
let airportsMap = {};

// Variables for the Script Model
const scriptModel = document.getElementById('script-model');
const generateScriptBtn = document.getElementById('generate-script-btn');
const closeScriptBtn = document.getElementsByClassName('close')[0];
const submitScriptBtn = document.getElementById('submit-script-btn');
const scriptOutput = document.getElementById('generated-script');

// Debugging output
console.log("Script and Feedback Models Initialized");

// Script Model Functionality
generateScriptBtn.onclick = function() {
    console.log("Generate Script Button clicked");
    if (validateFields()) {
        scriptModel.style.display = 'block';
        console.log("Script Model opened");
    }
}

closeScriptBtn.onclick = function() {
    scriptModel.style.display = 'none';
    console.log("Script Model closed");
}

window.onclick = function(event) {
    if (event.target == scriptModel) {
        scriptModel.style.display = 'none';
        console.log("Script Model closed by clicking outside");
    }
}

submitScriptBtn.onclick = function() {
    console.log("Submit Script Button clicked");
    const callsign = document.getElementById('callsign').value;
    const atcType = document.getElementById('atc-type').value;
    const standNumber = document.getElementById('stand-number').value;
    const aircraft = document.getElementById('aircraft').value;
    const departureAirport = document.getElementById('departure-airport-name').textContent;
    const arrivalAirport = document.getElementById('arrival-airport-name').textContent;
    const atisInfo = document.getElementById('information').value;

    // No longer converting the callsign to phonetic
    const phoneticAtisInfo = toPhonetic(atisInfo);

    const script = `${departureAirport} ${atcType}, this is ${callsign} at Stand ${standNumber}, ${aircraft} requesting IFR clearance to ${arrivalAirport} with information ${phoneticAtisInfo}.`;

    scriptOutput.textContent = script;
    scriptModel.style.display = 'none';
    console.log("Script generated and Model closed");
}

// Utility functions and event listeners
function validateFields() {
    const callsign = document.getElementById('callsign');
    const standNumber = document.getElementById('stand-number');
    const aircraft = document.getElementById('aircraft');
    const departureAirport = document.getElementById('departure-airport-name').textContent;
    const arrivalAirport = document.getElementById('arrival-airport-name').textContent;
    const atisInfo = document.getElementById('information');

    let isValid = true;

    console.log("Validating fields...");

    if (!callsign.value) {
        flashRed(callsign);
        console.log('Callsign is missing');
        isValid = false;
    }
    if (!aircraft.value) {
        flashRed(aircraft);
        console.log('Aircraft is missing');
        isValid = false;
    }
    if (!departureAirport) {
        flashRed(document.getElementById('departure'));
        console.log('Departure Airport is missing');
        isValid = false;
    }
    if (!arrivalAirport) {
        flashRed(document.getElementById('arrival'));
        console.log('Arrival Airport is missing');
        isValid = false;
    }
    if (!atisInfo.value) {
        flashRed(atisInfo);
        console.log('ATIS Info is missing');
        isValid = false;
    }

    console.log('Validation result:', isValid);
    return isValid;
}

function flashRed(field) {
    field.style.border = '2px solid red';
    setTimeout(() => {
        field.style.border = '';
    }, 1500);
}

function toPhonetic(str) {
    return str.toUpperCase().split('').map(char => {
        return phoneticAlphabet[char] || char;
    }).join(' ');
}

const phoneticAlphabet = {
    'A': 'Alpha',
    'B': 'Bravo',
    'C': 'Charlie',
    'D': 'Delta',
    'E': 'Echo',
    'F': 'Foxtrot',
    'G': 'Golf',
    'H': 'Hotel',
    'I': 'India',
    'J': 'Juliet',
    'K': 'Kilo',
    'L': 'Lima',
    'M': 'Mike',
    'N': 'November',
    'O': 'Oscar',
    'P': 'Papa',
    'Q': 'Quebec',
    'R': 'Romeo',
    'S': 'Sierra',
    'T': 'Tango',
    'U': 'Uniform',
    'V': 'Victor',
    'W': 'Whiskey',
    'X': 'X-ray',
    'Y': 'Yankee',
    'Z': 'Zulu',
    '0': 'Zero',
    '1': 'One',
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine'
};

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
    loadCSVFiles(); // Load airports data
    loadOptions();  // Load A-Z options dynamically
    updateClock();  // Start clock for local and Zulu time
    loadAircraftOptions();
    updateAircraftDescription();
});

function loadAircraftOptions() {
    fetch('data/aircraft.json')
        .then(response => response.json())
        .then(data => {
            aircraftData = data; // Save full list for filtering
            populateAircraftDropdown(aircraftData);
            console.log("Aircraft data loaded");
        })
        .catch(error => console.error('Error loading aircraft options:', error));
}

function populateAircraftDropdown(aircraftList) {
    const aircraftSelect = document.getElementById('aircraft');
    aircraftSelect.innerHTML = '<option value="">Select Aircraft</option>'; // Reset dropdown

    console.log("Populating aircraft dropdown with", aircraftList.length, "options");

    if (aircraftList.length === 1) {
        const aircraft = aircraftList[0];
        const option = document.createElement('option');
        option.value = aircraft.icaoCode;
        option.text = `${aircraft.icaoCode} - ${aircraft.description}`;
        option.selected = true; // Automatically select the single option
        aircraftSelect.appendChild(option);

        // Optionally, you can also automatically update the description
        updateAircraftDescription();
    } else {
        aircraftList.forEach(aircraft => {
            const option = document.createElement('option');
            option.value = aircraft.icaoCode;
            option.text = `${aircraft.icaoCode} - ${aircraft.description}`;
            aircraftSelect.appendChild(option);
        });
    }
}

document.getElementById('aircraft-search').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    console.log("Searching for aircraft with query:", searchQuery);
    const filteredAircraft = aircraftData.filter(aircraft => 
        aircraft.icaoCode.toLowerCase().includes(searchQuery) ||
        aircraft.description.toLowerCase().includes(searchQuery)
    );
    populateAircraftDropdown(filteredAircraft);
});

function updateAircraftDescription() {
    const selectedIcao = document.getElementById('aircraft').value;
    console.log("Updating aircraft description for:", selectedIcao);
    if (!selectedIcao) {
        document.getElementById('aircraft-description').textContent = '';
        return;
    }

    fetch('data/aircraft.json')
        .then(response => response.json())
        .then(data => {
            const aircraft = data.find(ac => ac.icaoCode === selectedIcao);
            if (aircraft) {
                document.getElementById('aircraft-description').textContent = aircraft.description;
                console.log("Aircraft description updated:", aircraft.description);
            } else {
                document.getElementById('aircraft-description').textContent = 'Unknown Aircraft';
                console.log("Unknown aircraft");
            }
        })
        .catch(error => console.error('Error updating aircraft description:', error));
}

function loadCSVFiles() {
    console.log("Loading airports data...");
    Papa.parse("data/airports.csv", {
        download: true,
        header: true,
        complete: function (results) {
            airportsData = results.data;
            console.log("Airports CSV loaded:", airportsData.length, "rows");
            mapAirportsData();
        },
    });
}

function mapAirportsData() {
    airportsMap = {};
    airportsData.forEach((airport) => {
        airportsMap[airport.ident] = airport.name;
    });
    console.log("Airport data mapping complete with entries:", Object.keys(airportsMap).length);
}

let previousDepartureMETAR = '';
let previousArrivalMETAR = '';

function getMETAR(inputId) {
    const icaoCode = document.getElementById(inputId).value.trim().toUpperCase();
    const metarUrl = `https://metar.vatsim.net/metar.php?id=${icaoCode}`;
    console.log("Fetching METAR for:", icaoCode);

    if (icaoCode) {
        document.getElementById('metar-loading').style.display = 'block';
        fetch(metarUrl)
            .then((response) => response.text())
            .then((metar) => {
                document.getElementById('metar-loading').style.display = 'none';
                
                let previousMETAR = (inputId === 'departure') ? previousDepartureMETAR : previousArrivalMETAR;

                if (!metar.includes("No METAR found")) {
                    console.log("METAR fetched:", metar);
                    populateFieldsFromMETAR(metar, inputId);

                    if (metar === previousMETAR) {
                        document.getElementById(`${inputId}-metar-info-message`).textContent = "METAR has not changed.";
                        document.getElementById(`${inputId}-metar-info-message`).style.color = "blue";
                    } else {
                        document.getElementById(`${inputId}-metar-info-message`).textContent = "METAR has been updated.";
                        document.getElementById(`${inputId}-metar-info-message`).style.color = "green";
                        
                        // Update the stored previous METAR data
                        if (inputId === 'departure') {
                            previousDepartureMETAR = metar;
                        } else {
                            previousArrivalMETAR = metar;
                        }
                    }
                } else {
                    document.getElementById(`${inputId}-metar`).textContent = "Failed to load METAR";
                    console.log("Failed to load METAR for:", icaoCode);
                }
            })
            .catch((error) => {
                document.getElementById('metar-loading').style.display = 'none';
                console.error("Failed to fetch METAR:", error);
            });
    }
}

function populateFieldsFromMETAR(metar, inputId) {
    const icaoCode = document.getElementById(inputId).value.toUpperCase();
    const airportName = airportsMap[icaoCode] || "Unknown Airport";
    console.log("Populating fields for:", icaoCode, "with METAR:", metar);

    document.getElementById(`${inputId}-airport-name`).textContent = airportName;
    document.getElementById(`${inputId}-metar`).textContent = `${metar}`;

    if (inputId === 'arrival') {
        document.getElementById('cleared-to').value = airportName;
    }

    const prefix = (inputId === 'departure') ? 'departure' : 'arrival';

    const windMatch = metar.match(/(\d{3})(\d{2})KT/);
    const visibilityMatch = metar.match(/(\d{1,2})SM/);
    const skyConditionMatch = metar.match(/(CLR|FEW|SCT|BKN|OVC)\d{3}/);
    const tempDewMatch = metar.match(/(\d{2})\/(\d{2})/);
    const altimeterMatch = metar.match(/A(\d{4})/);

    if (windMatch) {
        document.getElementById(`wind-direction-${prefix}`).value = windMatch[1];
        document.getElementById(`wind-speed-${prefix}`).value = windMatch[2];
        console.log("Wind data populated:", windMatch[1], windMatch[2]);
    }
    if (visibilityMatch) {
        document.getElementById(`visibility-${prefix}`).value = visibilityMatch[1] + " SM";
        console.log("Visibility data populated:", visibilityMatch[1]);
    }
    if (skyConditionMatch) {
        document.getElementById(`sky-${prefix}`).value = skyConditionMatch[1];
        console.log("Sky condition data populated:", skyConditionMatch[1]);
    }
    if (tempDewMatch) {
        document.getElementById(`temp-${prefix}`).value = tempDewMatch[1];
        document.getElementById(`dew-${prefix}`).value = tempDewMatch[2];
        console.log("Temp/Dew data populated:", tempDewMatch[1], tempDewMatch[2]);
    }
    if (altimeterMatch) {
        document.getElementById(`altimeter-${prefix}`).value = altimeterMatch[1];
        console.log("Altimeter data populated:", altimeterMatch[1]);
    }
}

function loadOptions() {
    console.log("Loading A-Z options...");
    const options = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const selectFields = document.querySelectorAll('select[name="information"]');

    selectFields.forEach(select => {
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });
    });
}

function updateClock() {
    console.log("Starting clock...");
    const localTimeEl = document.getElementById("local-time");
    const zuluTimeEl = document.getElementById("zulu-time");

    setInterval(() => {
        const now = new Date();
        const localTime = now.toLocaleTimeString();
        const zuluTime = now.toISOString().substr(11, 5);

        localTimeEl.textContent = `Local Time: ${localTime}`;
        zuluTimeEl.textContent = `Zulu Time: ${zuluTime}`;
    }, 1000);
}

function clearForm() {
    document.getElementById("flight-plan-form").reset();
    document.getElementById("departure-airport-name").textContent = "";
    document.getElementById("arrival-airport-name").textContent = "";
    document.getElementById("departure-metar").textContent = "";
    document.getElementById("arrival-metar").textContent = "";
    console.log("Form cleared");
}

// Smooth Scrolling for Navbar Links
document.querySelectorAll('.navbar-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        console.log("Smooth scrolling to:", this.getAttribute('href'));
    });
});

document.getElementById('refresh-departure-metar-btn').addEventListener('click', function() {
    getMETAR('departure');
    document.getElementById('metar-loading').style.display = 'block';
});

document.getElementById('refresh-arrival-metar-btn').addEventListener('click', function() {
    getMETAR('arrival');
    document.getElementById('metar-loading').style.display = 'block';
});