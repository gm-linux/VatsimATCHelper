### VATSIM Flight Plan & ATC Comms Assistant

Welcome to the **VATSIM Flight Plan & ATC Comms Assistant** project! This web application is designed to assist virtual pilots with generating flight plans, ATC communication scripts, and more, specifically tailored for use with the VATSIM network.

### Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Using GitHub Pages](#using-github-pages)
  - [Installation](#installation)
- [Usage](#usage)
  - [Main Interface](#main-interface)
  - [Flight Plan Form](#flight-plan-form)
  - [METAR Information](#metar-information)
  - [Script Generation](#script-generation)
  - [Aircraft Search](#aircraft-search)
  - [Dark Mode](#dark-mode)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

### Features

- **Flight Plan Form**: Easily input departure and arrival information, including METAR data retrieval.
- **ATC Communication Script Generation**: Automatically generate scripts for various ATC interactions such as clearance delivery, ground, tower, and more.
- **Aircraft Search**: Quickly find aircraft by ICAO code or description.
- **Real-time Local and Zulu Time**: Displays both local and UTC (Zulu) time for quick reference.
- **Dark Mode**: Switch between light and dark themes for better visibility during different times of the day.

### Getting Started

#### Prerequisites

Before you begin, ensure you have the following installed on your system:

- A modern web browser (Google Chrome, Firefox, Safari, etc.)
- Internet connection (for fetching METAR data)

#### Using GitHub Pages

You can also access this application directly through GitHub Pages. The project is hosted at the following URL:

- **[VATSIM Flight Plan & ATC Comms Assistant on GitHub Pages](https://gm-linux.github.io/VatsimATCHelper/)**

Simply click the link, and you can start using the application without needing to download or install anything!

#### Installation

If you prefer to run the application locally, follow these steps:

1. **Clone the Repository**: Start by cloning this repository to your local machine using:
   ```bash
   git clone https://github.com/yourusername/VatsimATCHelper.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd VatsimATCHelper
   ```

3. **Open `index.html` in Your Browser**: Simply open the `index.html` file in your preferred web browser to start using the application.

### Usage

#### Main Interface

Upon opening the application, you are greeted with the main interface that contains the following elements:

- **Navigation Menu**: Contains links to upcoming features like the Takeoff and Landing calculators, a Dark Mode toggle, and time displays.
- **Flight Plan & ATC Comms**: The main section where you can input your flight details and generate communication scripts.

#### Flight Plan Form

- **Callsign**: Input your aircraft’s callsign (max 10 characters).
- **Departure and Arrival Information**: Enter the ICAO codes for your departure and arrival airports. The METAR data will be fetched automatically upon losing focus from the input field.
- **Weather and METAR Data**: Displays the current METAR data for your departure and arrival airports, including wind, visibility, sky conditions, temperature, and altimeter settings.

#### METAR Information

- **Fetching METAR**: When you input an ICAO code for your departure or arrival airport, the METAR data is fetched from the VATSIM network and displayed. You can also refresh this data manually.

#### Script Generation

- **Generate Delivery Script**: After inputting the necessary flight details, click on "Generate Delivery Script" to create a communication script.
- **ATC Type**: Select the ATC service type (Delivery, Ground, Tower, etc.) you are communicating with.
- **Generated Script**: The script will be displayed, ready for you to use in your VATSIM communications.

#### Aircraft Search

- **Search Field**: Type to search for aircraft by ICAO code or description.
- **Dropdown Selection**: Select the desired aircraft from the dropdown, which will dynamically update based on your search input.

#### Dark Mode

- **Toggle**: Use the "Dark Mode" button in the navbar to switch between light and dark themes. The interface smoothly transitions to the selected mode, enhancing visibility during different times of the day.

### Project Structure

Here’s a brief overview of the project structure:

```
/VatsimATCHelper
│
├── LICENSE           # MIT License File
├── README.md         # Readme file containing information
├── index.html        # Main HTML file
├── styles.css        # Styling for the application
├── scripts.js        # Main JavaScript functionality
├── time.js           # JavaScript file for managing time displays
└── /data
    ├── airports.csv  # Airport data in CSV format
    └── aircraft.json # Aircraft data in JSON format
```

### Contributing

We welcome contributions to improve this project! If you would like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcomed.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
