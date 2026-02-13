# steel-code-challenge

# Code Documentation

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

1.  Usually you should have Git and Node.js installed (mostly should be the latest) on your computer.
2.  Clone the repo using: https://github.com/feobaby/steel-code-challenge.git and `cd` into the project.
3.  Install all the dependencies using the command: `npm install`
4.  Create a `.env` and add the follwoing:

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
```

3.  To generate a commit or write yours, run the following command:

```
node commit_critic.js --write
```

### Key things to note for command 3:
Here’s a cleaner version, still in your voice:

- You should typically run `git add .` first. If you forget, no worries — there’s proper error handling and you’ll get a clear error message.
- After running `node commit_critic.js --write`, the AI suggests a commit message in your terminal (usually a well-written one). Just press `Enter` to accept it and it commits automatically.
- You can also ignore the suggestion and type whatever commit message you want on the new line. It’s basically a one-line commit input you control.
- Or you can just run `git commit` yourself — it’ll take you straight into your Vim editor so you can write the full commit message however you like.


## 💭 Some Design Decisions (Trade-Offs) I Made:

### **1. On the use of Vercel AI SDK**

Using the **Vercel AI SDK** was the best choice for this project because it allowed for quick and seamless integration without the need to manually configure a specific AI model. It handles a lot like routing and streaming out of the box, which allows you to focus on building rather than setup. 

The tradeoff, however, is less control over the model’s behavior such as; tweaking parameters like temperature, max tokens, or fine-tuning is more limited. On the other hand, directly interacting with any of OpenAI models would give full control and transparency over every request, making it easier to customize responses and scale across platforms. But the downside of this is that it requires more setup, boilerplate code, and careful handling of errors, streaming, and rate limits. 

Essentially, the choice comes down to convenience and speed with Vercel AI versus flexibility and control with raw OpenAI API calls.

---

### **2. On the use of Gemini Flash Lite**
I chose Gemini Flash Lite simply because I prefer its pricing model, it offered a cost-effective alternative compared to the standard OpenAI models while still delivering excellent results. Flash Lite runs quickly, with a quick response time, and maintains high-quality outputs, making it a solid choice for experimentation and frequent API calls. 

---

### 3. **On the Use of Streaming Responses (UX-focused)**
Using `generateText` which is a core function of the Vercel AI SDK to generate non-streaming responses offers a simpler implementation, but the problem is that we risk the user just staring at a spinner and the terminal which could "feel slow" and will not build enough trust. 

I had to seriously consider the UX and chose to use `streamText` which is slightly more code complexity, but responses appear progressively and feels fast. The small increase in implementation complexity is justified by a major perceived performance improvement. Users see content immediately, improving engagement and experience. 

`StreamText `allows incremental updates to the UI as tokens arrive, making the interface feel responsive. `generateText` waits for the full output, which blocks feedback and reduces interactivity.

---

### 4. **On Batching & Parallelization**
When processing multiple requests, I wanted to balance speed, complexity, and API limits. Initially, running all 50 commits felt slow and generating an analysis was taking quite long. To improve performance, I batched the commits into groups of 4 and used p-limit(2) to control concurrency. 

I didn’t want all 4 batches running at the same time, as that could overload the model, so I used `p-limit` to configure how the batches ran concurrently
With this setup, generating an analysis took about 5–6 seconds, hitting the speed I wanted while keeping the API safe. 
The timeline looked like this:
```
[Batch 1, Batch 2] -> finish -> [Batch 3, Batch 4] -> end
```
If I had done the batches sequentially, it could have taken more time (about 10s):
```
[Batch 1] -> [Batch 2] -> [Batch 3] -> [Batch 4] -> end 
```
---

### 5. **On the use of Zod for Structured output (not raw JSON)**
Using structured output with Zod provides a strong safeguard compared to raw JSON parsing. While raw JSON is slightly faster to parse, it carries the risk of malformed or unexpected responses from the AI, which could crash the app or lead to subtle bugs. By validating responses against a Zod schema, we incur a small performance overhead but gain guaranteed data integrity. This ensures the app only processes correctly shaped responses, making it far more robust. In this tradeoff, safety clearly outweighs raw speed, and Zod becomes the obvious choice ✅.

---
This was an excting challenge and thank you very much!

