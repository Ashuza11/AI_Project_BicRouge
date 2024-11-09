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
                ' An LLM Assignment Grading and Feedback Generation System',
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
              'This project is a Large Language Learning Model (LLM) based assignment grading and feedback application designed to support teachers. It uses a combination of Python with FastAPI for the backend, Vite for the frontend, and LLAMA-2 and GPT-3.5 Turbo for the LLM. Additionally, it includes a mobile app built with Flutter.',
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
              leading: Icon(Icons.assignment_add, color: Colors.black),
              title: Text('Assignment Scoring:'),
              subtitle: Text(
                'The application uses LLM to score assignments based on predefined criteria.',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
              ),
            ),
            const ListTile(
              leading: Icon(Icons.feedback_rounded, color: Colors.black),
              title: Text('Feedback Generation'),
              subtitle: Text(
                'It also generates feedback for each assignment, providing students with valuable insights into their performance.',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
              ),
            ),
            const ListTile(
              leading: Icon(Icons.support_agent_rounded, color: Colors.black),
              title: Text('Teacher Support'),
              subtitle: Text(
                'The application is designed to reduce the workload of teachers by automating the scoring and feedback process.',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
              ),
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
              title: const Text('Email'),
              onTap: () async {
                final Uri url = Uri.parse('girish.sonune@gmail.com');
                if (!await launchUrl(url)) {
                  throw Exception('Could not launch $url');
                }
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
            const SizedBox(
              height: 100,
            ),
            Center(child: Text("Made By ❤️Girish")),
          ],
        ),
      ),
    );
  }
}
