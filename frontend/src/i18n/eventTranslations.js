// The database stores event texts in Romanian only. English versions live here, keyed by event id.
// An event without an entry here (for example one just added to the database) simply stays in
// Romanian until its English text is added below, so nothing ever breaks or goes blank.

const EVENTS_EN = {
  1: {
    title: 'Founding of ASIMBv',
    description: 'After years of preparation, the Mathematics and Computer Science students in Brașov laid the foundations of ASIMBv.',
    longDescription: `The story of ASIMBv began long before the official act. As early as 2022, a group of students from the Faculty of Mathematics and Computer Science in Brașov set out to create a real voice for their peers and started down the sometimes slow path of the bureaucracy needed to found an association.

On 6 October 2024, after two years of work and perseverance, ASIMBv was officially born and began its activity. From that moment, the association took on the mission of turning the university years into a complete experience: it connected students with leaders of the tech industry, developed innovative projects, supported academic initiatives and organised activities that made a difference.

This beginning laid the foundation for everything that followed: a community built by students, for students.`,
  },
  2: {
    title: 'Student Login',
    description: 'The welcome event for first-year students, held on the University Hill: a first contact with university life, the faculty and ASIMBv.',
    longDescription: `Student Login is the event through which ASIMBv welcomes the new students of the Faculty of Mathematics and Computer Science. The 2025 edition took place on 1 October, on the University Hill, and brought together freshers, older students and members of the association in a relaxed setting.

Around the same time, ASIMBv also welcomed the newcomers at its stand in the faculty, where they learned about the association's mission, vision and values and could read the 2025 Student Guide. For many of them, it was the first step towards an active and engaged university experience.`,
  },
  4: {
    title: 'Affiliation with the Romanian Students’ Union (UNI)',
    description: 'ASIMBv presented its mission to the Romanian Students’ Union and became part of the national UNI network.',
    longDescription: `Affiliating with the Romanian Students' Union was one of ASIMBv's most important steps since its founding. At a UNI meeting, the association was represented by its president, Teodor-Andrei Mincă, and its general secretary, Cezar-Mihai Vieru-Potecu, who presented who we are: an association founded in 2024 that brings together students eager to grow personally and professionally and to build ideas, projects and events together.

Through this partnership, ASIMBv joined a network of student associations from across the country, with opportunities for exchanging experience, training and representation beyond the faculty level. For the students of Brașov, this meant a stronger voice and a better-connected community.`,
  },
  6: {
    title: 'Year II Internship Fair Promotion',
    description: 'Second-year students met technology companies directly and learned what internship opportunities await them.',
    longDescription: `The internship fair for second-year students brought several IT and technology companies to the Aula of Transilvania University of Brașov, including Arvato Systems, CANAM, Rebel Dot, Siemens, VASS, Trimble, Enovation and Waters. ASIMBv promoted the event among students and made sure everyone could take part.

The programme was split by specialisation, so that each group had time to talk to the companies' representatives. Students could learn directly from employers what an internship involves and what opportunities opened up for them afterwards.`,
  },
  7: {
    title: 'Transilvania Codestorm@MI Hackathon',
    description: 'A hackathon organised at the Faculty of Mathematics and Computer Science, where student teams developed software solutions.',
    longDescription: `Transilvania Codestorm@MI returned in 2026 with a new edition of the hackathon for students passionate about programming. On 24 and 25 April, the teams gathered on the 2nd floor of the Faculty of Mathematics and Computer Science in Brașov and turned ideas into working applications, within a limited time and with plenty of collaboration.

The event was organised together with the faculty and had Siemens, Eviden, Rebel Dot, principal33 and VASS as partners. ASIMBv helped with the organisation as volunteers, alongside the colleagues who made sure everything ran smoothly.`,
  },
  8: {
    title: 'ASIMBv x BEST Brașov Workshop',
    description: 'A workshop on modern full-stack web development with Next.js, given by a student of the association, in partnership with BEST Brașov.',
    longDescription: `ASIMBv and BEST Brașov organised a workshop on modern web development together, on 21 May, in the Sergiu Chiriacescu Aula. A student from our association, Sebastian Șomu, a speaker at BIT 2026, gave a talk on full-stack web development with Next.js and on best practices for modern, scalable web applications, followed by a demo web application.

It was an interactive and dynamic course, in which students saw how a real project is built, from the interface to the server side. The event also showed what the collaboration between two student organisations can bring.`,
  },
  9: {
    title: 'UNI General Assembly Bucharest',
    description: 'The ASIMBv delegation took part in the UNI General Assembly and the Romanian Students’ Congress, held in Bucharest.',
    longDescription: `From 21 to 24 May, the ASIMBv delegation was in Bucharest for the UNI General Assembly, an event that brought together student associations from across the country. The association was represented by its president, Teodor-Andrei Mincă, and its general secretary, Cezar-Mihai Vieru-Potecu. The programme included the Romanian Students' Congress, held on 22 May under the message "Be the piece that completes the future".

Taking part gave us the chance to follow the statutory debates, exchange ideas with other associations and bring the perspective of the students of Brașov to the table. It was one more confirmation that being part of a national network brings experience, contacts and joint projects.`,
  },
  10: {
    title: 'Volunteering at UNI Days x ASIMBv x ASSM',
    description: 'ASIMBv volunteered at UNI Days in Brașov, the event through which the Romanian Students’ Union celebrated 25 years of student representation.',
    longDescription: `In July, Brașov hosted UNI Days, part of the celebration of 25 years since the founding of the Romanian Students' Union, under the message "Your voice. Ours. Everyone's.". The programme included the UNI 25 Gala, the parade of associations, a treasure hunt and sports activities.

From 17 to 19 July, ASIMBv members volunteered, together with ASSM, helping to organise the activities and keep the events running smoothly. For the team, it was an intense experience of teamwork and a chance to meet engaged students from across the country.`,
  },
  11: {
    title: 'UNI Teamwork & Leadership Bootcamp',
    description: 'A training bootcamp for student associations from the Centre-North and West regions, held in Sibiu, with workshops on teamwork and leadership.',
    longDescription: `From 21 to 23 August, Sibiu hosted the UNI bootcamp for the Centre-North and West regions, a training event attended by representatives of student associations from the region. ASIMBv was represented by two of its leaders: general secretary Cezar-Mihai Vieru-Potecu and IT department lead Sebastian Șomu.

Over the three days there were working sessions and workshops on teamwork and leadership, covering general concepts about how to collaborate, how to lead and how to motivate a team within an association. We came back to Brașov with new ideas and methods we can apply in our own projects.`,
  },
  12: {
    title: 'CNDOS National Debate Competition',
    description: 'Taking part in and supporting the students of Brașov in the academic competition of debate and structured argumentation.',
    longDescription: null,
  },
  13: {
    title: 'UNI General Assembly Alba Iulia',
    description: 'ASIMBv was present at the 73rd UNI General Assembly, held in Alba Iulia, alongside student associations from across the country.',
    longDescription: `From 10 to 13 September, Alba Iulia hosted the 73rd General Assembly of the Romanian Students' Union. Hundreds of students from associations across the country met for the statutory sessions, where the directions of the student movement for the new academic year were set.

The ASIMBv delegation consisted of the association's president, Teodor-Andrei Mincă, general secretary Cezar-Mihai Vieru-Potecu, PR department president Larisa Zaheu, and volunteers Florin-Adrian Mincu and Andrei Șerbănescu. Together they represented the interests of the students of Brașov and followed the decisions taken. Besides the work in the hall, the breaks, the shared activities and the meetings with colleagues from other cities mattered too, and made the General Assembly more than just a meeting.`,
  },
  14: {
    title: 'Student Login 2026 Edition',
    description: 'The welcome event for the new generation of the faculty’s students, held on the University Hill at the start of the academic year.',
    longDescription: `Student Login returned in 2026, on 1 October, again on the University Hill, to welcome the new students of the Faculty of Mathematics and Computer Science. It was an evening of getting to know each other between freshers, older students and members of the association.

ASIMBv told the newcomers who we are, what projects we have and how they can get involved. For many of them, Student Login was the first contact with student life and a good start to the academic year.`,
  },
  15: {
    title: 'GitHub DevDays Brașov',
    description: 'A workshop on GitHub Copilot, given by a Microsoft representative, in which participants learned through hands-on exercises how to develop software more efficiently with the help of artificial intelligence.',
    longDescription: `GitHub DevDays Brașov was a workshop on GitHub Copilot, organised by ASIMBv on 31 October and given by Alexandru-Răzvan Olariu, a Microsoft representative. Together we discovered how the software development process can be made more efficient with the help of artificial intelligence, including by working with Copilot from the command line.

The more than 20 participants explored both the core theoretical concepts and how to apply them in practice, through interactive exercises structured across different difficulty levels. Between modules, interactive quizzes helped them check, step by step, how much they had learned.

It was an event built on the principle of "learning by doing", from which participants left with skills they can apply directly in their own projects.`,
  },
  16: {
    title: 'ASIMBv’s 2nd Anniversary',
    description: 'ASIMBv celebrated two years of activity with an evening of game night and karaoke alongside its community.',
    longDescription: `On 6 October 2026, ASIMBv turned two years old. Two years in which the association became a constant presence in the university life of Brașov, bringing the community of students from the Faculty of Mathematics and Computer Science closer to the one in the city.

We remembered where we started: the founders, together with the faculty, took the initiative, organised meetings, drafted documents, set up departments and, above all, brought people in. After many obstacles, the association also reached the national level by joining the UNI family, and taking part in the Union's Days held in Brașov in July gave us the chance to show ASIMBv's volunteering spirit. In the faculty, we were always close to our colleagues, whether it was the Hackathon, the teacher feedback campaign, the internship fair or welcoming the freshers at Student Login.

That evening we marked it with a game night and karaoke, in a relaxed atmosphere, alongside our community. We wish we had been even busier than we were, and from now on we hope never to stop offering opportunities to the community we represent. Happy birthday, ASIMBv!`,
  },
};

