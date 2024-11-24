import 'dart:io';

import 'package:bicrouge/pages/scaning_page.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class ScanedDocument extends StatefulWidget {
  const ScanedDocument({super.key});

  @override
  _ScanedDocumentState createState() => _ScanedDocumentState();
}

class _ScanedDocumentState extends State<ScanedDocument> {
  final List<Map<String, String>> _scannedDocuments = [];
  final List<Map<String, String>> _filteredDocuments = [];
  final ImagePicker _picker = ImagePicker();
  String _searchQuery = '';
  bool _isSearching = false;

  Future<void> _navigateToScanningPage() async {
    // Navigate to ScanningPage and wait for the captured image path
    final capturedImagePath = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => ScanningPage()),
    );

    // If an image was captured, add it to the list with a default name
    if (capturedImagePath != null) {
      setState(() {
        _scannedDocuments.add({
          'path': capturedImagePath,
          'name': 'Scanned Document ${_scannedDocuments.length + 1}',
        });
        _updateSearchResults();
      });
    }
  }

  Future<void> _pickImageFromGallery() async {
    // Pick an image from the gallery
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      setState(() {
        _scannedDocuments.add({
          'path': pickedFile.path,
          'name': 'Gallery Document ${_scannedDocuments.length + 1}',
        });
        _updateSearchResults();
      });
    }
  }

  void _removeDocument(int index) {
    setState(() {
      _scannedDocuments.removeAt(index);
      _updateSearchResults();
    });
  }

  void _renameDocument(int index) async {
    String currentName = _scannedDocuments[index]['name'] ?? 'Document';
    TextEditingController controller = TextEditingController(text: currentName);

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Rename Document'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(hintText: 'Enter new name'),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _scannedDocuments[index]['name'] = controller.text;
                _updateSearchResults();
              });
              Navigator.pop(context);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _updateSearchResults() {
    setState(() {
      if (_searchQuery.isEmpty) {
        _filteredDocuments.clear();
        _filteredDocuments.addAll(_scannedDocuments);
      } else {
        _filteredDocuments.clear();
        _filteredDocuments.addAll(
          _scannedDocuments.where((doc) =>
              doc['name']!.toLowerCase().contains(_searchQuery.toLowerCase())),
        );
      }
    });
  }

  void _startSearch() {
    setState(() {
      _isSearching = true;
    });
  }

  void _stopSearch() {
    setState(() {
      _isSearching = false;
      _searchQuery = '';
      _updateSearchResults();
    });
  }

  @override
  void initState() {
    super.initState();
    _updateSearchResults();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.grey[100],
        // elevation: 1,
        title: _isSearching
            ? TextField(
                onChanged: (query) {
                  setState(() {
                    _searchQuery = query;
                    _updateSearchResults();
                  });
                },
                autofocus: true,
                decoration: const InputDecoration(
                  hintText: 'Search documents...',
                  border: InputBorder.none,
                ),
              )
            : Image.asset('assets/logo.png', height: 40),
        actions: [
          _isSearching
              ? IconButton(
                  icon: const Icon(Icons.close, color: Colors.black),
                  onPressed: _stopSearch,
                )
              : IconButton(
                  icon: const Icon(Icons.search, color: Colors.black),
                  onPressed: _startSearch,
                ),
          IconButton(
            icon: const Icon(Icons.more_vert, color: Colors.black),
            onPressed: () {
              // Menu options
            },
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: _filteredDocuments.length,
        itemBuilder: (context, index) {
          return DocumentListItem(
            imagePath: _filteredDocuments[index]['path']!,
            name: _filteredDocuments[index]['name']!,
            onRename: () => _renameDocument(index),
            onDelete: () => _removeDocument(index),
          );
        },
      ),
      bottomNavigationBar: BottomAppBar(
        color: Colors.grey[100],
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              IconButton(
                icon: const Icon(Icons.image, color: Colors.black),
                onPressed: _pickImageFromGallery,
              ),
              IconButton(
                icon: const Icon(Icons.camera_alt, color: Colors.black),
                onPressed: _navigateToScanningPage,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class DocumentListItem extends StatelessWidget {
  final String imagePath;
  final String name;
  final VoidCallback onRename;
  final VoidCallback onDelete;

  const DocumentListItem({
    super.key,
    required this.imagePath,
    required this.name,
    required this.onRename,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Row(
        children: [
          // Document Thumbnail
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              color: Colors.grey[300],
            ),
            child: Image.file(
              File(imagePath),
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 16),
          // Document Details (Title, Size, Date)
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Size: ${(File(imagePath).lengthSync() / 1024).toStringAsFixed(1)} KB',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
                Text(
                  'Captured on: ${DateTime.now().toLocal()}',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          // Options Menu
          PopupMenuButton<String>(
            icon: Icon(Icons.more_vert, color: Colors.grey[600]),
            onSelected: (value) {
              if (value == 'Rename') {
                onRename();
              } else if (value == 'Delete') {
                onDelete();
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'Rename',
                child: Text('Rename'),
              ),
              const PopupMenuItem(
                value: 'Delete',
                child: Text('Delete'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
