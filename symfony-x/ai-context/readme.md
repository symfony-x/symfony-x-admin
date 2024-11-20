# Use With AI (context)

## Purpose
Here's an overview of the markdown files, their purpose, and guidance on how to effectively utilize them to enhance AI-assisted software development prompts with current information. These files are tailored to support software developers, particularly those using the Symfony framework, by supplementing AI prompts with the latest and most relevant details about the development environment and software stack.

## Background: Enhancing AI Prompts with Current Information
Large Language Models (LLMs) like ChatGPT, Ollama, and Claude are powerful tools for developers, offering a vast range of assistance, from debugging code to suggesting architectural patterns. However, these models are trained on static datasets up to a certain cutoff date. Injecting up-to-date and context-specific information into conversations with LLMs significantly enhances the relevance and accuracy of their responses. This approach ensures that responses are aligned with the most recent software versions, practices, and configurations, especially important for fast-evolving frameworks like Symfony and associated technologies.

## Description of the Markdown Files
The markdown files in this directory contain current, relevant information pertaining to:
- The latest changes and practices in Symfony 7 development.
- Usage of Symfony AssetMapper for JavaScript package handling.
- Integration of SymfonyUX Stimulus and Turbo.
- Tailwind CSS implementation strategies.
- Docker and Docker Compose configurations for local development.
- AWS deployment workflows and optimizations for ECS, RDS, S3, and other services.

These files have been curated for their relevance to common tasks and issues encountered by Symfony developers and are updated as of their latest Git commit to ensure accuracy.

## How to Use the Markdown Files with LLMs

### 1. **Copy and Paste into Chat**
The simplest way to leverage these markdown files is to copy their content and paste it directly into your conversation with an LLM. This method ensures that the AI has immediate access to the latest and most relevant information:
- Copy the relevant content from a markdown file.
- Paste it into your chat window, either at the start of the conversation or in response to a specific question.
- Use prompts like: "Here's the current configuration for my Symfony app. Based on this, how should I proceed with [task]?"

### 2. **Inject Content into the System Prompt**
For more seamless integration, especially when using tools or platforms that support custom system prompts:
- Include the content of one or more markdown files as part of the system prompt.
- This technique allows the LLM to use the provided context as the foundational knowledge for the entire conversation, resulting in responses that are more tailored to your specific environment.
- Example: “You are assisting with Symfony 7 development. Here’s the current configuration: [paste markdown content].”

### 3. **Use a Retrieval-Augmented Generation (RAG) Approach**
For developers with access to advanced AI tooling, consider setting up a RAG system:
- Store these markdown files in a retrievable format (e.g., a vector database).
- Implement a retrieval mechanism that fetches the most relevant documents based on the context of the conversation.
- Combine the retrieved documents with LLM prompts to create responses augmented by real-time data.

### 4. **Reference When Formulating Prompts**
Review the markdown files before starting a conversation and summarize their key points in your own words when communicating with the LLM:
- Helps maintain conversational flow without overwhelming the model with pasted content.
- Use summaries to direct the LLM’s attention to specific instructions, such as “The current Symfony project uses AssetMapper and not Webpack Encore. How can I optimize JavaScript handling?”

## Why These Files Are Essential
The markdown files in this directory have been selected to reflect the most time-sensitive and relevant information for Symfony software development. This ensures that when developers need assistance, they can provide LLMs with up-to-date context on:
- Changes in their local development setup (e.g., Docker configurations).
- Integration nuances with AWS services.
- Modern front-end practices using Tailwind and SymfonyUX.
- Specific package management strategies without relying on outdated tools like Webpack Encore.

By using these markdown files as described, Symfony developers can achieve higher quality, context-aware responses from LLMs, ultimately improving development efficiency and code quality.
