import { QUESTION_TYPES, validateQuestionBank } from "../utils/medValidation";

const rawQuestions = [
  {
    question: ["🏴", "🦒"],
    type: QUESTION_TYPES.EMOJI,
    answer: "FLAGYL",
    hint: "Targets anaerobic bacteria and protozoa that often spark foul GI symptoms.",
  },
  {
    question: ["🐶", "🌊", "🚴"],
    type: QUESTION_TYPES.EMOJI,
    answer: "DOXYCYCLINE",
    hint: "Photosensitizing option used against Lyme disease, acne flares, and malaria prophylaxis.",
  },
  {
    question: ["👨‍🍳", "🎻"],
    type: QUESTION_TYPES.EMOJI,
    answer: "CEFAZOLIN",
    hint: "Common perioperative choice that covers skin flora such as MSSA and streptococci.",
  },
  {
    question: ["🦊", "👁️", "⭐"],
    type: QUESTION_TYPES.EMOJI,
    answer: "CEFOXITIN",
    hint: "Cephamycin reserved for contaminated abdominal cases thanks to reliable anaerobe coverage.",
  },
  {
    question: ["🍬", "🔑"],
    type: QUESTION_TYPES.EMOJI,
    answer: "INSULIN",
    hint: "Peptide hormone that unlocks glucose transporters so cells can clear post-meal spikes.",
  },
  {
    question: ["🚗", "🐝", "🖊️", "M"],
    type: QUESTION_TYPES.EMOJI,
    answer: "CARBAPENEM",
    hint: "Broad-spectrum rescue therapy escalated for severe sepsis with suspected resistant Gram negatives.",
  },
  {
    question: ["👂", "🦶", "🖊️", "M"],
    type: QUESTION_TYPES.EMOJI,
    answer: "ERTAPENEM",
    hint: "Once-daily IV option that simplifies coverage for diabetic foot and pelvic abscesses.",
  },
  {
    question: ["🐯", "🚴"],
    type: QUESTION_TYPES.EMOJI,
    answer: "TIGECYCLINE",
    hint: "Intravenous agent spanning MRSA, VRE, and many MDR Gram negatives but avoided in bacteremia.",
  },
  {
    question: ["🅰️", "🐂", "🦑", "💊"],
    type: QUESTION_TYPES.EMOJI,
    answer: "AMOXICILLIN",
    hint: "Beta-lactam frequently paired with clavulanate to manage community ENT and bite infections.",
  },
  {
    question: ["🚐", "🐄", "🩸"],
    type: QUESTION_TYPES.EMOJI,
    answer: "VANCOMYCIN",
    hint: "Therapy of choice for MRSA bacteremia when trough monitoring guides safe dosing.",
  },
];

export const medQuestions = validateQuestionBank(rawQuestions);

