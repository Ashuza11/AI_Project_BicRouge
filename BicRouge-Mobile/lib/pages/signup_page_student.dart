import 'package:bicrouge/pages/login_page_student.dart';
import 'package:flutter/material.dart';
import 'package:bicrouge/auth.dart'; // Import AuthService
import 'package:bicrouge/pages/signup_page_teacher.dart'; // Import the teacher signup page

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  _SignupPageState createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final AuthService _authService = AuthService(); // Initialize AuthService
  String selectedRole = 'Student';
  bool isStudent = true;
  String email = '';
  String password = '';
  String name = '';
  String postName = '';
  String errorMessage = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Image.asset('assets/logo.png', height: 40),
        backgroundColor: Colors.grey[100],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            const Text(
              'Create an account',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text('Join Bic Rouge for free as a'),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildRoleButton('Student'),
                const SizedBox(width: 10),
                _buildRoleButton('Teacher'),
              ],
            ),
            const SizedBox(height: 25),
            TextField(
              onChanged: (value) => setState(() => email = value),
              decoration: const InputDecoration(
                labelText: 'Email address*',
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
              onChanged: (value) => setState(() => postName = value),
              decoration: const InputDecoration(
                labelText: 'Postname*',
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
            const SizedBox(height: 25),
            ElevatedButton(
              onPressed: () async {
                // Call the signup function from AuthService
                var result =
                    await _authService.signUpWithEmailPassword(email, password);
                if (result != null) {
                  Navigator.pop(
                      context); // Navigate back or show a success message
                } else {
                  setState(() {
                    errorMessage = 'Registration failed. Please try again.';
                  });
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                minimumSize: const Size(double.infinity, 50),
              ),
              child: const Text(
                'Continue',
                style: TextStyle(color: Colors.white),
              ),
            ),
            const SizedBox(height: 16),
            if (errorMessage.isNotEmpty)
              Text(
                errorMessage,
                style: const TextStyle(color: Colors.red),
              ),
            Center(
              child: TextButton(
                onPressed: () {
                  // Navigator.pop(context); // Navigate back to login
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => LoginPageStudent()),
                  );
                },
                child: const Text('Already have an account? Login'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Helper method for role selection buttons
  Widget _buildRoleButton(String role) {
    bool isSelected = role == selectedRole;
    return ElevatedButton(
      onPressed: () {
        setState(() {
          selectedRole = role;
        });

        if (role == 'Teacher') {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => SignupPageTeacher()),
          );
        }
      },
      style: ElevatedButton.styleFrom(
        foregroundColor: isSelected ? Colors.white : Colors.black,
        backgroundColor: isSelected ? Colors.red : Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        side: const BorderSide(color: Colors.red),
        minimumSize: const Size(150, 50),
      ),
      child: Text(role),
    );
  }
}
