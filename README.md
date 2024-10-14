# Bic Rouge an LLM Assignment Scoring and Feedback Application

This project is a Large Language Learning Model (LLM) based assignment gradding and feedback application designed to support teachers. It uses a combination of Python with FastAPI for the backend, Vite for the frontend, and LLAMA-2 and GPT-3.5 Turbo for the LLM.

## Tech Stack

- **Backend**: Python with FastAPI
- **Frontend**: Javascript with React.js and Tailwind
- **LLM**: GPT-3.5 Turbo or LLAMA-3 models

## Design

![Project Design](/design_assets/home.png)

## Architecture

![Project Design](/design_assets/architecture.png)

## Deployment

The prototype will be deployed using platforms like Vercel or Netlify for the frontend and AWS S3 or Azure, leveraging Docker containers and CI/CD using GitHub Actions.

## Features

- **Assignment Scoring**: The application uses LLM to score assignments based on predefined criteria.
- **Feedback Generation**: It also generates feedback for each assignment, providing students with valuable insights into their performance.
- **Teacher Support**: The application is designed to reduce the workload of teachers by automating the scoring and feedback process.

##

## Getting Started

To get a local copy up and running, follow these steps:

1. Clone the repo
   ```sh
   git clone git@github.com:Ashuza11/RedPen-Platform.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your API in `.env`
   ```JS
   REACT_APP_API_KEY = 'ENTER YOUR API';
   ```
4. Run the app
   ```sh
   npm run dev
   ```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Muhigiri Ashuza @Team-maarifa - ashuzamh@gmail.com
