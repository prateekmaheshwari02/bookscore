import type { EvaluationResult, QuizQuestion, UserAnswer } from "@/lib/types";

const thinkingInSystemsQuiz: QuizQuestion[] = [
  {
    question: "Which interpretation would Donella Meadows most likely support when a widened road reduces traffic briefly, then congestion returns?",
    concept: "feedback loops",
    options: [
      "The road failed because drivers did not know the new route.",
      "A reinforcing feedback loop encouraged more people to drive once road capacity increased.",
      "The problem was solved, but the city measured the wrong variable.",
      "The system had no feedback, so no behavior could change."
    ],
    correctAnswer: "A reinforcing feedback loop encouraged more people to drive once road capacity increased."
  },
  {
    question: "Which of the following best represents Meadows' point of view on leverage points?",
    concept: "leverage points",
    options: [
      "Because leverage points are places where structure strongly shapes behavior.",
      "Because small changes are always safer than large changes.",
      "Because every system responds instantly to outside pressure.",
      "Because leverage points remove all delays from the system."
    ],
    correctAnswer: "Because leverage points are places where structure strongly shapes behavior."
  },
  {
    question: "Which action would Meadows most likely advise when a company keeps hiring support agents while product bugs keep creating complaints?",
    concept: "system structure",
    options: [
      "The company needs a better script for support agents.",
      "The company is treating a symptom while leaving the underlying structure unchanged.",
      "The company has too many feedback loops.",
      "The company should stop measuring complaints."
    ],
    correctAnswer: "The company is treating a symptom while leaving the underlying structure unchanged."
  },
  {
    question: "Which example best represents the author's distinction between a stock and a flow?",
    concept: "stocks and flows",
    options: [
      "A bathtub's water level as the stock, with inflow from the tap and outflow through the drain.",
      "A list of goals as the stock, with motivation as the flow.",
      "A traffic sign as the stock, with road rules as the flow.",
      "A team's mood as the stock, with meeting notes as the flow."
    ],
    correctAnswer: "A bathtub's water level as the stock, with inflow from the tap and outflow through the drain."
  },
  {
    question: "Which of the following best represents the author's warning about delays?",
    concept: "delays",
    options: [
      "Delays make every system completely unpredictable.",
      "Delays can cause people to overcorrect because the effect of an action appears later.",
      "Delays mean feedback loops are not present.",
      "Delays only matter in mechanical systems, not social systems."
    ],
    correctAnswer: "Delays can cause people to overcorrect because the effect of an action appears later."
  },
  {
    question: "Which systems archetype would the author most likely use to explain a fishery where each boat races to catch more before others do?",
    concept: "tragedy of the commons",
    options: [
      "Success to the successful",
      "Tragedy of the commons",
      "Shifting the burden",
      "Balancing feedback with delay"
    ],
    correctAnswer: "Tragedy of the commons"
  },
  {
    question: "Which statement best represents Meadows' point of view that system behavior comes from system structure?",
    concept: "behavior over time",
    options: [
      "The same structure tends to create recurring patterns, even with different people inside it.",
      "People inside systems have no choices.",
      "The visible events are more important than the relationships among parts.",
      "A system can be understood by listing its parts one by one."
    ],
    correctAnswer: "The same structure tends to create recurring patterns, even with different people inside it."
  },
  {
    question: "Which conclusion would the author most likely draw from a school rewarding only test scores and then seeing narrowed instruction?",
    concept: "goals and incentives",
    options: [
      "The teachers are the only cause of the problem.",
      "The system's goal and measurement can reshape behavior in unintended ways.",
      "Testing should always be removed from schools.",
      "The school has too many stocks and flows."
    ],
    correctAnswer: "The system's goal and measurement can reshape behavior in unintended ways."
  },
  {
    question: "Which response would the author most likely advise when facing a persistent problem?",
    concept: "mental models",
    options: [
      "Look for the one person who caused the failure.",
      "Map relationships, feedback loops, delays, and assumptions before choosing an intervention.",
      "Choose the fastest action so the system cannot resist it.",
      "Ignore historical behavior because only current events matter."
    ],
    correctAnswer: "Map relationships, feedback loops, delays, and assumptions before choosing an intervention."
  },
  {
    question: "Which explanation best represents the author's view on why pushing harder on a failing policy can make things worse?",
    concept: "policy resistance",
    options: [
      "Systems always reject any outside change.",
      "Other parts of the system may adapt in ways that offset or amplify the intervention.",
      "Policies only work when they are simple.",
      "A stronger policy always changes the system's purpose."
    ],
    correctAnswer: "Other parts of the system may adapt in ways that offset or amplify the intervention."
  }
];

