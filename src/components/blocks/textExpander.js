export function expandContractions(input) {
  const original = input;
  let text = (input || "")
    .replace(/[\u2018\u2019\u02BC\u2032]/g, "'")     // apóstrofes curvos → '
    .replace(/[\u201C\u201D\u2033]/g, '"');         // comillas curvas → "

  const PAST_PARTICIPLES = new Set([
    "been","done","gone","seen","had","taken","given","made","known","shown","found",
    "thought","told","come","become","written","spoken","left","put","set","run","kept",
    "felt","brought","begun","held","heard","read","met","paid","said","stood","won",
    "lost","sent","built","bought","caught","driven","flown","grown","chosen","worn",
    "laid","led","learned","learnt","forgiven","forgotten","understood","beaten","eaten",
    "drunk","swum","sung","ridden","risen","woken","taught","fought"
  ]);

  function preserveCase(expansion, original) {
    if (original.toUpperCase() === original) return expansion.toUpperCase();
    if (original[0] && original[0] === original[0].toUpperCase() &&
        original.slice(1) === original.slice(1).toLowerCase()) {
      return expansion.replace(/^\w/, c => c.toUpperCase());
    }
    return expansion;
  }

  const directRules = [
    [/\bwon't\b/gi, "will not"],
    [/\bcan't\b/gi, "cannot"],
    [/\bshan't\b/gi, "shall not"],
    [/\bain't\b/gi, "is not"],
    [/\bi'm\b/gi, "i am"],
    [/\byou're\b/gi, "you are"],
    [/\bhe's\b/gi, "he is"],
    [/\bshe's\b/gi, "she is"],
    [/\bit's\b/gi, "it is"],
    [/\bwe're\b/gi, "we are"],
    [/\bthey're\b/gi, "they are"],
    [/\bisn't\b/gi, "is not"],
    [/\baren't\b/gi, "are not"],
    [/\bwasn't\b/gi, "was not"],
    [/\bweren't\b/gi, "were not"],
    [/\bi've\b/gi, "i have"],
    [/\byou've\b/gi, "you have"],
    [/\bwe've\b/gi, "we have"],
    [/\bthey've\b/gi, "they have"],
    [/\bhaven't\b/gi, "have not"],
    [/\bhasn't\b/gi, "has not"],
    [/\bhadn't\b/gi, "had not"],
    [/\bI'll\b/gi, "I will"],
    [/\byou'll\b/gi, "you will"],
    [/\bhe'll\b/gi, "he will"],
    [/\bshe'll\b/gi, "she will"],
    [/\bit'll\b/gi, "it will"],
    [/\bwe'll\b/gi, "we will"],
    [/\bthey'll\b/gi, "they will"],
    [/\bwouldn't\b/gi, "would not"],
    [/\bshouldn't\b/gi, "should not"],
    [/\bcouldn't\b/gi, "could not"],
    [/\bmustn't\b/gi, "must not"],
    [/\bneedn't\b/gi, "need not"],
    [/\bmightn't\b/gi, "might not"],
    [/\bi'd\b/gi, "i would"], 
    [/\byou'd\b/gi, "you would"],
    [/\bhe'd\b/gi, "he would"],
    [/\bshe'd\b/gi, "she would"],
    [/\bit'd\b/gi, "it would"],
    [/\bwe'd\b/gi, "we would"],
    [/\bthey'd\b/gi, "they would"],
    [/\bdon't\b/gi, "do not"],
    [/\bdoesn't\b/gi, "does not"],
    [/\bdidn't\b/gi, "did not"],
    [/\blet's\b/gi, "let us"]
  ];

  let expanded = text;
  for (const [regex, expansion] of directRules) {
    expanded = expanded.replace(regex, (m) => preserveCase(expansion, m));
  }

  // Reglas contextuales 'd
  expanded = expanded.replace(
    /\b(i|you|he|she|it|we|they)'d\b(\s+)([a-z]+)\b/gi,
    (m, subj, space, nextWord) => {
      const exp = PAST_PARTICIPLES.has(nextWord.toLowerCase()) ? "had" : "would";
      return `${subj} ${exp}${space}${nextWord}`;
    }
  );

  // Reglas contextuales 's
  expanded = expanded.replace(
    /\b(he|she|it|who|what|that|there|where|when|why|how)'s\b(\s+)([a-z]+)\b/gi,
    (m, head, space, nextWord) => {
      const exp = PAST_PARTICIPLES.has(nextWord.toLowerCase()) ? "has" : "is";
      return `${head} ${exp}${space}${nextWord}`;
    }
  );

  // Genérico para n't
  expanded = expanded.replace(/\b(\w+)n't\b/gi, (m, base) => `${base} not`);

  // Si se expandió, loggear
  if (expanded !== original) {
    console.log("Antes:", original);
    console.log("Después:", expanded);
  }

  return expanded;
}


