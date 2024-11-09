import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class AboutUsPage extends StatelessWidget {
  const AboutUsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('About Us'),
        backgroundColor: Colors.white,
        elevation: 1,
        iconTheme: const IconThemeData(color: Colors.black),
        titleTextStyle: const TextStyle(
          color: Colors.black,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            // App Logo
            Center(
              child: Image.asset(
                'assets/logo.png', // Make sure this path matches your logo's path
                height: 100,
                width: 100,
              ),
            ),
            const SizedBox(height: 16.0),

            // App Name and Short Tagline
            const Center(
              child: Text(
                'BicRouge',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 8.0),
            const Center(
              child: Text(
                'Online Study App',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
              ),
            ),
            const SizedBox(height: 24.0),

            // About Us Description
            const Text(
              'About Us',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8.0),
            const Text(
              'Our app is designed to make document scanning easy and accessible for everyone. With a user-friendly interface and advanced image processing, you can scan, save, and manage your documents effortlessly on the go.',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 24.0),

            // Key Features
            const Text(
              'Key Features',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8.0),
            const ListTile(
              leading: Icon(Icons.camera_alt, color: Colors.black),
              title: Text('Quick Document Scanning'),
            ),
            const ListTile(
              leading: Icon(Icons.image, color: Colors.black),
              title: Text('Gallery Import Support'),
            ),
            const ListTile(
              leading: Icon(Icons.share, color: Colors.black),
              title: Text('Easy Document Sharing'),
            ),
            const ListTile(
              leading: Icon(Icons.edit, color: Colors.black),
              title: Text('Rename and Organize Documents'),
            ),
            const SizedBox(height: 24.0),

            // Contact Information
            const Text(
              'Contact Us',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8.0),
            const Text(
              'If you have any questions, suggestions, or feedback, feel free to reach out to us!',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 8.0),
            ListTile(
              leading: const Icon(Icons.email, color: Colors.black),
              title: const Text('girish.sonune@gmail.com'),
              onTap: () {
                // Logic to send an email
              },
            ),
            const SizedBox(height: 8.0),
            ListTile(
              leading: const Icon(Icons.link, color: Colors.black),
              title: const Text('LinkedIn'),
              onTap: () async {
                final Uri url = Uri.parse(
                    'https://www.linkedin.com/in/girish-sonune-7a7090255');
                if (!await launchUrl(url)) {
                  throw Exception('Could not launch $url');
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}