const atomicHabitsQuiz: QuizQuestion[] = [
  {
    question: "Which habit principle would James Clear say is being used when someone places a book on their pillow every morning to read more?",
    concept: "make it obvious",
    options: [
      "Make the cue visible in the environment.",
      "Make the reward unpredictable.",
      "Make the habit harder to start.",
      "Focus only on the final goal."
    ],
    correctAnswer: "Make the cue visible in the environment."
  },
  {
    question: "Which of the following best represents the author's point of view on identity-based habits?",
    concept: "identity-based habits",
    options: [
      "Because lasting change is easier when behavior reinforces the kind of person you believe you are becoming.",
      "Because goals are always harmful.",
      "Because identity removes the need for repeated action.",
      "Because habits work only when other people notice them."
    ],
    correctAnswer: "Because lasting change is easier when behavior reinforces the kind of person you believe you are becoming."
  },
  {
    question: "Which action would the author most likely advise for improving a system instead of merely setting a goal?",
    concept: "systems vs goals",
    options: [
      "Saying 'I want to get fit this year.'",
      "Creating a weekly workout schedule, preparing clothes, and tracking sessions.",
      "Imagining the feeling of reaching the goal.",
      "Waiting until motivation is high."
    ],
    correctAnswer: "Creating a weekly workout schedule, preparing clothes, and tracking sessions."
  },
  {
    question: "Which of the following best represents the author's argument about tiny habit changes over a long period?",
    concept: "compounding",
    options: [
      "Small changes compound into large differences when repeated consistently.",
      "Small changes produce immediate dramatic results.",
      "Tiny habits never require effort.",
      "A small habit guarantees success in every area."
    ],
    correctAnswer: "Small changes compound into large differences when repeated consistently."
  },
  {
    question: "Which description best represents the author's advice about habit stacking?",
    concept: "habit stacking",
    options: [
      "Attaching a new behavior to an existing routine.",
      "Doing many difficult habits at the same time.",
      "Removing all cues from the environment.",
      "Rewarding yourself before taking action."
    ],
    correctAnswer: "Attaching a new behavior to an existing routine."
  },
  {
    question: "Which action best follows the 'make it easy' law?",
    concept: "make it easy",
    options: [
      "Start with a two-minute version of the habit.",
      "Choose the hardest version first.",
      "Hide the tools needed for the habit.",
      "Measure success only after a full year."
    ],
    correctAnswer: "Start with a two-minute version of the habit."
  },
  {
    question: "What is the main purpose of making a habit satisfying?",
    concept: "make it satisfying",
    options: [
      "Immediate satisfaction helps the brain want to repeat the behavior.",
      "Satisfaction replaces the need for consistency.",
      "A satisfying habit should never be tracked.",
      "The reward matters more than the behavior itself."
    ],
    correctAnswer: "Immediate satisfaction helps the brain want to repeat the behavior."
  },
  {
    question: "Why is environment design powerful for habits?",
    concept: "environment design",
    options: [
      "It shapes behavior by making good cues easier to see and bad cues harder to act on.",
      "It forces discipline without any planning.",
      "It removes every obstacle permanently.",
      "It matters only for physical habits."
    ],
    correctAnswer: "It shapes behavior by making good cues easier to see and bad cues harder to act on."
  },
  {
    question: "What does the plateau of latent potential describe?",
    concept: "latent potential",
    options: [
      "Progress can be invisible for a while before accumulated effort becomes noticeable.",
      "Habits stop working after the first week.",
      "People should quit if results are not immediate.",
      "Goals produce results faster than systems."
    ],
    correctAnswer: "Progress can be invisible for a while before accumulated effort becomes noticeable."
  },
  {
    question: "Which answer best captures the habit loop?",
    concept: "habit loop",
    options: [
      "Cue, craving, response, reward.",
      "Goal, deadline, pressure, success.",
      "Motivation, discipline, talent, outcome.",
      "Plan, announcement, effort, identity."
    ],
    correctAnswer: "Cue, craving, response, reward."
  }
];

