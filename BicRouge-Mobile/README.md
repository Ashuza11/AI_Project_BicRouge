# Bicrouge📄

A Flutter-based mobile application for scanning, capturing, and managing documents.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Permissions](#permissions)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Features

- 📷 **Capture Documents**: Use the camera to scan and capture document images.
- 📄 **View Scanned Documents**: Display scanned documents in a list with relevant details like size and date.
- 🔍 **Search Documents**: Quickly search for saved documents.
- ⚙️ **Settings**: Configure settings for the camera, including flash and image resolution.

## Getting Started

To run the app, you will need to have Flutter and Dart installed on your machine.

### Prerequisites

- Flutter SDK (>= 2.5.0)
- Dart SDK
- Android Studio or Visual Studio Code

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ashuza11/AI_Project_BicRouge

2. **Install dependencies**
   ```bash
   flutter pub get


3. **Connect your device or start an emulator**


4. **Run the app**
   ```bash
   flutter run



## Usage

Home Screen: Displays a list of captured documents. Tap the camera icon in the bottom navigation bar to access the camera and scan a new document.

Scanning Page: Capture documents using the camera. After capturing, the document is saved and displayed in the main list.

Document Options: Click on the more icon for additional options for each document.


## Permissions

This app requires the following permissions to function correctly:

Camera: To capture document images.

Location: Required if you want location tagging (optional, based on app settings).


Add the following permissions in AndroidManifest.xml:

<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

## Screenshots

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.


2. Create a feature branch: git checkout -b feature-name.


3. Commit your changes: git commit -m 'Add some feature'.


4. Push to the branch: git push origin feature-name.


5. Open a pull request.



## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

Thanks to the Flutter community for providing such an amazing framework for cross-platform development.


---

Feel free to reach out if you encounter any issues or have suggestions for new features.