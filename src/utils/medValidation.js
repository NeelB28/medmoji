const QUESTION_TYPES = {
  EMOJI: "emoji",
  TEXT: "text",
  MIXED: "mixed",
};

const MIN_FRAGMENT_LENGTH = 4;

const stripToLetters = (value = "") => value.replace(/[^a-zA-Z]/g, "");

const normalize = (value = "") => stripToLetters(value).toLowerCase();

const sanitizeAnswer = (value = "") => stripToLetters(value).toUpperCase();

const ensureArray = (value) => (Array.isArray(value) ? value : [value]);

const hintContainsAnswerFragment = (answer, hint) => {
  const normalizedAnswer = normalize(answer);
  const normalizedHint = normalize(hint);

  if (!normalizedAnswer || !normalizedHint) return false;

  if (normalizedHint.includes(normalizedAnswer)) return true;

  for (
    let length = Math.min(normalizedAnswer.length, 12);
    length >= MIN_FRAGMENT_LENGTH;
    length -= 1
  ) {
    for (let start = 0; start <= normalizedAnswer.length - length; start += 1) {
      const fragment = normalizedAnswer.slice(start, start + length);
      if (fragment.length < MIN_FRAGMENT_LENGTH) break;
      if (normalizedHint.includes(fragment)) {
        return true;
      }
    }
  }

  return false;
};

export const buildChecklist = (question) => {
  const typeLabel =
    question.type === QUESTION_TYPES.EMOJI
      ? "emoji prompt"
      : `${question.type} prompt`;
  return Object.freeze([
    `Confirm ${typeLabel} assets align with schema`,
    "Review cue for clinical relevance",
    "Draft indirect educational hint",
    "Validate hint avoids leaking answer",
    "Prepare prompt and inputs for rendering",
  ]);
};

export const levenshteinDistance = (source = "", target = "") => {
  const a = source.toLowerCase();
  const b = target.toLowerCase();
  const rows = a.length + 1;
  const cols = b.length + 1;
  const distance = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) distance[i][0] = i;
  for (let j = 0; j < cols; j += 1) distance[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      distance[i][j] = Math.min(
        distance[i - 1][j] + 1,
        distance[i][j - 1] + 1,
        distance[i - 1][j - 1] + cost
      );
    }
  }

  return distance[a.length][b.length];
};

export const validateQuestionEntry = (entry, index) => {
  if (!entry) {
    throw new Error(
      JSON.stringify({
        error: `Question entry at index ${index} is undefined. Please supply a valid object before proceeding.`,
      })
    );
  }

  const { question, type, answer, hint } = entry;

  if (!type || !Object.values(QUESTION_TYPES).includes(type)) {
    throw new Error(
      JSON.stringify({
        error: `Question ${
          index + 1
        } type is invalid. Expected one of ${Object.values(QUESTION_TYPES).join(
          ", "
        )}.`,
      })
    );
  }

  if (!answer || typeof answer !== "string") {
    throw new Error(
      JSON.stringify({
        error: `Question ${
          index + 1
        } requires a string answer before the game can continue.`,
      })
    );
  }

  if (!hint || typeof hint !== "string") {
    throw new Error(
      JSON.stringify({
        error: `Hint for question ${
          index + 1
        } is missing. Please provide an indirect educational clue.`,
      })
    );
  }

  if (hintContainsAnswerFragment(answer, hint)) {
    throw new Error(
      JSON.stringify({
        error: `Hint for question ${
          index + 1
        } is too direct/unintelligible. Please revise before proceeding.`,
      })
    );
  }

  const questionAssets = ensureArray(question)
    .filter(Boolean)
    .map((item) => `${item}`.trim());
  if (!questionAssets.length) {
    throw new Error(
      JSON.stringify({
        error: `Question ${index + 1} requires at least one prompt asset.`,
      })
    );
  }

  if (
    type === QUESTION_TYPES.EMOJI &&
    !questionAssets.every((item) => item.length > 0)
  ) {
    throw new Error(
      JSON.stringify({
        error: `Question ${
          index + 1
        } has invalid emoji entries. Ensure each entry is a non-empty string.`,
      })
    );
  }

  return Object.freeze({
    ...entry,
    question:
      type === QUESTION_TYPES.TEXT
        ? questionAssets.join(" ")
        : Object.freeze(questionAssets),
    answer: sanitizeAnswer(answer),
    hint: hint.trim(),
  });
};

export const validateQuestionBank = (questions = []) => {
  const validated = questions.map((question, index) =>
    validateQuestionEntry(question, index)
  );
  return Object.freeze(validated);
};

export { QUESTION_TYPES };
