import 'package:bicrouge/pages/course_available_page.dart';
import 'package:bicrouge/pages/signup_page_student.dart';
import 'package:flutter/material.dart';

class PasswordPage extends StatefulWidget {
  @override
  _PasswordPageState createState() => _PasswordPageState();
}

class _PasswordPageState extends State<PasswordPage> {
  String selectedRole = 'Student';
  bool isPasswordVisible = false;
  String email = "Girish@studentambassadors.com";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Image.asset('assets/logo.png', height: 40),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Title
            Text(
              'Enter your password',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(
              'Join Bic Rouge for free as a',
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 20),

            // Student / Teacher Switch
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildRoleButton('Student'),
                SizedBox(width: 10),
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => CoursesPage(),
                      ),
                    );
                  },
                  child: _buildRoleButton('Teacher'),
                ),
              ],
            ),
            SizedBox(height: 20),

            // Email display and edit button
            Row(
              children: [
                Expanded(
                  child: Text(
                    email,
                    style: TextStyle(fontSize: 16),
                  ),
                ),
                TextButton(
                  onPressed: () {
                    // Handle email edit logic here
                  },
                  child: Text('Edit', style: TextStyle(color: Colors.red)),
                ),
              ],
            ),
            SizedBox(height: 10),

            // Password input field
            TextField(
              obscureText: !isPasswordVisible,
              decoration: InputDecoration(
                labelText: 'Password*',
                border: OutlineInputBorder(),
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
            SizedBox(height: 10),

            // Forgot password link
            Align(
              alignment: Alignment.centerLeft,
              child: TextButton(
                onPressed: () {
                  // Handle forgot password logic here
                },
                child: Text(
                  'Forgot your password?',
                  style: TextStyle(color: Colors.red),
                ),
              ),
            ),
            SizedBox(height: 20),

            // Continue button
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => CoursesPage(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red, // Button color
                minimumSize: Size(double.infinity, 50),
              ),
              child: Text('Continue', style: TextStyle(fontSize: 16)),
            ),
            SizedBox(height: 20),

            // Sign up link
            TextButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => SignupPage(),
                  ),
                );
              },
              child: Text("Don't have an account? Sign Up"),
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
      },
      style: ElevatedButton.styleFrom(
        foregroundColor: isSelected ? Colors.white : Colors.black,
        backgroundColor: isSelected ? Colors.red : Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        side: BorderSide(color: Colors.red),
        minimumSize: Size(150, 50),
      ),
      child: Text(role),
    );
  }
}
