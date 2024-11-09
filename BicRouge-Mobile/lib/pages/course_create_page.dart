import 'package:flutter/material.dart';

class CourseCreatePage extends StatelessWidget {
  const CourseCreatePage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: AppBar(
          title: Image.asset('assets/logo.png', height: 40),
          actions: [
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () {},
            ),
            IconButton(
              icon: const Icon(Icons.more_vert),
              onPressed: () {},
            ),
          ],
          bottom: const TabBar(
            labelColor: Colors.red,
            unselectedLabelColor: Colors.grey,
            indicatorColor: Colors.red,
            tabs: [
              Tab(text: 'Flow'),
              Tab(text: 'Stream'),
              Tab(text: 'Learners'),
              Tab(text: 'Notes'),
            ],
          ),
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Card(
                child: ListTile(
                  title: Text('Human and Machine Interaction'),
                ),
              ),
              const SizedBox(height: 16),
              Card(
                child: ListTile(
                  title: const Text('course code'),
                  subtitle: const Text('aibrhgm'),
                  trailing: IconButton(
                    icon: const Icon(Icons.copy),
                    onPressed: () {},
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Card(
                child: ListTile(
                  title: const Text('Future'),
                  subtitle: const Text('No current tasks'),
                  trailing: TextButton(
                    child: const Text('See all', style: TextStyle(color: Colors.red)),
                    onPressed: () {},
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Card(
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundImage:
                        NetworkImage('https://example.com/profile.jpg'),
                  ),
                  title: Text('Announcement to students...'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
