import type { Nature } from "@/data/questions";

export type NatureDominanceDescription = {
  balanced: string;
  excess: string;
};

export type NatureDeficiencyDescription = {
  intro: string;
  physical: string;
  personality: string;
  memory: string;
  attention: string;
};

export const NATURE_DOMINANCE_DESCRIPTIONS: Record<
  Nature,
  NatureDominanceDescription
> = {
  dopamine: {
    balanced:
      "If you have a dopamine nature, you are part of 17% of the population. When you are balanced, you are likely to be strong-willed who knows exactly what you want and how to get it. You are fast on your feet and self-confident. You are highly rational, more comfortable with facts and figures than with feelings and emotions. You are able to assess yourself critically, but you may not respond well to the criticisms of others. You focus intently on the task at hand and take pride in achievement. Strategic thinking, masterminding, inventing, problem solving, envisioning, and pragmatism are exciting and you function well under stress. A majority of doctors, scientists, researchers, inventors, engineers, generals and architects are dopamine dominant, but this does not preclude you from other professions. You may like to play chess, listen to books on tape, or do difficult crossword puzzles. You are tireless, perhaps overly alert, and may need less sleep than others. When exercising, you may enjoy weight-lifting more than aerobic activities. You may not be overly sensitive and miss it when others consider their feelings more important than your reasons. You may be distant from your children, and the stability of your marriage may depend on the loyalty and goodwill of your spouse.",
    excess:
      "Too much dopamine can lead to excessive risk-taking behaviors and impulsive actions. Violence and over-control of others may be recurrent problems. Sexual activity level might be too high for sustained relationships to endure, as extramarital sexual activity may result. As teenagers, reckless driving, shoplifting, or date rape may result if you did not learn to balance your dopamine extremes in time.",
  },
  acetylcholine: {
    balanced:
      "You are adept at working with your senses and view the world in sensory terms. You are highly creative and open to new ideas. You are a quick thinker who is always taking other people into consideration. You are devoted to making things the best they can be, no matter how much effort it requires. You are flexible, creative, and spontaneous, and are willing to try anything new as long as it promises to be new and exciting. If your acetylcholine nature is in balance, you are intuitive and innovative. You take pleasure in anything involving words, ideas, and communication. (Acetylcholine is produced to a great extent in the parietal lobes of the brain, which is responsible for language, intelligence, and comprehension.) You may be ideal in the roles as counselor, mediator, think tank member, yoga and meditation instructor, religious leader, and in public service. Strong acetylcholine levels are associated with high brain speed, which impacts the creative function, so artists, writers, advertising professionals, and actors are frequently acetylcholine dominant. You are extremely social, even charismatic. You love meeting and greeting and making new friends. You come across to others as authentic and grounded. People find you charming, and you find relationships come easy to you. You invest a great deal of energy and time into your relationships and feel that you are personally reaping the rewards. You are an optimist, and you see the possibilities in people. You are attentive to the needs of children and romantic with your significant other. You are good at remembering other people's feelings and reactions, and this enables you to not hurt others. You are altruistic and benevolent. You love adventure. You are open to new things and not afraid of failure. You like to travel, but you can also enjoy reading about the lives of others. Your quest for learning makes you interested in a variety of topics and adept at sharing your knowledge with others.",
    excess:
      "You may give too much of yourself, to the point of not considering your own needs or becoming masochistic. You may feel the world is taking advantage of you, or become paranoid. You may become socially isolated as a result. Panic disorder, manic episodes, or anxiety can result.",
  },
  gaba: {
    balanced:
      "A person with a GABA nature is stable. Almost 50% of the world share this nature, whose hallmarks are consistency, sociability, and concern for others. If you have a GABA nature, you will likely show up every day for work and be there when others need you. When your GABA is in balance, you remain calm when chaos swirls around you. Characteristics of objectivity, levelheadedness, punctuality, practicality, and confidence all come naturally to you. Staying organized is very important to you, and rigid schedules are comforting rather than confining – they eliminate uncertainty and ensure smooth sailing. GABA dominant people tend to gravitate to careers as administrators, accountants, security officers, nurses, medical technicians, air-traffic controllers, news reporters, EMT's, meeting planners, bus drivers, and homemakers. No matter what the job, the GABA-natured person is the one who tethers the group, who stays focused on the matter at hand, yet usually defers to the majority. You are the consummate team player, deriving pleasure from fulfilling your obligations and taking care of those you love. You are sensible, settled, and not prone to wide swings of emotion or outbursts of anger. You both relish group activities and cherish one-to-one connections. Making others comfortable makes you happy. Marriage is seen as a long-term haven. You probably believe in traditions and institutions, and enjoy your part in making them work, especially at your place of worship. You look forward to holiday gatherings, and planning for them seems more like play than work. You probably like history books and biographies. Collecting memorabilia and creating scrapbooks may provide hours of entertainment. There are times when you feel you've had a strong nurturing effect on others, such as after hosting a holiday dinner.",
    excess:
      "Producing too much GABA may ratchet up your nurturing tendencies to the point where you ignore your own needs or end up getting hurt. You may spend too much energy looking for love, and then relying too heavily on your mates. You may look too much to authority figures for advice and continuously craving and following the advice of others.",
  },
  serotonin: {
    balanced:
      "Serotonin resynchronizes your brain while you sleep so you wake every morning with a fresh start. If you have a serotonin nature, you are among 17% of the population who really know how to enjoy themselves. Serotonin is associated with delta waves (which are produced in abundance when we sleep) and affects our ability to rest, regenerate, and find security. If you have a serotonin nature, you know how to live in the moment. You are a realist, keenly responsive to sensory input, yet you can be impulsive, too. You love to participate in activities for the \"love of the game\" and not as a means to an end. Achievement to you means getting something done now. You thrive on change – you'll alternate tasks and find new ways of doing repetitive ones. You will try new foods, pick up a new hobby, and plan a different vacation every year. When balanced, a person with a serotonin nature is receptive to stimuli, in touch with both mind and body, often physically coordinated, and very resourceful. You are not put off by struggle and undeterred by setbacks. If your work doesn't feel like play, it is not worth doing. Your serotonin nature is ideal for professions requiring motor skills, hand-eye coordination, flexibility, and crisis management. Tools are extensions of the serotonin brain. Construction workers, oil riggers, truck and ambulance drivers, military personnel, hairstylists, bartenders, pilots, and computer programmers – who get to play with the most advanced and expensive tools – are all likely to have a serotonin nature. Professional athletes, movie stars, photographers, and fashion models might also have serotonin natures. Serotonin dominance would also be essential for trouble-shooting business executives hired to save floundering companies; for surgeons, orthopedists, and chiropractors; for detectives and investigators; and for specialists in crisis intervention. If there is excitement anywhere, you will find it, whether it be parties, celebrations, video games, casino gambling, mountain climbing, hunting, skydiving, hang-gliding, skiing, or scuba diving. You are passionate in your relationships, but refuse to be tied down. It is important that those close to you recognize your need for freedom. You can be the life of the party; you can be cheerful, optimistic, and easygoing. You want everyone to join in and be part of your fun. You may have a special fondness for children, although you may be overwhelmed by the commitment needed to care for them. You delight in playing with them, and the roles of a favorite aunt, uncle or grandparent appeal the most to you. You are intensely loyal to coworkers, friends, and family. People appreciate your practical side and the way you make the best of any situation. You have many and varied friendships, but they may be more broad than deep. Your impulsivity and desire for new experiences may move you away before deeper roots are formed. You disdain order and routine, and with your love for independence, this can put a strain on your closest relationships. When you are maximizing your serotonin nature, you experience serenity throughout the day. You experience highs doing what others consider dangerous, such as bungee jumping, motorboat racing, whitewater rafting, motorcycling, or just staying out all night carousing. When you play hard, your body is in serotonin overdrive, and you are having the time of your life.",
    excess:
      "Producing too much serotonin can make you extremely nervous. You can become hesitant, distracted, vulnerable to any manner of criticism, and morbidly afraid of being disliked. In the extreme, someone with an excessive serotonin personality is painfully shy and sees himself as inadequate and inferior. Such people are plagued by sadness, anger, and a desperate desire for interpersonal interaction, which, ironically, they are too fearful to attempt.",
  },
};

