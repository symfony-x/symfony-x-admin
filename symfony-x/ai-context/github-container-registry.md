# Working with the Container Registry

You can store and manage Docker and OCI images in the Container registry.

## Who Can Use This Feature?

GitHub Packages is available with the following plans:

- GitHub Free
- GitHub Pro
- GitHub Free for organizations
- GitHub Team
- GitHub Enterprise Cloud
- GitHub Enterprise Server 3.0 or higher

**GitHub Packages is not available for private repositories owned by accounts using legacy per-repository plans.** Additionally, accounts using legacy per-repository plans cannot access registries that support granular permissions because these accounts are billed by repository. For the list of registries that support granular permissions, see [About permissions for GitHub Packages](#about-permissions-for-github-packages). For more information, see [GitHub’s plans](#githubs-plans).

## In This Article

- [About the Container Registry](#about-the-container-registry)
- [About Container Registry Support](#about-container-registry-support)
- [Authenticating to the Container Registry](#authenticating-to-the-container-registry)
  - [Authenticating in a GitHub Actions Workflow](#authenticating-in-a-github-actions-workflow)
  - [Authenticating with a Personal Access Token (Classic)](#authenticating-with-a-personal-access-token-classic)
- [Pushing Container Images](#pushing-container-images)
- [Pulling Container Images](#pulling-container-images)
- [Building Container Images](#building-container-images)
- [Tagging Container Images](#tagging-container-images)
- [Labelling Container Images](#labelling-container-images)
- [Troubleshooting](#troubleshooting)
- [Help and Support](#help-and-support)

## About the Container Registry

The Container registry stores container images within your organization or personal account and allows you to associate an image with a repository. You can choose to:

- Inherit permissions from a repository
- Set granular permissions independently of a repository

You can also access public container images anonymously.

## About Container Registry Support

The Container registry currently supports the following container image formats:

- **Docker Image Manifest V2, Schema 2**
- **Open Container Initiative (OCI) Specifications**

When installing or publishing a Docker image, the Container registry supports foreign layers, such as Windows images.

## Authenticating to the Container Registry

> **Note**
>
> GitHub Packages only supports authentication using a [personal access token (classic)](https://docs.github.com/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). For more information, see [Managing your personal access tokens](https://docs.github.com/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

You need an access token to publish, install, and delete private, internal, and public packages.

You can use a personal access token (classic) to authenticate to GitHub Packages or the GitHub API. When you create a personal access token (classic), you can assign the token different scopes depending on your needs. For more information about packages-related scopes for a personal access token (classic), see [About permissions for GitHub Packages](#about-permissions-for-github-packages).

### Authenticating in a GitHub Actions Workflow

To authenticate to a GitHub Packages registry within a GitHub Actions workflow, you can use:

- `GITHUB_TOKEN` to publish packages associated with the workflow repository.
- A personal access token (classic) with at least `read:packages` scope to install packages associated with other private repositories (which `GITHUB_TOKEN` can't access).

**Note:** The ability for GitHub Actions workflows to delete and restore packages using the REST API is currently in public preview and subject to change.

You can use a `GITHUB_TOKEN` in a GitHub Actions workflow to delete or restore a package using the REST API if the token has admin permission to the package. Repositories that publish packages using a workflow and repositories that you have explicitly connected to packages are automatically granted admin permission to packages in the repository.

For more information about the `GITHUB_TOKEN`, see [Automatic token authentication](https://docs.github.com/actions/security-guides/automatic-token-authentication). For more information about best practices when using a registry in actions, see [Security hardening for GitHub Actions](https://docs.github.com/actions/security-guides/security-hardening-for-github-actions).

You can also choose to give access permissions to packages independently for GitHub Codespaces and GitHub Actions. For more information, see [Configuring a package's access control and visibility](#configuring-a-packages-access-control-and-visibility).

---

### Authenticating with a Personal Access Token (Classic)

> **Note**
>
> GitHub Packages only supports authentication using a [personal access token (classic)](https://docs.github.com/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). For more information, see [Managing your personal access tokens](https://docs.github.com/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

1. **Create a New Personal Access Token (Classic):**
   - Create a new personal access token (classic) with the appropriate scopes for the tasks you want to accomplish.
   - If your organization requires SSO, you must enable SSO for your new token.

   > **Note:**
   >
   > By default, when you select the `write:packages` scope for your personal access token (classic) in the user interface, the `repo` scope will also be selected. The `repo` scope offers unnecessary and broad access, which we recommend you avoid using for GitHub Actions workflows in particular. For more information, see [Security hardening for GitHub Actions](https://docs.github.com/actions/security-guides/security-hardening-for-github-actions).

   As a workaround, you can select just the `write:packages` scope for your personal access token (classic) in the user interface with this [URL](https://github.com/settings/tokens/new?scopes=write:packages).

2. **Select Scopes:**
   - **`read:packages`**: To download container images and read their metadata.
   - **`write:packages`**: To download and upload container images and read and write their metadata.
   - **`delete:packages`**: To delete container images.

   For more information, see [Managing your personal access tokens](https://docs.github.com/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

3. **Save Your Personal Access Token (Classic):**
   - We recommend saving your token as an environment variable.

   ```bash
   export CR_PAT=YOUR_TOKEN
   ```

4. **Authenticate Using the CLI:**
   - Use the CLI for your container type to sign in to the Container registry service at `ghcr.io`.

   ```bash
   echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
   # > Login Succeeded
   ```

---

### Pushing Container Images

This example pushes the latest version of `IMAGE_NAME`:

```bash
docker push ghcr.io/NAMESPACE/IMAGE_NAME:latest
```

Replace `NAMESPACE` with the name of the personal account or organization to which you want the image to be scoped.

This example pushes the `2.5` version of the image:

```bash
docker push ghcr.io/NAMESPACE/IMAGE_NAME:2.5
```

When you first publish a package, the default visibility is private. To change the visibility or set access permissions, see [Configuring a package's access control and visibility](#configuring-a-packages-access-control-and-visibility). You can link a published package to a repository using the user interface or command line. For more information, see [Connecting a repository to a package](#connecting-a-repository-to-a-package).

---

### Pulling Container Images

#### Pull by Digest

To ensure you're always using the same image, you can specify the exact container image version you want to pull by the digest SHA value.

1. **Find the Digest SHA Value:**
   - Use `docker inspect` or `docker pull` and copy the SHA value after `Digest`.

   ```bash
   docker inspect ghcr.io/NAMESPACE/IMAGE_NAME
   ```

   Replace `NAMESPACE` with the name of the personal account or organization to which the image is scoped.

2. **Remove Image Locally as Needed:**

   ```bash
   docker rmi ghcr.io/NAMESPACE/IMAGE_NAME:latest
   ```

3. **Pull the Container Image with SHA:**

   ```bash
   docker pull ghcr.io/NAMESPACE/IMAGE_NAME@sha256:82jf9a84u29hiasldj289498uhois8498hjs29hkuhs
   ```

---

#### Pull by Name

```bash
docker pull ghcr.io/NAMESPACE/IMAGE_NAME
```

Replace `NAMESPACE` with the name of the personal account or organization to which the image is scoped.

---

#### Pull by Name and Version

Docker CLI example showing an image pulled by its name and the `1.14.1` version tag:

```bash
docker pull ghcr.io/NAMESPACE/IMAGE_NAME:1.14.1
# > 5e35bd43cf78: Pull complete
# > 0c48c2209aab: Pull complete
# > fd45dd1aad5a: Pull complete
# > db6eb50c2d36: Pull complete
# > Digest: sha256:ae3b135f133155b3824d8b1f62959ff8a72e9cf9e884d88db7895d8544010d8e
# > Status: Downloaded newer image for ghcr.io/NAMESPACE/IMAGE_NAME/release:1.14.1
# > ghcr.io/NAMESPACE/IMAGE_NAME/release:1.14.1
```

Replace `NAMESPACE` with the name of the personal account or organization to which the image is scoped.

---

#### Pull by Name and Latest Version

```bash
docker pull ghcr.io/NAMESPACE/IMAGE_NAME:latest
# > latest: Pulling from NAMESPACE/IMAGE_NAME
# > Digest: sha256:b3d3e366b55f9a54599220198b3db5da8f53592acbbb7dc7e4e9878762fc5344
# > Status: Downloaded newer image for ghcr.io/NAMESPACE/IMAGE_NAME:latest
# > ghcr.io/NAMESPACE/IMAGE_NAME:latest
```

Replace `NAMESPACE` with the name of the personal account or organization to which the image is scoped.

---

### Building Container Images

This example builds the `hello_docker` image:

```bash
docker build -t hello_docker .
```

---

### Tagging Container Images

1. **Find the ID for the Docker Image You Want to Tag:**

   ```bash
   docker images
   # > REPOSITORY                     TAG      IMAGE ID       CREATED        SIZE
   # > ghcr.io/my-org/hello_docker    latest   38f737a91f39   47 hours ago   91.7MB
   # > hello-world                    latest   fce289e99eb9   16 months ago  1.84kB
   ```

2. **Tag Your Docker Image:**
   - Use the image ID and your desired image name and hosting destination.

   ```bash
   docker tag 38f737a91f39 ghcr.io/NAMESPACE/NEW_IMAGE_NAME:latest
   ```

   Replace `NAMESPACE` with the name of the personal account or organization to which you want the image to be scoped.

---

### Labelling Container Images

You can use pre-defined annotation keys to add metadata, including a description, a license, and a source repository to your container image. Values for supported keys will appear on the package page for the image.

#### Adding Labels in the Dockerfile

To add a key as a Docker label, we recommend using the `LABEL` instruction in your Dockerfile. For example, if you're the user `octocat` and you own `my-repo`, and your image is distributed under the terms of the MIT license, you would add the following lines to your Dockerfile:

```dockerfile
LABEL org.opencontainers.image.source=https://github.com/octocat/my-repo
LABEL org.opencontainers.image.description="My container image"
LABEL org.opencontainers.image.licenses=MIT
```

Alternatively, you can add labels to an image at build time with the `docker build` command:

```bash
docker build \
  --label "org.opencontainers.image.source=https://github.com/octocat/my-repo" \
  --label "org.opencontainers.image.description=My container image" \
  --label "org.opencontainers.image.licenses=MIT" \
  -t ghcr.io/NAMESPACE/IMAGE_NAME:latest .
```

---

### Troubleshooting

- The Container registry has a **10 GB size limit** for each layer.
- The Container registry has a **10-minute timeout limit** for uploads.

---

### Help and Support

For additional help and support, please refer to [GitHub Support](https://support.github.com/) or visit the [GitHub Community](https://github.community/).
