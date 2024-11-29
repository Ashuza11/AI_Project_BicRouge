# Bicrouge📄 an LLM Assignment Grading and Feedback Generation System

This is the mobile version of BicRouge, designed to empower teachers in regions without access to computers. It enables them to easily grade exam papers by simply scanning them with their mobile devices.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Permissions](#permissions)
- [Folder Structure](#folder-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

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
   git clone https://github.com/yourusername/bicrouge.git
   cd bicrouge

   ```

2. **Install dependencies**

   ```bash
   flutter pub get

   ```

3. **Connect your device or start an emulator**

4. **Run the app**
   ```bash
   flutter run
   ```

## Usage

- **Home Screen:** Displays a list of captured documents. Tap the camera icon in the bottom navigation bar to access the camera and scan a new document.
- **Scanning Page:** Capture documents using the camera. After capturing, the document is saved and displayed in the main list.
- **Document Options:** Click on the more icon for additional options for each document.

## Permissions

This app requires the following permissions to function correctly:

- **Camera:** To capture document images.
- **Location:** Required if you want location tagging (optional, based on app settings).

Add the following permissions in AndroidManifest.xml:

    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

## Folder Structure

Here’s an overview of the project structure:

    bicrouge/
    ├── android/                 # Android native code
    ├── assets/                  # Images and assets
    ├── ios/                     # iOS native code
    ├── lib/                     # Flutter application code
    │   ├── main.dart            # Main entry point of the app
    │   ├── pages/               # App screens (e.g., scanning page, document list)
    │   ├── widgets/             # Reusable widgets
    │   ├── utils/               # Utility functions and helpers
    └── pubspec.yaml             # Project configuration and dependencies

## Screenshots

Home Screen Scanning Screen Document List

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
