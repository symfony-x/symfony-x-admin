# Important Note on User Roles and Privacy

## Admin Creation
The first account created on Open WebUI gains **Administrator privileges**, controlling user management and system settings.

## User Registrations
Subsequent sign-ups start with **Pending status**, requiring Administrator approval for access.

## Privacy and Data Security
All your data, including login details, is locally stored on your device. Open WebUI ensures strict confidentiality and does not make external requests for enhanced privacy and security.

---

# Quick Start with Docker 🐳 (Recommended)

### Tip: Disabling Login for Single User
If you want to disable login for a single-user setup, set `WEBUI_AUTH` to `False`. This will bypass the login page.

> **Warning:**  
> You cannot switch between single-user mode and multi-account mode after this change.

> **Danger:**  
> When using Docker to install Open WebUI, include the `-v open-webui:/app/backend/data` in your Docker command. This step is crucial to ensure your database is properly mounted and prevents any data loss.

---

## Data Storage in Docker

### Installation with Default Configuration
- **If Ollama is on your computer**, use this command:

  ```bash
  docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- **If Ollama is on a different server**, change the `OLLAMA_BASE_URL` to the server's URL:

  ```bash
  docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

### Running Open WebUI with Nvidia GPU Support
Use this command:

```bash
docker run -d -p 3000:8080 --gpus all --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:cuda
```

---

## Installation for OpenAI API Usage Only
If you're only using the OpenAI API, use this command:

```bash
docker run -d -p 3000:8080 -e OPENAI_API_KEY=your_secret_key -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

---

## Installing Open WebUI with Bundled Ollama Support

This method uses a single container image that bundles Open WebUI with Ollama, allowing for a streamlined setup via a single command.

- **With GPU Support**: Utilize GPU resources:

  ```bash
  docker run -d -p 3000:8080 --gpus=all -v ollama:/root/.ollama -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
  ```

- **For CPU Only**: If you're not using a GPU:

  ```bash
  docker run -d -p 3000:8080 -v ollama:/root/.ollama -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
  ```

Both commands facilitate a built-in, hassle-free installation of Open WebUI and Ollama, ensuring you can get everything running swiftly. After installation, you can access Open WebUI at [http://localhost:3000](http://localhost:3000). Enjoy! 😄

---

# Using the Dev Branch 🌙

> **Warning:**  
> The `:dev` branch contains the latest unstable features and changes. Use it at your own risk as it may have bugs or incomplete features.

If you'd like to try the latest bleeding-edge features and are okay with occasional instability, use the `:dev` tag:

```bash
docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:dev
```

---

# Manual Installation

## Installation with pip (Beta)
For users who prefer to use Python's package manager pip, Open WebUI offers an installation method. Python 3.11 is required for this method.

1. **Install Open WebUI**: Open your terminal and run the following command:

   ```bash
   pip install open-webui
   ```

2. **Start Open WebUI**: Once installed, start the server using:

   ```bash
   open-webui serve
   ```

This method installs all necessary dependencies and starts Open WebUI, allowing for a simple and efficient setup. After installation, you can access Open WebUI at [http://localhost:8080](http://localhost:8080). Enjoy! 😄

---

## Other Installation Methods
Various installation alternatives are available, including non-Docker native installation methods, Docker Compose, Kustomize, and Helm. Visit the Open WebUI Documentation or join the Discord community for comprehensive guidance.

---

# Troubleshooting
If you're facing issues like "Open WebUI: Server Connection Error," see the **Troubleshooting** section in the documentation or join the Open WebUI Discord community for assistance.

---

# Updating
Check the Quick Start guide for Docker update instructions.

To update your local Docker installation to the latest version, you can use **Watchtower**:

```bash
docker run --rm --volume /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --run-once open-webui
```

Replace `open-webui` with your container name if it is different.

---

# Sponsors 🙌
We are incredibly grateful for the generous support of our sponsors. Their contributions help us maintain and improve our project, ensuring we can continue delivering quality work to our community. Thank you!

