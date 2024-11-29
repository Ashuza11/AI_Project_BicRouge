import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'pages/main_screen.dart';
// import 'package:splash_screen/main.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  @override
  void initState() {
    super.initState();
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersive);
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const MainScreen()));
    });
  }

  @override
  void dispose() {
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual,
        overlays: SystemUiOverlay.values);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: Center(
        child: Image.asset(
          'assets/img.png',
          height: 300,
          width: 300,
        ),
      ),
    );
  }
}
