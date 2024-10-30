import 'package:flutter/material.dart';

class SignupPageTeacher extends StatefulWidget {
  @override
  _SignupPageTeacherState createState() => _SignupPageTeacherState();
}

class _SignupPageTeacherState extends State<SignupPageTeacher> {
  bool isStudent = true;
  late String selectedInstitution;

  @override
  void initState() {
    super.initState();
    selectedInstitution = 'Institution 1'; // Initialize with a valid value
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Image.asset('assets/logo.png', height: 40),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Create an account',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text('Join Bic Rouge for free as a'),
            SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() {
                        isStudent = true;
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isStudent ? Colors.red : Colors.grey,
                    ),
                    child: Text('Student'),
                  ),
                ),
                SizedBox(width: 8),
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
                    child: Text('Teacher'),
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(
                labelText: 'Address e-mail*',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(
                labelText: 'Name*',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(
                labelText: 'Last name',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(
                labelText: 'Postname*',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: selectedInstitution,
              hint: Text('Select Institution*'),
              onChanged: (String? newValue) {
                // Handle null value
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
              decoration: InputDecoration(
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Password*',
                border: OutlineInputBorder(),
                suffixIcon: Icon(Icons.visibility),
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Passwords must be at least 8 characters long and include a combination of letters, numbers, and other special characters.',
              style: TextStyle(fontSize: 12),
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                // Handle continue action
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                minimumSize: Size(double.infinity, 50),
              ),
              child: Text('Continue'),
            ),
            SizedBox(height: 16),
            Center(
              child: TextButton(
                onPressed: () {
                  // Handle login action
                },
                child: Text('Already have an account? Login'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
