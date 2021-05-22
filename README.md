# JSON Form

Generate JSON from HTML form and vice-versa.

This is a *vanilla javascript* app - a simple form that generates one-level depth JSON. Form labels are editable (keys), but also a generated JSON - on blur it updates the DOM.

App stores a whole form (`"key": "value"`) in session storage and only keys in local storage on **save** button.