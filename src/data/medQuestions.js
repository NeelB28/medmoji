import { QUESTION_TYPES } from "../utils/medValidation";

const rawQuestions = [
  // 1) Diabetes
  {
    question: ["♦", "🍪", "🍩", "🍰", "😔"],
    type: QUESTION_TYPES.EMOJI,
    answer: "DIABETES",
    hint: "Chronic high blood sugar—think lifestyle, insulin, and preventing long‑term complications.",
  },
  // 2) Constipation
  {
    question: ["🚫", "💩", "😣", "💎"],
    type: QUESTION_TYPES.EMOJI,
    answer: "CONSTIPATION",
    hint: "Primary GI symptom in disorders like IBS‑C and obstruction—hard, infrequent stools.",
  },
  // 4) Cefoxitin (emoji provided)
  {
    question: ["👁️", "🦊", "🔟"],
    type: QUESTION_TYPES.EMOJI,
    answer: "CEFOXITIN",
    hint: "Cephamycin with anaerobe coverage—handy for contaminated abdominal cases.",
  },
  // 5) Parkinson's
  {
    question: ["👋", "🚶", "🐌"],
    type: QUESTION_TYPES.EMOJI,
    answer: "PARKINSONS",
    hint: "Progressive dopaminergic depletion—think rest tremor, rigidity, bradykinesia (slow moves).",
  },
  // 6) GERD
  {
    question: ["🍴", "🔥", "😩"],
    type: QUESTION_TYPES.EMOJI,
    answer: "GERD",
    hint: "Reflux from the stomach—heartburn after meals, worse lying down; lifestyle helps.",
  },
  // 7) Insulin (emoji provided)
  {
    question: ["🍬", "🔑"],
    type: QUESTION_TYPES.EMOJI,
    answer: "INSULIN",
    hint: "Hormone that unlocks glucose transport into cells—key for diabetes control.",
  },
  // 8) Alopecia
  {
    question: ["👱", "⌚", "👴"],
    type: QUESTION_TYPES.EMOJI,
    answer: "ALOPECIA",
    hint: "Hair loss—think androgenetic, autoimmune (areata), or telogen effluvium causes.",
  },

  {
    question: ["🚗", "🐝", "🖊️", "M"],
    type: QUESTION_TYPES.EMOJI,
    answer: "CARBAPENEM",
    hint: "Broad-spectrum rescue therapy escalated for severe sepsis with suspected resistant Gram negatives.",
  },
  {
    question: ["🐯", "🚴"],
    type: QUESTION_TYPES.EMOJI,
    answer: "TIGECYCLINE",
    hint: "Intravenous agent spanning MRSA, VRE, and many MDR Gram negatives but avoided in bacteremia.",
  },
  {
    question: ["🍔", "🍟", "🍰", "🐄"],
    type: QUESTION_TYPES.EMOJI,
    answer: "OBESITY",
    hint: "A global health challenge—energy in > energy out. Small steps, big wins (and laughs).",
  },
];

export const medQuestions = rawQuestions;
