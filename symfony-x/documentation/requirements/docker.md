# Installing Docker

This document provides detailed instructions for installing Docker on various operating systems and environments.

---

## **What Is Docker?**
Docker is a platform that allows developers to build, share, and run applications in containers. Containers are lightweight and portable, making them ideal for developing, testing, and deploying applications across different environments.

---

## **Installation Instructions**

### **1. General Installation (Cross-Platform)**
For most systems, Docker provides a convenient script to automate the installation.

#### **Run the Docker Installation Script**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### **Verify Installation**
```bash
docker --version
```

---

### **2. Installing on Ubuntu/Debian**
1. **Update Your Package List**:
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```
2. **Install Required Dependencies**:
   ```bash
   sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
   ```
3. **Add Docker’s Official GPG Key**:
   ```bash
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   ```
4. **Add the Docker Repository**:
   ```bash
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```
5. **Install Docker**:
   ```bash
   sudo apt update
   sudo apt install -y docker-ce docker-ce-cli containerd.io
   ```
6. **Verify the Installation**:
   ```bash
   docker --version
   ```

#### **Post-Installation Steps**
1. **Run Docker as a Non-Root User**:
   ```bash
   sudo usermod -aG docker $USER
   ```
2. **Reboot or Log Out and Back In** for the changes to take effect.

---

### **3. Installing on Fedora/CentOS/RHEL**
1. **Update Your Package Manager**:
   ```bash
   sudo dnf update -y
   ```
2. **Add the Docker Repository**:
   ```bash
   sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
   ```
3. **Install Docker**:
   ```bash
   sudo dnf install -y docker-ce docker-ce-cli containerd.io
   ```
4. **Start and Enable Docker**:
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```
5. **Verify the Installation**:
   ```bash
   docker --version
   ```

#### **Post-Installation Steps**
1. **Run Docker as a Non-Root User**:
   ```bash
   sudo usermod -aG docker $USER
   ```
2. **Reboot or Log Out and Back In** for the changes to take effect.

---

### **4. Installing on macOS**
1. **Install Docker Desktop**:
   - Download Docker Desktop for macOS from the [Docker Official Site](https://www.docker.com/products/docker-desktop/).
2. **Install and Start Docker Desktop**:
   - Drag the Docker app to your Applications folder and start it.
3. **Verify the Installation**:
   ```bash
   docker --version
   ```

---

### **5. Installing on Windows**
1. **Install Docker Desktop**:
   - Download Docker Desktop for Windows from the [Docker Official Site](https://www.docker.com/products/docker-desktop/).
2. **Install Docker Desktop**:
   - Follow the installation wizard and enable WSL2 integration if prompted.
3. **Verify the Installation**:
   - Open PowerShell and run:
     ```powershell
     docker --version
     ```

---

### **6. Using Docker Without Installing Locally**
If you don’t want to install Docker locally, you can use an online cloud service such as:
- [Play with Docker](https://labs.play-with-docker.com/)

---

### **7. Post-Installation Checklist**
1. **Check Docker Service Status**:
   ```bash
   sudo systemctl status docker
   ```
2. **Enable Docker to Start on Boot**:
   ```bash
   sudo systemctl enable docker
   ```

---

### **8. Uninstalling Docker**
#### **On Ubuntu/Debian**:
```bash
sudo apt remove -y docker-ce docker-ce-cli containerd.io
sudo apt autoremove -y
sudo rm -rf /var/lib/docker /var/lib/containerd
```

#### **On Fedora/CentOS/RHEL**:
```bash
sudo dnf remove -y docker-ce docker-ce-cli containerd.io
sudo rm -rf /var/lib/docker /var/lib/containerd
```

#### **On macOS**:
- Uninstall Docker Desktop from the Applications folder.

#### **On Windows**:
- Uninstall Docker Desktop from "Add or Remove Programs."

---

### **9. Troubleshooting**
- **Permission Denied Errors**:
  - Ensure your user is added to the `docker` group:
    ```bash
    sudo usermod -aG docker $USER
    ```
    Log out and log back in.
- **Service Not Starting**:
  ```bash
  sudo systemctl restart docker
  ```

---

### **10. Further Resources**
- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Troubleshooting Guide](https://docs.docker.com/config/daemon/)