export function hasUsableOpenAiKey() {
  const key = process.env.OPENAI_API_KEY?.trim();
  return Boolean(key && key !== "your_openai_api_key_here" && key.startsWith("sk-"));
}

export function createDemoQuiz(bookName: string): QuizQuestion[] {
  const normalizedTitle = bookName.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (normalizedTitle.includes("thinkinginsystems")) {
    return thinkingInSystemsQuiz;
  }

  if (normalizedTitle.includes("atomichabits")) {
    return atomicHabitsQuiz;
  }

  return [
    {
      question: `What is the strongest sign that someone understood the central argument of "${bookName}"?`,
      concept: "central argument",
      options: [
        "They can repeat the subtitle exactly.",
        "They can explain the main claim, why it matters, and where it may not apply.",
        "They remember the author's publication history.",
        "They can quote the first paragraph."
      ],
      correctAnswer: "They can explain the main claim, why it matters, and where it may not apply."
    },
    {
      question: `When reading "${bookName}", which question best tests conceptual understanding?`,
      concept: "conceptual understanding",
      options: [
        "What year was the book published?",
        "How would this idea change a decision in your own life or work?",
        "How many chapters does the book have?",
        "What color is the cover?"
      ],
      correctAnswer: "How would this idea change a decision in your own life or work?"
    },
    {
      question: "A reader agrees with an idea but cannot give an example. What is most likely missing?",
      concept: "application",
      options: [
        "They may recognize the idea but not yet know how to apply it.",
        "They have mastered the concept fully.",
        "They need more trivia about the author.",
        "They should avoid summarizing the book."
      ],
      correctAnswer: "They may recognize the idea but not yet know how to apply it."
    },
    {
      question: "Why should a good book quiz include plausible wrong answers?",
      concept: "diagnosis",
      options: [
        "To reveal the specific misunderstanding behind a wrong choice.",
        "To make every answer feel random.",
        "To punish readers for not memorizing details.",
        "To make the quiz longer without adding value."
      ],
      correctAnswer: "To reveal the specific misunderstanding behind a wrong choice."
    },
    {
      question: "What is the best way to test whether a reader can transfer an idea?",
      concept: "transfer",
      options: [
        "Ask them to use the idea in a new situation.",
        "Ask them to list every heading.",
        "Ask them to spell the author's name.",
        "Ask them whether they liked the book."
      ],
      correctAnswer: "Ask them to use the idea in a new situation."
    },
    {
      question: "Which answer shows the deepest reading?",
      concept: "critical thinking",
      options: [
        "I agree with everything because the book sounds smart.",
        "I can explain the idea, use it, and name a situation where it might fail.",
        "I finished the book quickly.",
        "I highlighted many sentences."
      ],
      correctAnswer: "I can explain the idea, use it, and name a situation where it might fail."
    },
    {
      question: "What should a reader do after missing a conceptual question?",
      concept: "reflection",
      options: [
        "Re-read the related section and write the idea in their own words.",
        "Ignore it because only the final score matters.",
        "Memorize the correct option without understanding it.",
        "Choose shorter books only."
      ],
      correctAnswer: "Re-read the related section and write the idea in their own words."
    },
    {
      question: "Which pattern suggests shallow comprehension?",
      concept: "shallow comprehension",
      options: [
        "The reader remembers examples but cannot explain the principle behind them.",
        "The reader can compare the book's idea with another framework.",
        "The reader can apply the concept to a new problem.",
        "The reader can identify trade-offs."
      ],
      correctAnswer: "The reader remembers examples but cannot explain the principle behind them."
    },
    {
      question: "Why is personal feedback more useful than a score alone?",
      concept: "feedback",
      options: [
        "It points to the concepts that need repair and suggests what to revisit.",
        "It makes the score less accurate.",
        "It removes the need to answer questions.",
        "It hides mistakes from the reader."
      ],
      correctAnswer: "It points to the concepts that need repair and suggests what to revisit."
    },
    {
      question: "What is the main limit of demo mode without an AI key?",
      concept: "demo limitations",
      options: [
        "It can test the app flow, but it cannot create deeply book-specific questions for every title.",
        "It cannot show any questions at all.",
        "It cannot calculate a score.",
        "It requires a database."
      ],
      correctAnswer: "It can test the app flow, but it cannot create deeply book-specific questions for every title."
    }
  ];
}

