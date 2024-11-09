import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:bicrouge/auth.dart'; // Import the AuthService
import 'signup_page_student.dart';

class SignupPageTeacher extends StatefulWidget {
  const SignupPageTeacher({super.key});

  @override
  _SignupPageTeacherState createState() => _SignupPageTeacherState();
}

class _SignupPageTeacherState extends State<SignupPageTeacher> {
  bool isStudent = false;
  late String selectedInstitution;
  final AuthService _authService = AuthService();
  String email = '';
  String password = '';
  String name = '';
  String postName = '';
  String lastName = '';
  String errorMessage = '';

  @override
  void initState() {
    super.initState();
    selectedInstitution = 'Institution 1';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Image.asset('assets/logo.png', height: 40),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            const Text(
              'Create an account Teacher',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text('Join Bic Rouge for free as a'),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SignupPage()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isStudent ? Colors.red : Colors.grey,
                    ),
                    child: const Text('Student'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() {
                        isStudent = false;
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isStudent ? Colors.grey : Colors.red,
                    ),
                    child: const Text('Teacher'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextField(
              onChanged: (value) => setState(() => email = value),
              decoration: const InputDecoration(
                labelText: 'Address e-mail*',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              onChanged: (value) => setState(() => name = value),
              decoration: const InputDecoration(
                labelText: 'Name*',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              onChanged: (value) => setState(() => lastName = value),
              decoration: const InputDecoration(
                labelText: 'Last name',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              onChanged: (value) => setState(() => postName = value),
              decoration: const InputDecoration(
                labelText: 'Postname*',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: selectedInstitution,
              hint: const Text('Select Institution*'),
              onChanged: (String? newValue) {
                if (newValue != null) {
                  setState(() {
                    selectedInstitution = newValue;
                  });
                }
              },
              items: <String>['Institution 1', 'Institution 2', 'Institution 3']
                  .map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              onChanged: (value) => setState(() => password = value),
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Password*',
                border: OutlineInputBorder(),
                suffixIcon: Icon(Icons.visibility),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Passwords must be at least 8 characters long and include a combination of letters, numbers, and other special characters.',
              style: TextStyle(fontSize: 12),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () async {
                User? user = await _authService.signUpWithEmailPassword(email, password);
                if (user != null) {
                  // Navigate to a success screen or the next step in onboarding
                } else {
                  setState(() {
                    errorMessage = 'Registration failed. Please check your details.';
                  });
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                minimumSize: const Size(double.infinity, 50),
              ),
              child: const Text('Continue'),
            ),
            const SizedBox(height: 10),
            if (errorMessage.isNotEmpty)
              Text(
                errorMessage,
                style: const TextStyle(color: Colors.red),
              ),
            const SizedBox(height: 16),
            Center(
              child: TextButton(
                onPressed: () {
                  // Handle login navigation
                },
                child: const Text('Already have an account? Login'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
