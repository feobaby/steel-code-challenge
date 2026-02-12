# steel-code-challenge

# Code Documentation

## 🙋🏾‍♀️ Author

Funmilayo Olaiya

## ⭐ Technologies & Tools Used

1. [Node.js](https://github.com/nodejs/node) - JavaScript runtime for building the CLI application
2. [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Programming language used for the entire codebase
3. [Zod](https://github.com/colinhacks/zod) - TypeScript-first schema validation for validating AI responses and user inputs
4. [Vercel AI SDK](https://github.com/vercel/ai) - Unified interface for interacting with AI models (Anthropic Claude) to analyze git changes
5. [Chalk](https://github.com/chalk/chalk) - Terminal string styling for colorful and formatted console output
6. [Commander](https://github.com/tj/commander.js) - Command-line interface framework for parsing CLI commands and arguments
7. [Dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from .env file for API key management
8. [Ora](https://github.com/sindresorhus/ora) - Elegant terminal spinners for loading states and user feedback
9. [p-limit](https://github.com/sindresorhus/p-limit) - Concurrency control for limiting parallel async operations
10. [Simple-git](https://github.com/steveukx/git-js) - Lightweight interface for running git commands programmatically
11. [ESLint](https://github.com/eslint/eslint) & [Prettier](https://github.com/prettier/prettier) - Linting and code formatting tools for maintaining consistent and clean code quality across the project

## 🚀 Get Started Quickly

1.  Usually you should have Git and Node.js installed (mostly should be the latest) on your computer.
2.  Clone the repo using: https://github.com/feobaby/steel-code-challenge.git and `cd` into the project.
3.  Install all the dependencies using the command: `npm install`
4.  Create a `.env` and add the follwoing:

```
GEMINI_API_KEY=

# The key is sent in Hussein's email
```

## ✅ Test the Commands:

1. To analyze the commits of the current/local repository, run the follwing command:

```
node commit_critic.js --analyze
```

2. To analyze the commits of the remote repository, run the command:

```
node commit_critic.js --analyze --url="https://github.com/steel-dev/steel-browser"
```

2. To analyze the commits of the current/local repository, run the follwing command:

```
node commit_critic.js --write
```

#### For the codebase:

I had to separate certain concerns to ensure _simplicity_, and _modularity_ and promote _reusability_ in the codebase.
Project structure is relative according to certain project demands, but for this simple project, I believe this structure is enough for now.

The codebase project structure is as follows:

```
src
- ai
  - config.js
  - formatter.js
  - prompt.js
  - schema.js
  - service.js
- commands
- render
- services
- utils
- index.js
- .env
- .gitignore
- .prettierrc.json
- eslint.config.js
- package-lock.json
- package.json
- README.md
```

## 💭 Some Design Decisions:

Sinc this challeng was open ended

## Simeple Architecture of the Codebase
