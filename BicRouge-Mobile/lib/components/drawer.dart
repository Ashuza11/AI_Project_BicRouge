import 'package:bicrouge/pages/about_us_page.dart';
import 'package:bicrouge/pages/contact_us_page.dart';
import 'package:bicrouge/pages/login_page_student.dart';
import 'package:bicrouge/auth.dart'; // Import AuthService
import 'package:flutter/material.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          DrawerHeader(
            padding: EdgeInsets.zero,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 20),
                  Image.asset('assets/logo.png',
                      fit: BoxFit.contain, height: 50),
                  const SizedBox(height: 8),
                  const Text(
                    'Version 1.0',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Home'),
            onTap: () => Navigator.pop(context),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.language),
            title: const Text('Lang'),
            onTap: () {
              // Language selection action
            },
          ),
          ListTile(
            leading: const Icon(Icons.person_remove),
            title: const Text('Sign Out'),
            onTap: () {
              AuthService().signOut();
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => LoginPageStudent(),
                ),
              );
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.contact_mail),
            title: const Text('Contact us'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ContactUsPage(),
                ),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.info),
            title: const Text('About BicRouge'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const AboutUsPage(),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
