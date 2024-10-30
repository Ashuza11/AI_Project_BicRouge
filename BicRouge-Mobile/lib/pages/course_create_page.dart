import 'package:flutter/material.dart';

class CourseCreatePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: AppBar(
          title: Image.asset('assets/logo.png', height: 40),
          actions: [
            IconButton(
              icon: Icon(Icons.add),
              onPressed: () {},
            ),
            IconButton(
              icon: Icon(Icons.more_vert),
              onPressed: () {},
            ),
          ],
          bottom: TabBar(
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
              Card(
                child: ListTile(
                  title: Text('Human and Machine Interaction'),
                ),
              ),
              SizedBox(height: 16),
              Card(
                child: ListTile(
                  title: Text('course code'),
                  subtitle: Text('aibrhgm'),
                  trailing: IconButton(
                    icon: Icon(Icons.copy),
                    onPressed: () {},
                  ),
                ),
              ),
              SizedBox(height: 16),
              Card(
                child: ListTile(
                  title: Text('Future'),
                  subtitle: Text('No current tasks'),
                  trailing: TextButton(
                    child: Text('See all', style: TextStyle(color: Colors.red)),
                    onPressed: () {},
                  ),
                ),
              ),
              SizedBox(height: 16),
              Card(
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
