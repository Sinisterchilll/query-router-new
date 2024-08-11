const relevantWords = [
  "report", "document", "paper", "file", "details",
  "information", "data", "statistics", "figures",
  "summary", "review",  "explain", "describe", "list", "compare",
  "analyze", "current", "latest", "recent", "history",
  "causes", "effects", "impact", "definition", "meaning"
];

const domainKeywords = [
  "history", "science", "literature", "economics", "politics",
  "technology", "medicine", "law", "geography", "biology",
  "physics", "chemistry", "mathematics", "psychology", "sociology"
];

export function classifyQuery(query: string): string {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query: Query must be a non-empty string');
  }

  const originalTokens = query.split(/\s+/).filter(token => token.length > 0);
  const queryTokens = originalTokens.map(token => token.toLowerCase());

  if (queryTokens.length === 0) {
    return "General Query";
  }

  const tfScores = queryTokens.reduce((acc, token) => {
    acc[token] = (acc[token] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredTfScores = [...relevantWords, ...domainKeywords].reduce((acc, word) => {
    if (tfScores[word]) {
      acc[word] = tfScores[word];
    }
    return acc;
  }, {} as Record<string, number>);

  const tfScore = Object.values(filteredTfScores).reduce((acc, score) => acc + score, 0);
  const lengthScore = queryTokens.length;
  const nerScore = originalTokens.filter(token => /^[A-Z]/.test(token)).length;

  // Question intent detection
//   const questionScore = (query.startsWith("What") || query.startsWith("Who") || 
//                          query.startsWith("When") || query.startsWith("Where") || 
//                          query.startsWith("Why") || query.startsWith("How") || 
//                          query.endsWith("?")) ? 2 : 0;

  // Adjust weights
  const avgScore = (0.4 * tfScore) + (0.2 * lengthScore) + (0.4 * nerScore) 
//   + (0.3 * questionScore);

  // Adjust threshold
  const threshold = 1.2;

  return avgScore >= threshold ? "Document Retrieval Query" : "General Query";
}