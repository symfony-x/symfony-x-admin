import os
import markdown
from jinja2 import Template

# Twig template structure
TEMPLATE = """
{% extends 'base.html.twig' %}

{% block title %}
    Documentation - {{ title }}
{% endblock %}

{% block content %}
    <article class="prose lg:prose-xl dark:prose-invert max-w-none">
        {{ content|raw }}
    </article>
{% endblock %}
"""

# Function to process Markdown files and convert them to Twig templates
def convert_markdown_to_twig(input_dir, output_dir):
    for root, _, files in os.walk(input_dir):
        for file in files:
            if file.endswith(".md"):
                # Full path to input Markdown file
                input_path = os.path.join(root, file)

                # Read the Markdown content
                with open(input_path, "r", encoding="utf-8") as md_file:
                    markdown_content = md_file.read()

                # Convert Markdown to HTML
                html_content = markdown.markdown(markdown_content)

                # Determine output Twig file path
                relative_path = os.path.relpath(input_path, input_dir)
                twig_file_name = os.path.splitext(relative_path)[0] + ".html.twig"
                output_path = os.path.join(output_dir, twig_file_name)

                # Ensure the output directory exists
                os.makedirs(os.path.dirname(output_path), exist_ok=True)

                # Render the Twig template
                title = os.path.splitext(file)[0].replace("-", " ").title()
                rendered_content = Template(TEMPLATE).render(title=title, content=html_content)

                # Write the rendered Twig template to file
                with open(output_path, "w", encoding="utf-8") as twig_file:
                    twig_file.write(rendered_content)

                print(f"Generated: {output_path}")

# Input and output directories
input_directory = "documentation/input"  # Replace with your Markdown directory
output_directory = "documentation/templates/docs"  # Replace with your desired Twig output directory

# Perform the conversion
convert_markdown_to_twig(input_directory, output_directory)