export const NATURE_DEFICIENCY_DESCRIPTIONS: Record<
  Nature,
  NatureDeficiencyDescription
> = {
  dopamine: {
    intro:
      "Early warning signs are loss of energy, fatigue, sluggishness, memory loss, or the blues.",
    physical:
      "Anemia, balance problems, blood sugar instability, bone density loss, carbohydrate cravings, decreased appetite, decreased strength, diabetes, diarrhea, anorgasmia, digestion problems, hypersomnia, head and facial tremors, high blood pressure, hyperglycemia, joint pain, kidney problems, light-headedness, low libido, narcolepsy, obesity, Parkinson's, slow metabolism, slow rigid movements, substance abuse, sugar cravings, tension, tremors, thyroid problems, swallowing problems.",
    personality:
      "Aggression, anger, carelessness, depression, fear of being observed, guilt, hopelessness, worthlessness, pleasure-seeking behavior, stress intolerance, social isolation, mood swings, procrastination, self-destructive thoughts.",
    memory:
      "Distractibility, lack of follow-through, forgetfulness, lack of working memory, poor abstract thinking, slow processing speed.",
    attention:
      "ADD, decreased alertness, failure to finish tasks, hyperactivity, impulsive behavior, poor concentration.",
  },
  acetylcholine: {
    intro:
      "Acetylcholine controls your brain speed and the rate at which electrical signals are processed, connecting your physical experiences to memories and thoughts. When your brain speed slows with deficient acetylcholine, the brain does not have time to connect all the new stimuli to previously stored information, so it is discarded when the new information pours in. Your recall may become spotty, and you may not react to sensory stimuli as fast as before. This causes forgetfulness.",
    physical:
      "Agitation, Alzheimer's, anxiety, arthritis, autism, high cholesterol, decreased sexual ability, diabetes, problems urinating, dry cough, dry mouth, dyslexia, frequent urination, eye disorders, fat cravings, frequent bowel movements, glaucoma, lack of arousal, inflammatory problems, multiple sclerosis, osteoporosis, reading/writing disorders, slowness of movement, speech problems.",
    personality:
      "Bipolar disorder, math errors, changes in personality and language, hysterical behavior, mood swings, rule breaking.",
    memory:
      "Learning disorders, loss of immediate visual and verbal memory, memory disturbance, memory lapses.",
    attention:
      "Attention problems, difficulty concentrating, diminished comprehension, impaired abstract thinking, impaired creativity.",
  },
  gaba: {
    intro:
      "GABA is produced in the temporal lobes and is associated throughout the brain with calming, rhythmic theta waves – the \"idling frequency\" of neurons. GABA is the major inhibitory neurotransmitter of the brain, which keeps all of the other biochemicals in check. GABA controls the brain's rhythm so that you function mentally and physically at a steady pace. When your rhythm is thrown off by a GABA deficiency, you may begin to feel anxious, nervous, or irritable. Without enough GABA, your brain produces energy in bursts, which impacts your emotional well-being.",
    physical:
      "Tremors, allergies, appetite changes, backache, blurred vision, carbohydrate cravings, chest pain, clammy hands, constipation, decreased libido, diarrhea, difficulty swallowing, dizziness, dry mouth, excessive sleepiness, headache, hypertension, hyperventilation, insomnia, irritable bowel syndrome, muscle loss, muscle tension, nausea, night sweats, paresthesias, PMS, protein cravings, seizures, shortness of breath, stroke, heart palpitations, ringing in ears, trembling, twitching, urinary frequency.",
    personality:
      "Problems adjusting to stress, anxiety, depression, feelings of dread, excessive guilt, worthlessness, hopelessness, emotional immaturity, manic depression, obsessive compulsive disorder, phobias, rage, restlessness, thoughts of suicide, psychosis.",
    memory: "Poor verbal memory, global memory problems.",
    attention:
      "Difficulty concentrating, disorganized attention pattern associated with anxiety, high anxiety, impulsive attention errors (jumping the gun, erratic driving), inability to think clearly.",
  },
  serotonin: {
    intro:
      "Serotonin is produced in great quantities in the occipital lobes and helps create the neurological electricity for sight and rest, and also controls your cravings. The occipital lobes maintain your brain's overall balance, or synchrony, by regulating the output of all the primary brain waves. The four brain waves appear in varying combinations throughout the day, but at night serotonin allows the brain to recharge and rebalance. If these brain waves are out of sync, the left and right sides of your brain will be out of balance, and you might feel like you are going off the edge; you are overtired, out of control, and unable to get a restful sleep. When serotonin is unbalanced, your brain's ability to recharge itself is compromised. Serotonin burnout can occur from experiencing too much excitement or not getting enough sleep. When this happens, you simply cannot think clearly.",
    physical:
      "Aches and soreness, allergies, arthritis, backache, blurred vision, carbohydrate cravings, clammy hands, constipation or diarrhea, difficulty swallowing, dizziness, drug or alcohol addiction, drug reactions, dry mouth, hallucinations, headaches, high pain/pleasure threshold, hypersensitivity, excessive sleeping, hypertension, insomnia, muscle tension, nausea, night sweats, palpitations, paresthesias, PMS, premature ejaculation, premature orgasm for women, salt cravings, tachycardia, ringing in ears, tremors, urinary frequency, vomiting, weight gain.",
    personality:
      "Codependency, depersonalization, depression, impulsiveness, lack of artistic appreciation, lack of common sense, lack of pleasure, social isolation, masochistic tendencies, obsessive compulsive disorder, paranoia, perfectionism, phobias, rage, self-absorption, shyness.",
    memory: "Confusion, memory loss, too many ideas to manage.",
    attention:
      "Difficulty concentrating, hypervigilance, restlessness, slow reaction time.",
  },
};