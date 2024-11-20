Here's a comprehensive cheatsheet for developing Twig templates that include key functions and integrations with Twig-extras, Symfony Stimulus, Turbo, and Live Components:

### Basic Twig Syntax

**Variables and Filters:**
```twig
{{ variable }}             {# Display a variable #}
{{ 'Hello'|upper }}        {# Outputs: HELLO #}
{{ 10 + 5 }}               {# Outputs: 15 #}
```

**Control Structures:**
```twig
{% if condition %}
    <p>Condition is true</p>
{% else %}
    <p>Condition is false</p>
{% endif %}

{% for item in items %}
    <li>{{ item }}</li>
{% endfor %}
```

**Comments:**
```twig
{# This is a comment #}
```

### Template Inheritance and Includes

**Base Template:**
```twig
{# base.html.twig #}
<!DOCTYPE html>
<html>
    <head>
        <title>{% block title %}My App{% endblock %}</title>
    </head>
    <body>
        {% block body %}{% endblock %}
    </body>
</html>
```

**Extending a Template:**
```twig
{# child.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Custom Page Title{% endblock %}

{% block body %}
    <h1>Welcome to the custom page</h1>
{% endblock %}
```

**Including Templates:**
```twig
{% include 'partials/header.html.twig' %}
```

**Embedding Components:**
```twig
{% embed 'partials/component.html.twig' %}
    {% block content %}
        Custom content here
    {% endblock %}
{% endembed %}
```

### Twig Functions and Filters Cheats

**Common Functions:**
```twig
{{ path('route_name') }}            {# Generates URL for a route #}
{{ asset('path/to/asset.css') }}    {# Asset path #}
{{ include('template.html.twig') }} {# Embed a template directly #}
```

**Useful Filters:**
```twig
{{ 'hello'|capitalize }}        {# Hello #}
{{ 'my text'|length }}          {# 7 #}
{{ 'symfony is great'|slice(0, 7) }} {# symfony #}
{{ myDate|date('Y-m-d') }}      {# Format date #}
```

### Twig-Extras Cheats

**Using `Twig\Extra\Intl\IntlExtension`:**
```twig
{{ 'USD'|currency_name }}       {# US Dollar #}
{{ 'en'|locale_name }}          {# English #}
{{ number|format_currency('USD') }}  {# Formats as currency #}
```

**String Manipulation with `StringExtension`:**
```twig
{{ 'Hello world'|u.truncate(5) }}    {# Hello… #}
{{ 'symfony'|u.reverse }}            {# ymonfys #}
```

### Using Stimulus in Twig

**Loading Stimulus Controllers:**
```twig
<div {{ stimulus_controller('app/controller', { foo: 'bar' }) }}>
    Content with controller
</div>
```

**Stimulus with Action and Targets:**
```twig
<button {{ stimulus_action('app/controller', 'clickHandler') }}
        {{ stimulus_target('app/controller', 'button') }}>
    Click Me
</button>
```

### Using Turbo in Twig

**Turbo Frames:**
```twig
<turbo-frame id="frame-id">
    <p>Content inside a turbo frame</p>
</turbo-frame>
```

**Turbo Streams:**
```twig
<turbo-stream action="replace" target="frame-id">
    <template>
        <p>Replaced content</p>
    </template>
</turbo-stream>
```

### Live Components in Twig

**Rendering Live Components:**
```twig
{# Live Component usage #}
{{ component('App\\Component\\MyComponent', { prop: value }) }}
```

**Integrating Live Components Directly:**
```twig
{# If using Symfony UX LiveComponent Bundle #}
<live-component name="my_component" prop="value"></live-component>
```

### Miscellaneous Snippets

**Date and Time Formatting:**
```twig
{{ 'now'|date('Y-m-d H:i') }}   {# Current date and time #}
```

**Conditions and Loops with Advanced Syntax:**
```twig
{% set total = items|length %}
<p>Total items: {{ total }}</p>

{% for i in 0..4 %}
    <p>Number {{ i }}</p>
{% endfor %}
```

**Rendering JSON:**
```twig
{{ data|json_encode(constant('JSON_PRETTY_PRINT')) }}
```

This cheatsheet should help refresh your memory on key Twig and Symfony concepts for efficient template development.
