import 'package:bicrouge/auth.dart'; // Import AuthService
import 'package:bicrouge/pages/course_available_page.dart';
import 'package:bicrouge/pages/login_page_teacher.dart';
import 'package:bicrouge/pages/signup_page_student.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class LoginPageStudent extends StatefulWidget {
  const LoginPageStudent({super.key});

  @override
  _LoginPageStudentState createState() => _LoginPageStudentState();
}

class _LoginPageStudentState extends State<LoginPageStudent> {
  final AuthService _authService = AuthService(); // Initialize AuthService
  String selectedRole = 'Student';
  bool isPasswordVisible = false;
  String email = '';
  String password = '';
  String errorMessage = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Image.asset('assets/logo.png', height: 40),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: ListView(
          // mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Welcome back',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Join Bic Rouge for free as a',
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 25),

            // Student / Teacher Switch
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildRoleButton('Student'),
                const SizedBox(width: 10),
                _buildRoleButton('Teacher'),
              ],
            ),
            const SizedBox(height: 25),

            // Email input
            TextField(
              onChanged: (value) => setState(() => email = value),
              decoration: const InputDecoration(
                labelText: 'Email address',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),

            // Password input
            TextField(
              onChanged: (value) => setState(() => password = value),
              // obscureText: true,
              obscureText: !isPasswordVisible,
              decoration: InputDecoration(
                labelText: 'Password',
                border: const OutlineInputBorder(),
                suffixIcon: IconButton(
                  icon: Icon(
                    isPasswordVisible ? Icons.visibility : Icons.visibility_off,
                  ),
                  onPressed: () {
                    setState(() {
                      isPasswordVisible = !isPasswordVisible;
                    });
                  },
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Continue button for sign-in
            ElevatedButton(
              onPressed: () async {
                User? user =
                    await _authService.signInWithEmailPassword(email, password);
                if (user != null) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const CoursesPage(
                            // email: '',
                            )),
                  );
                } else {
                  setState(() => errorMessage =
                      'Sign-in failed. Please check your credentials.');
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                minimumSize: const Size(double.infinity, 50),
              ),
              child: const Text('Continue', style: TextStyle(fontSize: 16)),
            ),
            const SizedBox(height: 10),

            // Display error message
            if (errorMessage.isNotEmpty)
              Text(
                errorMessage,
                style: const TextStyle(color: Colors.red),
              ),
            const SizedBox(height: 10),

            // Sign up link
            TextButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => SignupPage()),
                );
              },
              child: const Text("Don't have an account? Sign Up"),
            ),
            const SizedBox(height: 20),

            // OR divider
            const Row(
              children: [
                Expanded(child: Divider()),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10.0),
                  child: Text('OR'),
                ),
                Expanded(child: Divider()),
              ],
            ),
            const SizedBox(height: 20),

            // Social login buttons
            _buildSocialButton('Continue with Google', Colors.white,
                'assets/logo_google.png', Colors.black),
            const SizedBox(height: 10),
            _buildSocialButton('Continue with Microsoft Account', Colors.white,
                'assets/logo_microsoft.png', Colors.black),
            const SizedBox(height: 10),
            _buildSocialButton('Continue with Facebook', Colors.blue[800]!,
                'assets/logo_facebook.png', Colors.white),
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
            MaterialPageRoute(builder: (context) => LoginPageTeacher()),
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

  // Helper method for social login buttons
  Widget _buildSocialButton(
      String text, Color bgColor, String iconPath, Color textColor) {
    return ElevatedButton.icon(
      onPressed: () {
        // Add social authentication logic here
      },
      icon: Image.asset(
        iconPath,
        height: 24,
        width: 24,
      ),
      label: Text(
        text,
        style: TextStyle(color: textColor),
      ),
      style: ElevatedButton.styleFrom(
        foregroundColor: textColor,
        backgroundColor: bgColor,
        minimumSize: const Size(double.infinity, 50),
        side: BorderSide(color: Colors.grey[300]!),
      ),
    );
  }
}