export function createDemoEvaluation(bookName: string, answers: UserAnswer[]): EvaluationResult {
  const correctCount = answers.filter((answer) => answer.selectedAnswer === answer.correctAnswer).length;
  const score = Math.round((correctCount / answers.length) * 100);
  const missed = answers.filter((answer) => answer.selectedAnswer !== answer.correctAnswer);
  const weakConcepts = missed.length ? missed.map((answer) => answer.concept) : ["No major weak concepts detected"];
  const chapterSuggestions = buildDemoChapterSuggestions(bookName, missed);

  return {
    score,
    percentage: score,
    strengths: [
      "You completed the full quiz and engaged with conceptual questions.",
      score >= 70 ? "You showed solid understanding of how ideas can be applied." : "You can identify some ideas, but application needs more work."
    ],
    weakConcepts,
    feedback:
      score >= 70
        ? `Good work. Your answers suggest that you understand many of the main ideas in "${bookName}" at an application level. To improve, revisit the questions you missed and ask how the concept would work in a real decision or habit.`
        : `Your score suggests that you may remember parts of "${bookName}", but some concepts are not yet clear enough to apply. Focus less on recalling words and more on explaining each idea in your own examples.`,
    rereadSuggestions: [
      "Re-read the introduction and conclusion to reconnect the book's central argument.",
      "Review sections connected to the weak concepts listed above.",
      "After each chapter, write one real-life example of how the idea could be used."
    ],
    chapterSuggestions,
    answerReviews: buildDemoAnswerReviews(answers)
  };
}

function buildDemoAnswerReviews(answers: UserAnswer[]) {
  return answers.map((answer) => ({
    question: answer.question,
    selectedAnswer: answer.selectedAnswer,
    correctAnswer: answer.correctAnswer,
    isCorrect: answer.selectedAnswer === answer.correctAnswer,
    explanation:
      answer.selectedAnswer === answer.correctAnswer
        ? "Correct. Your answer matches the author's conceptual point."
        : `Your choice points away from the main concept being tested: ${answer.concept}. The correct answer is better because it captures the author's argument or advice more directly.`
  }));
}

function buildDemoChapterSuggestions(bookName: string, missed: UserAnswer[]) {
  const normalizedTitle = bookName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const missedConcepts = missed.map((answer) => answer.concept);

  if (!missedConcepts.length) {
    return ["No urgent chapter re-read needed. Skim your notes and revisit any marked passages that felt unclear."];
  }

  if (normalizedTitle.includes("thinkinginsystems")) {
    const suggestions = new Set<string>();

    if (missedConcepts.some((concept) => ["feedback loops", "policy resistance"].includes(concept))) {
      suggestions.add("Re-read the sections on feedback loops and policy resistance; your missed answers suggest the system's reactions to interventions need review.");
    }
    if (missedConcepts.some((concept) => ["stocks and flows", "delays"].includes(concept))) {
      suggestions.add("Re-read the stock, flow, and delay sections; focus on how accumulations change over time.");
    }
    if (missedConcepts.some((concept) => ["leverage points", "goals and incentives"].includes(concept))) {
      suggestions.add("Re-read the leverage points material; pay attention to goals, rules, information flows, and system purpose.");
    }
    if (missedConcepts.some((concept) => ["tragedy of the commons", "system structure", "behavior over time"].includes(concept))) {
      suggestions.add("Re-read the system archetypes and behavior-over-time sections; connect recurring outcomes to structure.");
    }

    return Array.from(suggestions);
  }

  if (normalizedTitle.includes("atomichabits")) {
    const suggestions = new Set<string>();

    if (missedConcepts.some((concept) => ["identity-based habits", "systems vs goals"].includes(concept))) {
      suggestions.add("Re-read the early chapters on identity-based habits and systems versus goals.");
    }
    if (missedConcepts.some((concept) => ["make it obvious", "habit stacking", "environment design"].includes(concept))) {
      suggestions.add("Re-read the chapters on the first law: make it obvious, especially cues and environment design.");
    }
    if (missedConcepts.some((concept) => ["make it easy", "make it satisfying"].includes(concept))) {
      suggestions.add("Re-read the chapters on making habits easy and satisfying; focus on friction and immediate reinforcement.");
    }

    return Array.from(suggestions);
  }

  return missed.map((answer) => `Topic/section: Re-read the part of "${bookName}" covering ${answer.concept}; this concept was connected to a missed question.`);
}
