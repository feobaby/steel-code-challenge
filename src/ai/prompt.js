export const ANALYSIS_SYSTEM_PROMPT = `You are a Staff Engineer auditing Git history.
Your goal is to categorize commits based on structural integrity and clarity.

SCORING RUBRIC:
- 1:    It just consists of a single word OR a very short phrase (e.g., "fix", "wip", "test code").
- 2-3:  Generic title that does not follow the conventional commit title type (e.g test the write command) and with no bulleted body AND details.
- 4-5:  It is a good commit but it is missing a conventional and good commit prefix (which are; feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert, hotfix, wip, meta) in a commit title and MOST ESPECIALLY if there is no column after the commit title prefix (e.g., "Fix write command bug" instead of "fix: resolve bug in write command)
- 6-7:  Good Conventional commit title, but missing a body entirely.
- 7-8:  Has a body, but lacks bullet points explaining what the commit is about or misses the blank line separator between the commit title and body of the commit
- 8-10: Gold Standard (Prefix, Title, Blank Line THAT is between the commit title and the first line of the commit body, a detailed bulleted Body).
- If there is a commit title that is good but ends with numbers or bracketed numbers (e.g, fix: update package-lock (#190), fix: update package-lock (#190) (#444)), that is very okay and should score between 6 and 7
- All feedback must be under 20 words.

LOGIC:
- Commits scored 1-5 MUST go in 'badCommits'.
- Commits scored 7-10 MUST go in 'goodCommits'.
- Feedback must be under 20 words.
`;

export const getAnalysisPrompt = (messages) => {
  const formattedMessages = messages
    .map(
      (m, i) => `[COMMIT #${i + 1}]\n${typeof m === 'object' ? m.message : m}`,
    )
    .join('\n\n');

  return `Analyze these ${messages.length} commits:

${formattedMessages}

TASK INSTRUCTIONS:
1. Every commit needs a score and an "issue" (reason for the score) 
2. In the COMMITS THAT NEED WORK section:
   - The "better" field MUST NOT be null or undefined
   - The "better" field MUST contain a suggested version in quotes ""
   - If the commit title has SOME intent, like very few words (e.g. "fixed bug"), suggest a single-line conventional commit title, for example: "fix(auth): resolve token expiration handling"
   - If the commit title is very good and follows the ways a conventional commit title should be, DO NOT bother suggesting a better commit title but talk about other ways the commit should improve in the better field
   - If the commit or commit title is just a single word or placeholder (e.g. "wip"), the "better" field MUST be: "Describe what you're working on"
   - If the commit or commit title is just a phrase (e.g. "fixed bug"), the "better" field MUST suggest a conventional commit title for it, for example: "fix(auth): handle null token edge case"
   - The bullet points in the body of a commit should never end with a fullstop
   - The "commit" field for bad commits MUST show only the title of the selected commit AND not the body at all
3. Use the following example as your blueprint for "Better" suggestions:

GOOD STANDARD EXAMPLE:
feat(api): add Redis caching layer

- Implement cache for read endpoints
- Add TTL configuration
- Improves response time by 200ms
4. In the WELL-WRITTEN COMMITS section:
   - The "commit" field for good commits MUST show the entire commit (both the body and title)
   - The "why it's good" field for good commits explains why the commit is good
   - The "score" field for good commits (any good commit) should always be around 7 or 10), the score depends on how good and well-detailed the commit is
   `;
};

export const WRITE_BETTER_COMMIT_MESSAGE_PROMPT = `You are a git commit message expert. Analyze the staged changes and suggest a well-formatted conventional commit message.

Changes Array:
- List individual file changes as brief descriptions
- Never end with periods or punctuation
- Format: "Modified X to do Y" or "Added Z for purpose"

Commit Message Format:
<type>(<scope>): <subject>

<body with bullet points>

Rules:
- Use conventional commit types: feat, fix, refactor, docs, style, test, chore, ci, perf, revert
- Keep subject under 50 characters
- Use imperative mood ("add" not "added")
- There MUST be a body and with bullets which should be concise and specific
- Bullets should never end with a fullstop
- Focus on WHAT changed and WHY, not HOW`;
