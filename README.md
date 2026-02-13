# steel-code-challenge

## 🙋🏾‍♀️ Author

Funmilayo Olaiya

## ⭐ Tools & Dependencies Used

1. [Node.js](https://github.com/nodejs/node) - JavaScript runtime for building the CLI application
2. [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Programming language used for the entire codebase
3. [Zod](https://github.com/colinhacks/zod) - TypeScript-first schema validation for validating AI responses and user inputs
4. [Vercel AI SDK](https://github.com/vercel/ai) - Unified interface for interacting with AI models (Anthropic Claude) to analyze git changes
5. [Chalk](https://github.com/chalk/chalk) - Terminal string styling for colorful and formatted console output
6. [Commander](https://github.com/tj/commander.js) - Command-line interface framework for parsing CLI commands and arguments
7. [Dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from .env file for API key management
8. [Ora](https://github.com/sindresorhus/ora) - Elegant terminal spinners for loading states and user feedback
9. [p-limit](https://github.com/sindresorhus/p-limit) - Concurrency control for limiting parallel async operations
10. [ESLint](https://github.com/eslint/eslint) & [Prettier](https://github.com/prettier/prettier) - Linting and code formatting tools for maintaining consistent and clean code quality across the project

## 🚀 Get Started Quickly

1.  Usually you should have Git and Node.js installed (mostly should be the latest) on your computer. `Node.js` should be version 22 upwards because of the stability of the dependencies.
2.  Clone the repo using: https://github.com/feobaby/steel-code-challenge.git and `cd` into the project: `steel-code-challenge`.
3.  Install all the dependencies by running the command: `npm install`
4.  Create a `.env` file in the base of the folder and add the following code:

```
GEMINI_AI_API_KEY==

# The key is sent in Hussien's email
```

## ✅ Test the Commands:

1. To analyze the commits of the current/local repository, run the follwing command:

```
node commit_critic.js --analyze
```

2. To analyze any commits of a remote repository, run the command:

```
node commit_critic.js --analyze --url="https://github.com/steel-dev/steel-browser"

## Note: You can change the url to any git repo of your choice.
```

3.  To generate a commit or write yours, run the following command:

```
node commit_critic.js --write
```

_**Key things to note for command 3**_:

- You should typically stage all changes in the current directory first, for example: using `git add .` If you forget, no worries, there’s proper error handling and you’ll get a clear error message.
- After running `node commit_critic.js --write`, the AI suggests a commit message in your terminal (usually a well-written one), and there are three things involved.
  - If you are satisfied with the suggestion, you can just press `Enter` to accept it, and all staged changes get committed automatically.
  - You can also ignore the suggestion and type whatever commit message you want on the new line. It’s basically a one-line commit input you control.
  - Or you can just type in: `git commit`, then click `Enter` as this should open an editor for you (e.g vim editor) where you can write a descriptive commit however you like.

## 💭 Some Design Decisions / Trade-Offs I Made:

### **1. On the use of Vercel AI SDK**

- Using the _Vercel AI SDK_ was the right choice for this project because it allowed for quick and seamless integration without the need to manually configure a specific AI model. It handles a lot like routing and streaming out of the box, which allows you to focus on building and experimenting rather than more technical setup.
- The tradeoff, however, is less control over the model’s behavior such as; tweaking certain key parameters. On the other hand, directly interacting with any of model would give full control and transparency over every request, making it easier to customize responses and scale across platforms. But the downside of this is that it requires more setup, boilerplate code, and careful handling of errors, streaming, and rate limits.
- Essentially, the choice came down to convenience and speed with Vercel AI versus flexibility and control. This was the right choice for small challenges or experimentation or rapid prototyping. You can also switch to different models as many other model providers are also [supported](https://ai-sdk.dev/docs/introduction).

---

### **2. On the use of Gemini Flash Lite**

- I chose [gemini-2.5-flash-lite](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash-lite) simply because I prefer its pricing model, it offered a more sensible cost structure (post-paid) compared to other models (e.g openai models expect you to put some money upfront) in my own understanding while still delivering excellent results.
- Flash also runs quickly, with a quick response time, and maintains high-quality outputs, making it a solid choice for experimentation and frequent API calls.

---

### 3. **On the Use of Streaming Responses (UX-focused)**

- Using `generateText` which is a core function of the Vercel AI SDK to generate non-streaming responses offers a simpler implementation, but the problem is that we risk the user just staring at a spinner and the terminal which could "feel slow" and will not build enough trust.
- I had to seriously consider the UX and chose to use `streamText` which is slightly more code complexity, but responses appear progressively and feels fast. The small increase in implementation complexity is justified by a major perceived performance improvement. Users see content immediately which improves terminal engagement and experience.
- `StreamText` allows incremental updates to the UI as tokens arrive, making the interface feel responsive. `generateText` waits for the full output, which kind of reduces interactivity.

---

### 4. **On Batching & Parallelization**

- When processing multiple requests, I wanted to balance _speed_, _complexity_, and _API limits_. Initially, running all 50 commits felt slow and generating an analysis was taking quite long (35s >). So to improve performance, I batched the commits into groups of 4 and used `p-limit` to control concurrency.
- I didn’t want all 4 batches running at the same time, as that could overload the model, so I used `p-limit` to configure how the batches ran concurrently.
- With this setup, generating an analysis now takes about 5 – 6 seconds.
- The timeline looks like this:
  ```
  [Batch 1, Batch 2] -> finish -> [Batch 3, Batch 4] -> end
  ```
- If I had done the batches sequentially, it could have taken more time (about 10s):
  ```
  [Batch 1] -> [Batch 2] -> [Batch 3] -> [Batch 4] -> end
  ```

---

### This was an excting challenge and thank you very much!
