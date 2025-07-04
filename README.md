# WhatsApp AI Assistant Bot (BuilderBot.app)

<p align="center">
  <img src="assets/logo.jpg" height="80">
</p>

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/capable-celebration?referralCode=yO-oOz)

This project creates a WhatsApp bot that integrates with an AI assistant using BuilderBot technology. It allows for automated conversations and intelligent responses powered by OpenAI's assistant API.

## Features

- Receives the command `#LISTAR_GRUPOS#` and returns the list of WhatsApp groups (name and JID) that the line belongs to

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Set up your environment variables in a `.env` file:
   ```
   PORT=3008
   ```
4. Run the development server:
   ```
   pnpm run dev
   ```

### Using Docker (Recommended)

This project includes a Dockerfile for easy deployment and consistent environments. To use Docker:

1. Build the Docker image:
   ```
   docker build -t whatsapp-ai-assistant .
   ```
2. Run the container:
   ```
   docker run -p 3008:3008 --env-file .env whatsapp-ai-assistant
   ```

This method ensures that the application runs in a consistent environment across different systems.

## Usage

The bot is configured in the `src/app.ts` file. It uses the BuilderBot library to create flows and handle messages. The main welcome flow integrates with the OpenAI assistant to generate responses.

## Documentation

For more detailed information on how to use and extend this bot, please refer to the [BuilderBot documentation](https://builderbot.vercel.app/).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Contact

For questions and support, join our [Discord community](https://link.codigoencasa.com/DISCORD) or follow us on [Twitter](https://twitter.com/leifermendez).

---

Built with [BuilderBot](https://www.builderbot.app/en) - Empowering conversational AI for WhatsApp

## Custom

This code is developed for Pereyra Hugo from DusckCodes.

