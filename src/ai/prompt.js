export const ANALYSIS_SYSTEM_PROMPT = `You are a strict Senior Staff Engineer and Git Expert. 
Your goal is to enforce high-quality commit standards. 

CRITERIA FOR SCORING:
- 1-6 Score: These are POOR or AVERAGE. They lack detail, don't follow conventional commits, or are too brief. Put the worst of these in 'badCommits'.
- 7-10 Score: These are EXCELLENT. They must be descriptive and follow conventional commits perfectly. Put the best of these in 'goodCommits'.

Keep ALL feedback under 20 words.`;

export const getAnalysisPrompt = (messages) => {
  const formattedMessages = messages
    .map((m, i) => {
      const commitText = typeof m === 'object' ? m.message : m;

      return `[COMMIT #${i + 1} START]\n${commitText}\n[COMMIT #${i + 1} END]`;
    })
    .join('\n\n');

  return `Analyze these ${messages.length} commit messages.
  
  COMMITS TO EVALUATE:
  ${formattedMessages}

INSTRUCTIONS:
1. If a commit is just a title, it should rarely score above a 6.
2. In the "Better" field for bad commits, ALWAYS provide an example of what they could do better.
3. In the "Why it's good" field for good commits, specifically mention if they used a body/bullet points correctly.
4. If NO commits have bodies, give them all lower scores and explain that they lack detail.
5. If commits have a good title and a good body, they should score 7 or above, depending on the level of accuracy

Return the data according to the defined schema.`;
};