// Role headings shown above partner logos on an event page (stored in Romanian in the database).
const ROLES_EN = {
  'Companii participante': 'Participating companies',
  'Organizat împreună cu': 'Organised together with',
  'Partenerii hackathonului': 'Hackathon partners',
};

const MONTHS_EN = {
  ianuarie: 'January', februarie: 'February', martie: 'March', aprilie: 'April', mai: 'May',
  iunie: 'June', iulie: 'July', august: 'August', septembrie: 'September',
  octombrie: 'October', noiembrie: 'November', decembrie: 'December',
};

// "31 octombrie 2026" -> "31 October 2026", "21-24 mai 2026" -> "21-24 May 2026", "Septembrie 2026" -> "September 2026".
// Anything that doesn't contain a Romanian month name is returned unchanged.
export const translateDate = (date, lang) => {
  if (lang !== 'en' || !date) return date;
  return date.replace(/[a-zăâîșț]+/gi, (word) => MONTHS_EN[word.toLowerCase()] ?? word);
};

export const translateRole = (role, lang) => (lang === 'en' ? ROLES_EN[role] ?? role : role);

// Returns the event with its texts in the chosen language. Untranslated fields keep the Romanian text.
export const localizeEvent = (event, lang) => {
  if (!event || lang !== 'en') return event;
  const english = EVENTS_EN[event.id];
  return {
    ...event,
    title: english?.title ?? event.title,
    description: english?.description ?? event.description,
    longDescription: english?.longDescription ?? event.longDescription,
    date: translateDate(event.date, lang),
  };
};
