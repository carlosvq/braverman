export type SectionId =
  | "1A"
  | "2A"
  | "3A"
  | "4A"
  | "1B"
  | "2B"
  | "3B"
  | "4B";

export type Nature = "dopamine" | "acetylcholine" | "gaba" | "serotonin";

export type SubcategoryId =
  | "memory_attention"
  | "physical"
  | "personality"
  | "character";

export type Question = {
  id: string;
  section: SectionId;
  subcategory: SubcategoryId;
  text: string;
};

export type SectionMeta = {
  id: SectionId;
  part: "dominance" | "deficiency";
  nature: Nature;
  title: string;
  instructions: string;
};

export type AssessmentStep = {
  id: string;
  section: SectionMeta;
  subcategory: SubcategoryId;
  subcategoryLabel: string;
  questions: Question[];
};

export const SUBCATEGORY_ORDER: SubcategoryId[] = [
  "memory_attention",
  "physical",
  "personality",
  "character",
];

export const SUBCATEGORY_LABELS: Record<SubcategoryId, string> = {
  memory_attention: "Memory and Attention",
  physical: "Physical",
  personality: "Personality",
  character: "Character",
};

export const SECTIONS: SectionMeta[] = [
  {
    id: "1A",
    part: "dominance",
    nature: "dopamine",
    title: "1A — Dopamine Nature",
    instructions:
      "Answer based on how you feel most of the time, not just today.",
  },
  {
    id: "2A",
    part: "dominance",
    nature: "acetylcholine",
    title: "2A — Acetylcholine Nature",
    instructions:
      "Answer based on how you feel most of the time, not just today.",
  },
  {
    id: "3A",
    part: "dominance",
    nature: "gaba",
    title: "3A — GABA Nature",
    instructions:
      "Answer based on how you feel most of the time, not just today.",
  },
  {
    id: "4A",
    part: "dominance",
    nature: "serotonin",
    title: "4A — Serotonin Nature",
    instructions:
      "Answer based on how you feel most of the time, not just today.",
  },
  {
    id: "1B",
    part: "deficiency",
    nature: "dopamine",
    title: "1B — Dopamine Deficiency",
    instructions:
      "Answer based on how you feel right now, even if the symptom is new.",
  },
  {
    id: "2B",
    part: "deficiency",
    nature: "acetylcholine",
    title: "2B — Acetylcholine Deficiency",
    instructions:
      "Answer based on how you feel right now, even if the symptom is new.",
  },
  {
    id: "3B",
    part: "deficiency",
    nature: "gaba",
    title: "3B — GABA Deficiency",
    instructions:
      "Answer based on how you feel right now, even if the symptom is new.",
  },
  {
    id: "4B",
    part: "deficiency",
    nature: "serotonin",
    title: "4B — Serotonin Deficiency",
    instructions:
      "Answer based on how you feel right now, even if the symptom is new.",
  },
];

type SectionGroup = {
  subcategory: SubcategoryId;
  texts: string[];
};

function buildSection(section: SectionId, groups: SectionGroup[]): Question[] {
  let index = 1;
  return groups.flatMap((group) =>
    group.texts.map((text) => {
      const question: Question = {
        id: `${section}-${index}`,
        section,
        subcategory: group.subcategory,
        text,
      };
      index += 1;
      return question;
    })
  );
}

