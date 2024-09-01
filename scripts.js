let airportsData = [];
let airportsMap = {};

const modal = document.getElementById('script-modal');
const btn = document.getElementById('generate-script-btn');
const span = document.getElementsByClassName('close')[0];
const submitBtn = document.getElementById('submit-script-btn');
const scriptOutput = document.getElementById('generated-script');

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
    loadCSVFiles(); // Load airports data
    loadOptions();  // Load A-Z options dynamically
    updateClock();  // Start clock for local and Zulu time
    loadAircraftOptions();
    updateAircraftDescription();
});

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

function loadAircraftOptions() {
    fetch('data/aircraft.json')
        .then(response => response.json())
        .then(data => {
            aircraftData = data; // Save full list for filtering
            populateAircraftDropdown(aircraftData);
        })
        .catch(error => console.error('Error loading aircraft options:', error));
}

function validateFields() {
    const callsign = document.getElementById('callsign');
    const standNumber = document.getElementById('stand-number');
    const aircraft = document.getElementById('aircraft');
    const departureAirport = document.getElementById('departure-airport-name').textContent;
    const arrivalAirport = document.getElementById('arrival-airport-name').textContent;
    const atisInfo = document.getElementById('information');

    let isValid = true;

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


// Open the modal if fields are valid
btn.onclick = function() {
    if (validateFields()) {
        modal.style.display = 'block';
    }
}

// Close the modal
span.onclick = function() {
    modal.style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Generate the delivery script
submitBtn.onclick = function() {
    const callsign = document.getElementById('callsign').value;
    const atcType = document.getElementById('atc-type').value;
    const standNumber = document.getElementById('stand-number').value;
    const aircraft = document.getElementById('aircraft').value;
    const departureAirport = document.getElementById('departure-airport-name').textContent;
    const arrivalAirport = document.getElementById('arrival-airport-name').textContent;
    const atisInfo = document.getElementById('information').value;

    // Convert relevant fields to phonetic
    const phoneticCallsign = toPhonetic(callsign);
    const phoneticAtisInfo = toPhonetic(atisInfo);

    const script = `${departureAirport} ${atcType}, this is ${phoneticCallsign} at Stand ${standNumber}, ${aircraft} requesting IFR clearance to ${arrivalAirport} with information ${phoneticAtisInfo}.`;

    scriptOutput.textContent = script;
    modal.style.display = 'none';
}


function populateAircraftDropdown(aircraftList) {
    const aircraftSelect = document.getElementById('aircraft');
    aircraftSelect.innerHTML = '<option value="">Select Aircraft</option>'; // Reset dropdown

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
    const filteredAircraft = aircraftData.filter(aircraft => 
        aircraft.icaoCode.toLowerCase().includes(searchQuery) ||
        aircraft.description.toLowerCase().includes(searchQuery)
    );
    populateAircraftDropdown(filteredAircraft);
});

function updateAircraftDescription() {
    const selectedIcao = document.getElementById('aircraft').value;
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
            } else {
                document.getElementById('aircraft-description').textContent = 'Unknown Aircraft';
            }
        })
        .catch(error => console.error('Error updating aircraft description:', error));
}

function loadCSVFiles() {
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

function getMETAR(inputId) {
    const icaoCode = document.getElementById(inputId).value.trim().toUpperCase();
    const metarUrl = `https://metar.vatsim.net/metar.php?id=${icaoCode}`;

    if (icaoCode) {
        fetch(metarUrl)
            .then((response) => response.text())
            .then((metar) => {
                if (!metar.includes("No METAR found")) {
                    populateFieldsFromMETAR(metar, inputId);
                } else {
                    document.getElementById(`${inputId}-metar`).textContent = "Failed to load METAR";
                }
            })
            .catch((error) => console.error("Failed to fetch METAR:", error));
    }
}

function populateFieldsFromMETAR(metar, inputId) {
    const icaoCode = document.getElementById(inputId).value.toUpperCase();
    const airportName = airportsMap[icaoCode] || "Unknown Airport";

    document.getElementById(`${inputId}-airport-name`).textContent = airportName;
    document.getElementById(`${inputId}-metar`).textContent = `${icaoCode} METAR: ${metar}`;

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
    }
    if (visibilityMatch) {
        document.getElementById(`visibility-${prefix}`).value = visibilityMatch[1] + " SM";
    }
    if (skyConditionMatch) {
        document.getElementById(`sky-${prefix}`).value = skyConditionMatch[1];
    }
    if (tempDewMatch) {
        document.getElementById(`temp-${prefix}`).value = tempDewMatch[1];
        document.getElementById(`dew-${prefix}`).value = tempDewMatch[2];
    }
    if (altimeterMatch) {
        document.getElementById(`altimeter-${prefix}`).value = altimeterMatch[1];
    }
}

function loadOptions() {
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
}
