# Tasking System

> A simple task sheduler.

<img src="assets/images/scheduler.gif" />

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## Required VS Code Extensions 

- **Prettier**
- **EsLint**
- **Vetur**

## Code Formatting

```bash
# to run a code format check 
$ npm run lint

# to auto fix what can be fixed
$ npm run lintfix

# to set-up formatting on saving (VS Code)
Add the following lines to your settings.json file:

  "eslint.validate": [
    {
      "language": "vue",
      "autoFix": true
    },
    {
      "language": "javascript",
      "autoFix": true
    },
    {
      "language": "javascriptreact",
      "autoFix": true
    }
  ],
  "eslint.autoFixOnSave": true,
  "editor.formatOnSave": false,
  "vetur.validation.template": false
```