/** Nature Assessment question bank. */
export const QUESTIONS: Question[] = [
  ...buildSection("1A", [
    {
      subcategory: "memory_attention",
      texts: [
        "I find it easy to process my thoughts.",
        "I concentrate effectively.",
        "I am a deep thinker.",
        "I am a quick thinker.",
        "I become distracted because I do so many tasks at once.",
        "I enjoy intense debate.",
        "I have a good imagination.",
        "I tend to criticize and analyze my thoughts.",
      ],
    },
    {
      subcategory: "physical",
      texts: [
        "I have a lot of energy most of the time.",
        "My blood pressure is often elevated.",
        "Sometimes in my life I have had episodes of extreme energy.",
        "I have insomnia.",
        "I find exercising invigorating.",
        "I don't ordinarily need coffee to jump-start me in the morning.",
        "My veins are visible and tend to look as though they might pop out of my skin.",
        "I tend to have a high body temperature.",
        "I eat my lunch while I'm working.",
        "I engage in sexual intercourse any chance I get.",
        "I have a temper.",
        "I eat only to reenergize my body.",
        "I love action movies.",
        "Exercising makes me feel powerful.",
      ],
    },
    {
      subcategory: "personality",
      texts: [
        "I am a very domineering individual.",
        "I sometimes don't notice my feelings.",
        "I often have trouble listening to others because my own ideas dominate.",
        "I have been in many physical altercations.",
        "I tend to be future-oriented.",
        "I am sometimes speculative.",
        "Most people view me as thinking-oriented.",
        "I daydream and often fantasize.",
        "I like to read history and other nonfiction books.",
        "I admire ingenuity.",
        "I can be slow in identifying how people can cause trouble.",
        "I don't usually get tricked by people who say they need my help.",
        "Most people view me as innovative.",
        "People have thought I have had some strange ideas, but I can always explain the basis for them rationally.",
        "I am often agitated or irritated.",
        "Little things make me anxious or upset.",
        "I have fantasies of unlimited power.",
        "I love spending money.",
        "I dominate others in my relationships.",
        "I am very hard on myself.",
        "I react aggressively to criticism, often becoming defensive in front of others.",
      ],
    },
    {
      subcategory: "character",
      texts: [
        "Some individuals view me as tough-minded.",
        "Most people view me as achievement-oriented.",
        "Some people say that I am irrational.",
        "I will do anything to reach a goal.",
        "I value a religious philosophy.",
        "Incompetence makes me angry.",
        "I have high standards for myself and for others.",
      ],
    },
  ]),
  ...buildSection("2A", [
    {
      subcategory: "memory_attention",
      texts: [
        "My memory is very strong.",
        "I am an excellent listener.",
        "I am good at remembering stories.",
        "I usually do not forget a face.",
        "I am very creative.",
        "I have an excellent attention span and rarely miss a thing.",
        "I have many good hunches.",
        "I notice everything going on around me.",
        "I have a good imagination.",
      ],
    },
    {
      subcategory: "physical",
      texts: [
        "I tend to have a slow pulse.",
        "My body has excellent tone.",
        "I have a great figure/build.",
        "I have low cholesterol.",
        "When I eat, I love to experience the aromas and the beauty of food.",
        "I love yoga and stretching my muscles.",
        "During sex I am very sensual.",
        "I have had an eating disorder at some point in my life.",
        "I have tried many alternative remedies.",
      ],
    },
    {
      subcategory: "personality",
      texts: [
        "I am a perpetual romantic.",
        "I am in touch with my feelings.",
        "I tend to make decisions based on hunches.",
        "I like to speculate.",
        "Some people say I have my head in the clouds.",
        "I love reading fiction.",
        "I have a rich fantasy life.",
        "I am creative when solving people problems.",
        "I am very expressive; I like to talk about what's bothering me.",
        "I am buoyant.",
        "I believe that it is possible to have a mystical experience.",
        "I believe in being a soul mate.",
        "Sometimes the mystical can excite me.",
        "I tend to overreact to my body.",
        "I find it easy to change; I am not set in my ways.",
        "I am deeply in touch with my emotions.",
        "I tend to love someone one minute and hate him or her the next.",
        "I am flirtatious.",
        "I don't mind spending money if it benefits my relationships.",
        "I tend to fantasize when I'm having sex.",
        "My relationships tend to be filled with romance.",
        "I love watching romantic movies.",
        "I take risks in my love life.",
      ],
    },
    {
      subcategory: "character",
      texts: [
        "I foresee a better future.",
        "I am inspired to help other people.",
        "I believe that all things are possible, particularly for those who are devoted.",
        "I am good at creating harmony between people.",
        "Charity and altruism come from the heart, and I have plenty of both.",
        "Others think of me as having vision.",
        "My thoughts on religion often change.",
        "I am an idealist, but not a perfectionist.",
        "I'm happy with someone who just treats me right.",
      ],
    },
  ]),
  ...buildSection("3A", [
    {
      subcategory: "memory_attention",
      texts: [
        "I have a stable attention span and can follow other people's logic.",
        "I enjoy reading people more than books.",
        "I retain most of what I hear.",
        "I can remember facts people tell me.",
        "I learn from my experiences.",
        "I am good at remembering names.",
        "I can focus very well on tasks and people's stories.",
      ],
    },
    {
      subcategory: "physical",
      texts: [
        "I find it easy to relax.",
        "I am a calm person.",
        "I find it easy to fall asleep at night.",
        "I tend to have high physical endurance.",
        "I have low blood pressure.",
        "I do not have a family history of stroke.",
        "When it comes to sex, I am not very experimental.",
        "I have little muscle tension.",
        "Caffeine has little effect on me.",
        "I take my time eating my meals.",
        "I sleep well.",
        "I don't have many harmful food cravings such as sugar.",
        "Exercising is a regimented habit for me.",
      ],
    },
    {
      subcategory: "personality",
      texts: [
        "I am not very adventurous.",
        "I do not have a temper.",
        "I have a lot of patience.",
        "I don't enjoy philosophy.",
        "I love watching sitcoms about families.",
        "I dislike movies about other worlds or universes.",
        "I am not a risk taker.",
        "I keep past experiences in mind before I make decisions.",
        "I am a realistic person.",
        "I believe in closure.",
        "I like facts and details.",
        "When I make a decision, it's permanent.",
        "I like to plan my day, week, month, etc.",
        "I collect things.",
        "I am a little sad.",
        "I'm afraid of confrontations and altercations.",
        "I save up a lot of money in the event of a crisis.",
        "I tend to create strong, lasting bonds with others.",
        "I am a stable pillar in people's lives.",
      ],
    },
    {
      subcategory: "character",
      texts: [
        'I believe in the adage "Early to bed, early to rise."',
        "I believe in meeting deadlines.",
        "I try to please others the best I can.",
        "I am a perfectionist.",
        "I am good at maintaining long-lasting relationships.",
        "I pay attention to where my money goes.",
        "I believe that the world would be more peaceful if people would improve their morals.",
        "I am very loyal and devoted to my loved ones.",
        "I have high ethical standards that I live by.",
        "I pay close attention to laws, principles, and policies.",
        "I believe in participating in service for the community.",
      ],
    },
  ]),
  ...buildSection("4A", [
    {
      subcategory: "memory_attention",
      texts: [
        "I can easily concentrate on manual-labor tasks.",
        "I have a good visual memory.",
        "I am very receptive.",
        "I am an impulsive thinker.",
        "I live in the here and now.",
        'I tend to say, "Tell me the bottom line."',
        "I am a slow book learner, but I learn easily from experience.",
        "I need to experience something or work at it hands-on in order to understand it.",
      ],
    },
    {
      subcategory: "physical",
      texts: [
        "I sleep too much.",
        "When it comes to sex, I am very experimental.",
        "I have low blood pressure.",
        "I am very action-oriented.",
        "I am very handy around the house.",
        "I am very active outdoors.",
        "I engage in daring activities such as skydiving and motorcycle riding.",
        "I can solve problems spontaneously.",
        "I rarely have carbohydrate cravings.",
        "I usually grab a quick meal on the run.",
        "I'm not very consistent with my exercise routine; I may exercise daily for three weeks and then skip it for a month.",
      ],
    },
    {
      subcategory: "personality",
      texts: [
        "I live life in the immediate moment.",
        "I like to perform/entertain in public.",
        "I tend to gather facts in an unorganized manner.",
        "I am very flexible.",
        "I am a great negotiator.",
        'I often just like to "eat, drink, and be merry."',
        "I am dramatic.",
        "I am very artistic.",
        "I am a good craftsman.",
        "I'm a risk taker when it comes to sports.",
        "I believe in psychics.",
        "I can easily take advantage of others.",
        "I am cynical of others' philosophies.",
        "I like to have fun.",
        "My favorite types of movies are horror flicks.",
        "I am fascinated with weapons.",
        "I rarely stick to a plan or agenda.",
        "I have trouble remaining faithful.",
        "I am easily able to separate and move on when relationships with loved ones end.",
        "I don't pay much attention to how I spend my money.",
        "I have many frivolous relationships.",
      ],
    },
    {
      subcategory: "character",
      texts: [
        "I always keep my options open in case something better comes up.",
        "I don't like working hard for long periods of time.",
        "I believe things should have a function and purpose.",
        "I am optimistic.",
        "I live in the moment.",
        "I pray only when I'm in need of spiritual support.",
        "I don't have particularly high morals and ethical values.",
        "I do what I want, when I want to.",
        "I don't care about being perfect; I just live my life.",
        "Savings are for suckers.",
      ],
    },
  ]),
  ...buildSection("1B", [
    {
      subcategory: "memory_attention",
      texts: [
        "I have trouble paying consistent attention and concentrating.",
        "I need caffeine to wake up.",
        "I cannot think quickly enough.",
        "I do not have a good attention span.",
        "I have trouble getting through a task even when it is interesting to me.",
        "I am slow in learning new ideas.",
      ],
    },
    {
      subcategory: "physical",
      texts: [
        "I crave sugar.",
        "I have decreased libido.",
        "I sleep too much.",
        "I have a history of alcohol or addiction.",
        "I have recently felt worn out for no apparent reason.",
        "I sometimes experience total exhaustion without even exerting myself.",
        "I have always battled weight problems.",
        "I have little motivation for sexual experiences.",
        "I have trouble getting out of bed in the morning.",
        "I have had a craving for cocaine, amphetamines, or Ecstasy.",
      ],
    },
    {
      subcategory: "personality",
      texts: [
        "I feel fine just following others.",
        "People seem to take advantage of me.",
        "I am feeling very down or depressed.",
        "People have told me I am too mellow.",
        "I have little urgency.",
        "I let people criticize me.",
        "I always look to others to lead me.",
      ],
    },
    {
      subcategory: "character",
      texts: [
        "I have lost my reasoning skills.",
        "I can't make good decisions.",
      ],
    },
  ]),
  ...buildSection("2B", [
    {
      subcategory: "memory_attention",
      texts: [
        "I lack imagination.",
        "I have difficulty remembering names when I first meet people.",
        "I have noticed that my memory ability is decreasing.",
        "My significant other tells me I don't have romantic thoughts.",
        "I can't remember my friends' birthdays.",
        "I have lost some of my creativity.",
      ],
    },
    {
      subcategory: "physical",
      texts: [
        "I have insomnia.",
        "I have lost muscle tone.",
        "I don't exercise anymore.",
        "I crave fatty foods.",
        "I have experimented with hallucinogens or other illicit drugs.",
        "I feel like my body is falling apart.",
        "I can't breathe easily.",
      ],
    },
    {
      subcategory: "personality",
      texts: [
        "I don't feel joy very often.",
        "I feel despair.",
        "I protect myself from being hurt by others by never telling much about myself.",
        "I find it more comfortable to do things alone rather than in a large group.",
        "Other people get angrier about bothersome things than I do.",
        "I give in easily and tend to be submissive.",
        "I rarely feel passionate about anything.",
        "I like routine.",
      ],
    },
    {
      subcategory: "character",
      texts: [
        "I don't care about anyone's stories but mine.",
        "I don't pay attention to people's feelings.",
        "I don't feel buoyant.",
        "I'm obsessed with my deficiencies.",
      ],
    },
  ]),
  ...buildSection("3B", [
    {
      subcategory: "memory_attention",
      texts: [
        "I find it difficult to concentrate because I'm nervous and jumpy.",
        "I can't remember phone numbers.",
        "I have trouble finding the right word.",
        "I have trouble remembering things when I am put on the spot.",
        "I know I am intelligent, but it is hard to show others.",
        "My ability to focus comes and goes.",
        "When I read, I find I have to go back over the same paragraph a few times to absorb the information.",
        "I am a quick thinker but can't always say what I mean.",
      ],
    },
    {
      subcategory: "physical",
      texts: [
        "I feel shaky.",
        "I sometimes tremble.",
        "I have frequent backaches and/or headaches.",
        "I tend to have shortness of breath.",
        "I tend to have heart palpitations.",
        "I tend to have cold hands.",
        "I sometimes sweat too much.",
        "I am sometimes dizzy.",
        "I often have muscle tension.",
        "I tend to get butterflies in my stomach.",
        "I crave bitter foods.",
        "I am often nervous.",
        "I like yoga because it helps me to relax.",
        "I often feel fatigued even when I have had a good night's sleep.",
        "I overeat.",
      ],
    },
    {
      subcategory: "personality",
      texts: [
        "I have mood swings.",
        "I enjoy doing many things at one time, but I find it difficult to decide what to do first.",
        "I tend to do things just because I think they'd be fun.",
        "When things are dull, I always try to introduce some excitement.",
        "I tend to be fickle, changing my mood and thoughts frequently.",
        "I tend to get overly excited about things.",
        "My impulses tend to get me into a lot of trouble.",
        "I tend to be theatrical and draw attention to myself.",
        "I speak my mind no matter what the reaction of others may be.",
        "I sometimes have fits of rage and then feel terribly guilty.",
        "I often tell lies to get out of trouble.",
        "I have always had less interest than the average person in sex.",
      ],
    },
    {
      subcategory: "character",
      texts: [
        "I don't play by the rules anymore.",
        "I have lost many friends.",
        "I can't sustain romantic relationships.",
        "I consider the law arbitrary and without reason.",
        "I now consider rules that I used to follow ridiculous.",
      ],
    },
  ]),
  ...buildSection("4B", [
    {
      subcategory: "memory_attention",
      texts: [
        "I am not very perceptive.",
        "I can't remember things that I have seen in the past.",
        "I have a slow reaction time.",
        "I have a poor sense of direction.",
      ],
    },
    {
      subcategory: "physical",
      texts: [
        "I have night sweats.",
        "I have insomnia.",
        "I tend to sleep in many different positions in order to feel comfortable.",
        "I always awake early in the morning.",
        "I can't relax.",
        "I wake up at least two times per night.",
        "It is difficult for me to fall back asleep when I am awakened.",
        "I crave salt.",
        "I have less energy to exercise.",
        "I am sad.",
      ],
    },
    {
      subcategory: "personality",
      texts: [
        "I have chronic anxiety.",
        "I am easily irritated.",
        "I have thoughts of self-destruction.",
        "I have had suicidal thoughts in my life.",
        "I tend to dwell on ideas too much.",
        "I am sometimes so structured that I become inflexible.",
        "My imagination takes over.",
        "Fear grips me.",
      ],
    },
    {
      subcategory: "character",
      texts: [
        "I can't stop thinking about the meaning of life.",
        "I no longer want to take risks.",
        "The lack of meaning in my life is painful to me.",
      ],
    },
  ]),
];

export const QUESTIONS_BY_SECTION: Record<SectionId, Question[]> =
  SECTIONS.reduce(
    (acc, section) => {
      acc[section.id] = QUESTIONS.filter((q) => q.section === section.id);
      return acc;
    },
    {} as Record<SectionId, Question[]>
  );

/** One form page per nature subcategory (Memory and Attention, Physical, …). */
export const ASSESSMENT_STEPS: AssessmentStep[] = SECTIONS.flatMap((section) =>
  SUBCATEGORY_ORDER.map((subcategory) => {
    const questions = QUESTIONS_BY_SECTION[section.id].filter(
      (q) => q.subcategory === subcategory
    );
    return {
      id: `${section.id}-${subcategory}`,
      section,
      subcategory,
      subcategoryLabel: SUBCATEGORY_LABELS[subcategory],
      questions,
    };
  }).filter((step) => step.questions.length > 0)
);

export const QUESTION_IDS = QUESTIONS.map((q) => q.id);

export const NATURE_LABELS: Record<Nature, string> = {
  dopamine: "Dopamine",
  acetylcholine: "Acetylcholine",
  gaba: "GABA",
  serotonin: "Serotonin",
};
