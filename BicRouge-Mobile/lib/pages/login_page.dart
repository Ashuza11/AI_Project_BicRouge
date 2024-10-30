import 'package:bicrouge/pages/password_page.dart';
import 'package:bicrouge/pages/signup_page_student.dart';
import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  String selectedRole = 'Student';

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
              'Welcome back',
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
                _buildRoleButton('Teacher'),
              ],
            ),
            SizedBox(height: 20),

            // Email input
            TextField(
              decoration: InputDecoration(
                labelText: 'Email address',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 20),

            // Continue button
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => PasswordPage(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red, // Button color
                minimumSize: Size(double.infinity, 50),
              ),
              child: Text('Continue', style: TextStyle(fontSize: 16)),
            ),
            SizedBox(height: 10),

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
            SizedBox(height: 20),

            // OR divider
            Row(
              children: [
                Expanded(child: Divider()),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10.0),
                  child: Text('OR'),
                ),
                Expanded(child: Divider()),
              ],
            ),
            SizedBox(height: 20),

            // Social login buttons
            _buildSocialButton('Continue with Google', Colors.white,
                'assets/logo_google.png', Colors.black),
            SizedBox(height: 10),
            _buildSocialButton('Continue with Microsoft Account', Colors.white,
                'assets/logo_microsoft.png', Colors.black),
            SizedBox(height: 10),
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

  // Helper method for social login buttons
  Widget _buildSocialButton(
      String text, Color bgColor, String iconPath, Color textColor) {
    return ElevatedButton.icon(
      onPressed: () {
        // Navigator.push(
        //   context,
        //   MaterialPageRoute(
        //     builder: (context) => SignupPageTeacher(),
        //   ),
        // );
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
        minimumSize: Size(double.infinity, 50),
        side: BorderSide(color: Colors.grey[300]!),
      ),
    );
  }
}
