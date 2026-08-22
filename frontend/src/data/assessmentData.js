// This file contains the assessment JSON structure with all careers, questions, and modes
// DO NOT expose correct_option or score to the frontend - keep these server-side only

export const assessmentJSON = {
  assessment_id: 'minerva_career_discovery_v4',
  title: 'Minerva Career Discovery Assessment',
  version: '4.0',
  careers: [
    {
      id: 'ui_ux',
      name: 'UI/UX Design',
      short_name: 'UI/UX',
      primary_dimension: 'user_centered_design',
      primary_dimension_name: 'User-Centered Design',
    },
    {
      id: 'development',
      name: 'Software Development',
      short_name: 'Development',
      primary_dimension: 'logical_problem_solving',
      primary_dimension_name: 'Logical Problem Solving',
    },
    {
      id: 'data',
      name: 'Data & Analytics',
      short_name: 'Data',
      primary_dimension: 'analytical_reasoning',
      primary_dimension_name: 'Analytical Reasoning',
    },
    {
      id: 'ai',
      name: 'AI & Machine Learning',
      short_name: 'AI/ML',
      primary_dimension: 'machine_learning_reasoning',
      primary_dimension_name: 'Machine Learning Reasoning',
    },
    {
      id: 'cyber',
      name: 'Cybersecurity',
      short_name: 'Cyber',
      primary_dimension: 'security_risk_reasoning',
      primary_dimension_name: 'Security & Risk Reasoning',
    },
  ],
  exploring_questions: [
    {
      id: 'UIUX_01',
      title: 'The beautiful app nobody can navigate',
      type: 'multiple-choice',
      interaction: 'multiple_choice',
      instruction:
        'A university app looks polished, but students keep missing the exam schedule. You have one hour to decide what to investigate first. What is the strongest move?',
      options: [
        {
          id: 'A',
          text: 'Observe a few students trying to find the schedule and note exactly where they hesitate.',
        },
        {
          id: 'B',
          text: 'Add a notification feature without checking why students miss it now.',
        },
        {
          id: 'C',
          text: 'Add brighter colors and animations to make the schedule stand out.',
        },
        {
          id: 'D',
          text: 'Replace the entire app without testing.',
        },
      ],
      correct_option: 'A',
      score: 1,
      career: 'ui_ux',
      career_name: 'UI/UX Design',
      primary_dimension: 'user_centered_design',
      secondary_dimension: 'user_research',
      behavior_signals: ['user_research', 'usability', 'visual_hierarchy'],
    },
    {
      id: 'UIUX_02',
      title: 'Fix the checkout before users give up',
      type: 'multiple-choice',
      interaction: 'multiple_choice',
      instruction:
        'An online store has a 40% checkout drop-off. Testing shows users repeatedly look between the delivery-address field and a small Continue button. Which change would you test first?',
      options: [
        {
          id: 'A',
          text: 'Replace the database because checkout completion is low.',
        },
        {
          id: 'B',
          text: 'Make the primary action clear, place it near the form flow, and test the change with users.',
        },
        {
          id: 'C',
          text: 'Add decorative illustrations around the form.',
        },
        {
          id: 'D',
          text: 'Ignore the drop-off because some users will always leave.',
        },
      ],
      correct_option: 'B',
      score: 1,
      career: 'ui_ux',
      career_name: 'UI/UX Design',
      primary_dimension: 'user_centered_design',
      secondary_dimension: 'usability',
      behavior_signals: ['usability', 'interaction_design', 'iterative_design'],
    },
    {
      id: 'DEV_01',
      title: 'The button works for everyone except one case',
      type: 'multiple-choice',
      interaction: 'multiple_choice',
      instruction:
        'A registration button works for most users but crashes the app when the name field is left empty. What would you naturally investigate first?',
      options: [
        {
          id: 'A',
          text: 'Redesign the registration page before checking the crash.',
        },
        {
          id: 'B',
          text: 'Delete the registration feature and build it again from scratch.',
        },
        {
          id: 'C',
          text: 'Reproduce the empty-name case, inspect the error, and trace the code handling that input.',
        },
        {
          id: 'D',
          text: 'Ignore it and hope users do not encounter this edge case.',
        },
      ],
      correct_option: 'C',
      score: 1,
      career: 'development',
      career_name: 'Software Development',
      primary_dimension: 'logical_problem_solving',
      secondary_dimension: 'debugging',
      behavior_signals: ['logical_reasoning', 'debugging', 'problem_solving'],
    },
    {
      id: 'DEV_02',
      title: 'Turn a messy task into an algorithm',
      type: 'multiple-choice',
      interaction: 'multiple_choice',
      instruction:
        'You need to process 1,000 student marks and print only students who scored 80 or above. Which approach shows the strongest programming thinking?',
      options: [
        {
          id: 'A',
          text: 'Write 1,000 separate print statements so every student has its own code.',
        },
        {
          id: 'B',
          text: 'Change the interface colors to make high marks easier to see.',
        },
        {
          id: 'C',
          text: 'Sort the students alphabetically because names determine eligibility.',
        },
        {
          id: 'D',
          text: 'Use a loop to check each student: if their score >= 80, print them. This handles all 1,000 automatically.',
        },
      ],
      correct_option: 'D',
      score: 1,
      career: 'development',
      career_name: 'Software Development',
      primary_dimension: 'logical_problem_solving',
      secondary_dimension: 'algorithmic_thinking',
      behavior_signals: ['algorithmic_thinking', 'logic', 'problem_solving'],
    },
    {
      id: 'DATA_01',
      title: 'The sales table has a story hidden inside it',
      type: 'multiple-choice',
      interaction: 'multiple_choice',
      instruction:
        'A shop gives you 50,000 sales records and says, "Sales fell last month." What would be the most useful first analysis?',
      options: [
        {
          id: 'A',
          text: 'Compare sales across time, products, regions, and other relevant factors to find where the change occurred.',
        },
        {
          id: 'B',
          text: 'Build a new shopping interface before understanding the sales pattern.',
        },
        {
          id: 'C',
          text: 'Guess that customers lost interest without checking the records.',
        },
        {
          id: 'D',
          text: 'Assume the data is wrong and start over.',
        },
      ],
      correct_option: 'A',
      score: 1,
      career: 'data',
      career_name: 'Data & Analytics',
      primary_dimension: 'analytical_reasoning',
      secondary_dimension: 'analytical_thinking',
      behavior_signals: ['analytical_thinking', 'pattern_recognition', 'data_reasoning'],
    },
    {
      id: 'DATA_02',
      title: 'Find the pattern, not just the number',
      type: 'multiple-choice',
      interaction: 'multiple_choice',
      instruction:
        'A website gets 1,000 visits on Monday, 1,050 on Tuesday, 1,020 on Wednesday, 1,600 on Thursday, and 1,580 on Friday. The team asks why traffic jumped. What is the strongest next step?',
      options: [
        {
          id: 'A',
          text: 'Assume Thursday\'s number is an error and remove it immediately.',
        },
        {
          id: 'B',
          text: 'Investigate what changed around Thursday and compare traffic sources, campaigns, devices, and other relevant dimensions.',
        },
        {
          id: 'C',
          text: 'Redesign the website without checking what caused the traffic change.',
        },
        {
          id: 'D',
          text: 'Report the higher numbers as a success without understanding the cause.',
        },
      ],
      correct_option: 'B',
      score: 1,
      career: 'data',
      career_name: 'Data & Analytics',
      primary_dimension: 'analytical_reasoning',
      secondary_dimension: 'analytical_thinking',
      behavior_signals: ['analytical_thinking', 'pattern_recognition', 'evidence_based_reasoning'],
    },
    {
      id: 'AI_01',
      title: 'Teach a model to predict student support needs',
      type: 'multiple-choice',
      interaction: 'multiple_choice',
      instruction:
        'You have past attendance, assignment, and exam data. Your goal is to predict which students may need academic support next month. Which task would most interest someone suited to AI/ML?',
      options: [
        {
          id: 'A',
          text: 'Inspect login attempts for suspicious network activity.',
        },
        {
          id: 'B',
          text: 'Choose the dashboard\'s colors and typography.',
        },
        {
          id: 'C',
          text: 'Train and evaluate a model that learns relationships in the historical data and predicts outcomes for new students.',
        },
        {
          id: 'D',
          text: 'Write the welcome email message for students.',
        },
      ],
      correct_option: 'C',
      score: 1,
      career: 'ai',
      career_name: 'AI & Machine Learning',
      primary_dimension: 'machine_learning_reasoning',
      secondary_dimension: 'prediction',
      behavior_signals: ['machine_learning_reasoning', 'prediction', 'model_evaluation'],
    },
    {
      id: 'AI_02',
      title: 'When the model gets fooled',
      type: 'multiple-choice',
      interaction: 'multiple_choice',
      instruction:
        'A spam detector is 98% accurate on the emails it trained on but performs poorly on new emails. What would you want to investigate first?',
      options: [
        {
          id: 'A',
          text: 'Whether the firewall should replace the model.',
        },
        {
          id: 'B',
          text: 'Whether every training example should simply be duplicated.',
        },
        {
          id: 'C',
          text: 'Whether the email application\'s font is too small.',
        },
        {
          id: 'D',
          text: 'Whether the model learned the training data too well (overfitting) and cannot generalize to new emails.',
        },
      ],
      correct_option: 'D',
      score: 1,
      career: 'ai',
      career_name: 'AI & Machine Learning',
      primary_dimension: 'machine_learning_reasoning',
      secondary_dimension: 'generalization',
      behavior_signals: ['machine_learning_reasoning', 'generalization', 'model_evaluation'],
    },
    {
      id: 'CYBER_01',
      title: 'The login pattern that should make you suspicious',
      type: 'multiple-choice',
      interaction: 'multiple_choice',
      instruction:
        'A company sees hundreds of failed login attempts against one account from many unfamiliar locations within ten minutes. What would be the strongest first response?',
      options: [
        {
          id: 'A',
          text: 'Investigate the pattern, protect the account, and determine whether the activity indicates an attack.',
        },
        {
          id: 'B',
          text: 'Redesign the login page because the screen may look outdated.',
        },
        {
          id: 'C',
          text: 'Ignore the attempts unless the user reports a problem.',
        },
        {
          id: 'D',
          text: 'Blame the user for choosing a weak password.',
        },
      ],
      correct_option: 'A',
      score: 1,
      career: 'cyber',
      career_name: 'Cybersecurity',
      primary_dimension: 'security_risk_reasoning',
      secondary_dimension: 'risk_detection',
      behavior_signals: ['risk_detection', 'incident_reasoning', 'security_awareness'],
    },
    {
      id: 'CYBER_02',
      title: 'One suspicious email, four possible reactions',
      type: 'multiple-choice',
      interaction: 'multiple_choice',
      instruction:
        'You receive an urgent email asking you to open a link and enter your company password. The sender name looks familiar, but the address is slightly different. What is the safest reasoning?',
      options: [
        {
          id: 'A',
          text: 'Reply with your password and ask whether the request is genuine.',
        },
        {
          id: 'B',
          text: 'Verify the sender and request through a trusted channel before clicking or entering credentials.',
        },
        {
          id: 'C',
          text: 'Forward the email to coworkers and ask them to try the link first.',
        },
        {
          id: 'D',
          text: 'Click immediately because it is probably legitimate.',
        },
      ],
      correct_option: 'B',
      score: 1,
      career: 'cyber',
      career_name: 'Cybersecurity',
      primary_dimension: 'security_risk_reasoning',
      secondary_dimension: 'risk_detection',
      behavior_signals: ['risk_detection', 'security_awareness', 'social_engineering_awareness'],
    },
  ],
  career_questions: {
    ui_ux: [
      {
        id: 'UIUX_01_CM',
        title: 'Users cannot find the feature they need',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'A university app looks attractive, but students keep missing the exam schedule. You can make only one first move. What should you do?',
        options: [
          {
            id: 'A',
            text: 'Launch with more notification features immediately.',
          },
          {
            id: 'B',
            text: 'Change all colors to brighter shades.',
          },
          {
            id: 'C',
            text: 'Watch students attempt to find the schedule and note where they struggle.',
          },
          {
            id: 'D',
            text: 'Rebuild the entire interface.',
          },
        ],
        correct_option: 'C',
        score: 1,
        career: 'ui_ux',
        career_name: 'UI/UX Design',
        primary_dimension: 'user_centered_design',
        secondary_dimension: 'user_research',
      },
      {
        id: 'UIUX_02_CM',
        title: 'The checkout screen is making users hesitate',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'During usability testing, users hesitate because two buttons look equally important: "Save for Later" and "Place Order". What would you change first?',
        options: [
          {
            id: 'A',
            text: 'Make both buttons bigger.',
          },
          {
            id: 'B',
            text: 'Make both buttons the same color.',
          },
          {
            id: 'C',
            text: 'Add more text to explain each button.',
          },
          {
            id: 'D',
            text: 'Make "Place Order" visually distinct and primary; keep "Save for Later" secondary.',
          },
        ],
        correct_option: 'D',
        score: 1,
        career: 'ui_ux',
        career_name: 'UI/UX Design',
        primary_dimension: 'user_centered_design',
        secondary_dimension: 'visual_hierarchy',
      },
      {
        id: 'UIUX_03_CM',
        title: 'A form is losing users halfway through',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'A registration form has 12 fields and many users quit after field 7. Which investigation gives you the strongest evidence before redesigning it?',
        options: [
          {
            id: 'A',
            text: 'Run a usability test where users attempt to complete the form and observe where they get confused.',
          },
          {
            id: 'B',
            text: 'Add animations to make the form more fun.',
          },
          {
            id: 'C',
            text: 'Immediately remove half the fields.',
          },
          {
            id: 'D',
            text: 'Increase the text size across the form.',
          },
        ],
        correct_option: 'A',
        score: 1,
        career: 'ui_ux',
        career_name: 'UI/UX Design',
        primary_dimension: 'user_centered_design',
        secondary_dimension: 'usability_testing',
      },
      {
        id: 'UIUX_04_CM',
        title: 'Two designs solve the same task',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'Design A looks more stylish, but users complete the task in 45 seconds. Design B looks simpler, but users complete it in 20 seconds with fewer mistakes. Which conclusion is strongest?',
        options: [
          {
            id: 'A',
            text: 'Choose Design A because it looks better.',
          },
          {
            id: 'B',
            text: 'Design B is more usable: users complete tasks faster with fewer errors. Prioritize usability.',
          },
          {
            id: 'C',
            text: 'The styles do not matter; both designs are equally good.',
          },
          {
            id: 'D',
            text: 'Test with more users to be sure.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'ui_ux',
        career_name: 'UI/UX Design',
        primary_dimension: 'user_centered_design',
        secondary_dimension: 'usability',
      },
      {
        id: 'UIUX_05_CM',
        title: 'Users report they don\'t understand a new feature',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'After launching a new feature, several users report confusion about how to use it. What is your strongest next step?',
        options: [
          {
            id: 'A',
            text: 'Ignore the reports because most users figured it out.',
          },
          {
            id: 'B',
            text: 'Write a detailed help document explaining every step.',
          },
          {
            id: 'C',
            text: 'Conduct interviews or usability tests with confused users to understand their mental model and where the design failed.',
          },
          {
            id: 'D',
            text: 'Remove the feature because it is too complex.',
          },
        ],
        correct_option: 'C',
        score: 1,
        career: 'ui_ux',
        career_name: 'UI/UX Design',
        primary_dimension: 'user_centered_design',
        secondary_dimension: 'user_research',
      },
    ],
    development: [
      {
        id: 'DEV_01_CM',
        title: 'Your new feature works on your computer but fails for users',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'A feature passes all your local tests but crashes for some users in production. What is your first debugging step?',
        options: [
          {
            id: 'A',
            text: 'Blame the users for misconfiguring their environment.',
          },
          {
            id: 'B',
            text: 'Collect the error logs from real users, reproduce the scenario locally, and identify where your code differs from the expected behavior.',
          },
          {
            id: 'C',
            text: 'Rewrite the entire feature from scratch.',
          },
          {
            id: 'D',
            text: 'Add more features to distract from the bug.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'development',
        career_name: 'Software Development',
        primary_dimension: 'logical_problem_solving',
        secondary_dimension: 'debugging',
      },
      {
        id: 'DEV_02_CM',
        title: 'Fix the code without making it worse',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'You have a function that calculates tax. If income > 50000, apply 20% tax; otherwise apply 10%. A user reports the tax is wrong for income = 50000. What is your fix?',
        options: [
          {
            id: 'A',
            text: 'Always apply 15% tax regardless of income.',
          },
          {
            id: 'B',
            text: 'Change the condition to >= 50000 so income exactly at 50000 uses 20% tax, and verify this aligns with requirements.',
          },
          {
            id: 'C',
            text: 'Ignore the report because 50000 is a rare case.',
          },
          {
            id: 'D',
            text: 'Remove the tax calculation entirely.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'development',
        career_name: 'Software Development',
        primary_dimension: 'logical_problem_solving',
        secondary_dimension: 'conditional_logic',
      },
      {
        id: 'DEV_03_CM',
        title: 'Your code is too slow for large datasets',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'Your search function works but gets very slow with 100,000 records. You currently check every record one by one. What should you investigate?',
        options: [
          {
            id: 'A',
            text: 'Change the background color of the UI to make it feel faster.',
          },
          {
            id: 'B',
            text: 'Use an index or sorting algorithm to reduce the number of records checked, targeting O(log n) instead of O(n).',
          },
          {
            id: 'C',
            text: 'Tell users to limit their data.',
          },
          {
            id: 'D',
            text: 'Hope the data stays small.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'development',
        career_name: 'Software Development',
        primary_dimension: 'logical_problem_solving',
        secondary_dimension: 'algorithms',
      },
      {
        id: 'DEV_04_CM',
        title: 'The function has too many responsibilities',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'A function validates user input, saves to database, and sends an email all in one. When the email fails, the entire function fails and the user is unsaved. What should you do?',
        options: [
          {
            id: 'A',
            text: 'Keep everything in one function because it is simpler.',
          },
          {
            id: 'B',
            text: 'Separate the concerns: validate first, then save, then email independently. This way, a failed email does not prevent saving the user.',
          },
          {
            id: 'C',
            text: 'Remove the email feature.',
          },
          {
            id: 'D',
            text: 'Add more validations to the email function.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'development',
        career_name: 'Software Development',
        primary_dimension: 'logical_problem_solving',
        secondary_dimension: 'software_engineering',
      },
      {
        id: 'DEV_05_CM',
        title: 'Your code is hard to read and teammates struggle',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'Your code works but uses unclear variable names and nested logic that is hard to follow. A teammate asks you to simplify it. What is the strongest approach?',
        options: [
          {
            id: 'A',
            text: 'Refuse to change because the code works.',
          },
          {
            id: 'B',
            text: 'Refactor: use clear variable names, break complex logic into smaller functions, and add comments. Then test to ensure behavior does not change.',
          },
          {
            id: 'C',
            text: 'Add more comments but keep the unclear code.',
          },
          {
            id: 'D',
            text: 'Tell the teammate to learn to read complex code.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'development',
        career_name: 'Software Development',
        primary_dimension: 'logical_problem_solving',
        secondary_dimension: 'software_engineering',
      },
    ],
    data: [
      {
        id: 'DATA_01_CM',
        title: 'Numbers look wrong; check the data first',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'Your dashboard shows revenue dropped 90% overnight. Before reporting this to leadership, what should you check first?',
        options: [
          {
            id: 'A',
            text: 'Immediately alert the CEO.',
          },
          {
            id: 'B',
            text: 'Assume the data is correct and no further investigation is needed.',
          },
          {
            id: 'C',
            text: 'Inspect the raw data for missing records, errors, or pipeline issues. Verify the data collection is working properly.',
          },
          {
            id: 'D',
            text: 'Ignore it because single-day changes are common.',
          },
        ],
        correct_option: 'C',
        score: 1,
        career: 'data',
        career_name: 'Data & Analytics',
        primary_dimension: 'analytical_reasoning',
        secondary_dimension: 'data_quality',
      },
      {
        id: 'DATA_02_CM',
        title: 'Find the real cause, not just the symptom',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'Customer complaints increased 50% in region X last week, but region Y stayed stable. What is your first analysis?',
        options: [
          {
            id: 'A',
            text: 'Assume region X staff is worse.',
          },
          {
            id: 'B',
            text: 'Segment the data: compare demographics, products, times, channels, and other factors between regions to identify what is different.',
          },
          {
            id: 'C',
            text: 'Ignore it because 50% sounds like noise.',
          },
          {
            id: 'D',
            text: 'Fire everyone in region X.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'data',
        career_name: 'Data & Analytics',
        primary_dimension: 'analytical_reasoning',
        secondary_dimension: 'data_reasoning',
      },
      {
        id: 'DATA_03_CM',
        title: 'One number seems way out of line',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'Your daily metrics show: Day 1-5: ~1000 users each, Day 6: 15000 users, Day 7-10: ~1000 users again. What is your first step?',
        options: [
          {
            id: 'A',
            text: 'Celebrate the increase without investigating.',
          },
          {
            id: 'B',
            text: 'Investigate day 6: check for data pipeline errors, bots, duplicate counting, or external events that drove real traffic.',
          },
          {
            id: 'C',
            text: 'Remove day 6 from the analysis.',
          },
          {
            id: 'D',
            text: 'Assume it is normal variation.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'data',
        career_name: 'Data & Analytics',
        primary_dimension: 'analytical_reasoning',
        secondary_dimension: 'anomaly_detection',
      },
      {
        id: 'DATA_04_CM',
        title: 'Make the insights visible to the team',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'You have discovered that users from mobile devices convert at 2x the rate of desktop users. How should you share this insight?',
        options: [
          {
            id: 'A',
            text: 'Send a raw CSV file to leadership.',
          },
          {
            id: 'B',
            text: 'Create a clear visualization (chart, dashboard) showing the conversion difference and its business impact, then explain the finding in plain language.',
          },
          {
            id: 'C',
            text: 'Email a 50-page technical report.',
          },
          {
            id: 'D',
            text: 'Keep the insight to yourself.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'data',
        career_name: 'Data & Analytics',
        primary_dimension: 'analytical_reasoning',
        secondary_dimension: 'data_visualization',
      },
      {
        id: 'DATA_05_CM',
        title: 'Decide based on evidence, not opinion',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'Your manager thinks the website needs a redesign. The data shows users are not actually frustrated. How do you approach this?',
        options: [
          {
            id: 'A',
            text: 'Agree with the manager without checking the data.',
          },
          {
            id: 'B',
            text: 'Show the data: present satisfaction metrics, bounce rates, task completion rates, and user feedback. Explain what the evidence says.',
          },
          {
            id: 'C',
            text: 'Ignore the manager.',
          },
          {
            id: 'D',
            text: 'Redesign anyway to be safe.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'data',
        career_name: 'Data & Analytics',
        primary_dimension: 'analytical_reasoning',
        secondary_dimension: 'evidence_based_reasoning',
      },
    ],
    ai: [
      {
        id: 'AI_01_CM',
        title: 'Build a model that predicts customer churn',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'You have customer data (purchase history, support tickets, demographics). Your goal is to predict which customers will leave in the next month. What is your workflow?',
        options: [
          {
            id: 'A',
            text: 'Pick random features and hope they work.',
          },
          {
            id: 'B',
            text: 'Analyze historical data, engineer meaningful features, train a model, evaluate on unseen data (test set), and iterate based on performance.',
          },
          {
            id: 'C',
            text: 'Use the first algorithm you find.',
          },
          {
            id: 'D',
            text: 'Train on all data without splitting into train/test.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'ai',
        career_name: 'AI & Machine Learning',
        primary_dimension: 'machine_learning_reasoning',
        secondary_dimension: 'training',
      },
      {
        id: 'AI_02_CM',
        title: 'Your model performs great in testing but fails in production',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'A recommendation model scores 95% accuracy on your test set but only 60% on real users. What is likely happening?',
        options: [
          {
            id: 'A',
            text: 'The test data is perfectly representative and nothing is wrong.',
          },
          {
            id: 'B',
            text: 'The model learned the test data too well (overfit) and does not generalize. Check for data leakage, training/test mismatch, or distribution shifts.',
          },
          {
            id: 'C',
            text: 'Real users are stupider than test users.',
          },
          {
            id: 'D',
            text: 'The model is perfect; users just do not know how to use it.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'ai',
        career_name: 'AI & Machine Learning',
        primary_dimension: 'machine_learning_reasoning',
        secondary_dimension: 'generalization',
      },
      {
        id: 'AI_03_CM',
        title: 'Choose the right metric for your goal',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'Your fraud detection model catches 90% of fraud cases (high recall) but has a 20% false positive rate. Your business pays $100 to investigate each false positive. Should you optimize for recall or precision?',
        options: [
          {
            id: 'A',
            text: 'Optimize for recall because catching fraud is the only thing that matters.',
          },
          {
            id: 'B',
            text: 'Consider the business cost: 20% false positives cost money. Balance recall and precision based on the cost-benefit trade-off.',
          },
          {
            id: 'C',
            text: 'Optimize for accuracy.',
          },
          {
            id: 'D',
            text: 'Choose randomly.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'ai',
        career_name: 'AI & Machine Learning',
        primary_dimension: 'machine_learning_reasoning',
        secondary_dimension: 'metrics',
      },
      {
        id: 'AI_04_CM',
        title: 'Design features that matter',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'Your model predicts house prices. You have 50 raw features but many are redundant or irrelevant. How should you prepare the data?',
        options: [
          {
            id: 'A',
            text: 'Use all 50 features as-is.',
          },
          {
            id: 'B',
            text: 'Analyze which features correlate with price, combine related features, handle missing data, and select the most predictive ones.',
          },
          {
            id: 'C',
            text: 'Remove half at random.',
          },
          {
            id: 'D',
            text: 'Only use the first feature.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'ai',
        career_name: 'AI & Machine Learning',
        primary_dimension: 'machine_learning_reasoning',
        secondary_dimension: 'feature_engineering',
      },
      {
        id: 'AI_05_CM',
        title: 'The model works today but fails tomorrow',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'Your production model achieved 85% accuracy last month but only 70% this month. Real data has shifted. What should you do?',
        options: [
          {
            id: 'A',
            text: 'Ignore it and continue using the old model.',
          },
          {
            id: 'B',
            text: 'Retrain the model on new data to adapt to distribution shifts, and monitor performance continuously.',
          },
          {
            id: 'C',
            text: 'Delete the model.',
          },
          {
            id: 'D',
            text: 'Blame the users for changing.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'ai',
        career_name: 'AI & Machine Learning',
        primary_dimension: 'machine_learning_reasoning',
        secondary_dimension: 'model_monitoring',
      },
    ],
    cyber: [
      {
        id: 'CYBER_01_CM',
        title: 'Detect and respond to a breach',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'You detect unauthorized access to a customer database at 2am. What is your first step?',
        options: [
          {
            id: 'A',
            text: 'Go back to sleep and handle it in the morning.',
          },
          {
            id: 'B',
            text: 'Immediately isolate the affected system, alert the security team, determine the scope of access, and preserve evidence for forensics.',
          },
          {
            id: 'C',
            text: 'Tell one person via email.',
          },
          {
            id: 'D',
            text: 'Assume it is a false alarm.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'cyber',
        career_name: 'Cybersecurity',
        primary_dimension: 'security_risk_reasoning',
        secondary_dimension: 'incident_response',
      },
      {
        id: 'CYBER_02_CM',
        title: 'Spot the phishing attempt',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'An email arrives asking you to update your company credentials urgently. It looks official and uses your company logo. What is the safest action?',
        options: [
          {
            id: 'A',
            text: 'Click the link and enter your password immediately.',
          },
          {
            id: 'B',
            text: 'Call IT directly (using a known internal number) to verify the request before clicking any links or entering credentials.',
          },
          {
            id: 'C',
            text: 'Forward to all coworkers.',
          },
          {
            id: 'D',
            text: 'Assume official-looking emails are always legitimate.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'cyber',
        career_name: 'Cybersecurity',
        primary_dimension: 'security_risk_reasoning',
        secondary_dimension: 'social_engineering_awareness',
      },
      {
        id: 'CYBER_03_CM',
        title: 'Decide which risks to address first',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'Your team discovers three vulnerabilities: 1) Outdated SSL certificate (low impact if fixed), 2) Weak password policy (medium impact, affects many users), 3) SQL injection flaw (high impact, exposes database). Which do you prioritize?',
        options: [
          {
            id: 'A',
            text: 'Fix #1 because it is easiest.',
          },
          {
            id: 'B',
            text: 'Fix #3 because it has the highest impact and risk. Then #2. Then #1.',
          },
          {
            id: 'C',
            text: 'Ignore all of them.',
          },
          {
            id: 'D',
            text: 'Fix in alphabetical order.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'cyber',
        career_name: 'Cybersecurity',
        primary_dimension: 'security_risk_reasoning',
        secondary_dimension: 'risk_assessment',
      },
      {
        id: 'CYBER_04_CM',
        title: 'Contain the damage quickly',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'Malware is detected on 5% of company computers. The security team suggests disconnecting all affected machines from the network immediately. Should you do it?',
        options: [
          {
            id: 'A',
            text: 'No, because it might disrupt business.',
          },
          {
            id: 'B',
            text: 'Yes, immediately isolate affected machines to prevent spread. Then investigate offline and restore from clean backups.',
          },
          {
            id: 'C',
            text: 'Wait and see if it spreads.',
          },
          {
            id: 'D',
            text: 'Shut down the entire company network.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'cyber',
        career_name: 'Cybersecurity',
        primary_dimension: 'security_risk_reasoning',
        secondary_dimension: 'containment',
      },
      {
        id: 'CYBER_05_CM',
        title: 'Use strong access controls',
        type: 'multiple-choice',
        interaction: 'multiple_choice',
        instruction:
          'An employee leaves the company. What is the proper procedure?',
        options: [
          {
            id: 'A',
            text: 'Let them keep their access for a few weeks until they are no longer needed.',
          },
          {
            id: 'B',
            text: 'Immediately revoke all access (accounts, systems, badges, credentials) and change any shared passwords they knew.',
          },
          {
            id: 'C',
            text: 'Hope they do not misuse their access.',
          },
          {
            id: 'D',
            text: 'Only revoke access if they were angry.',
          },
        ],
        correct_option: 'B',
        score: 1,
        career: 'cyber',
        career_name: 'Cybersecurity',
        primary_dimension: 'security_risk_reasoning',
        secondary_dimension: 'access_control',
      },
    ],
  },
}

// Helper function to get exploring questions
export function getExploringQuestions() {
  return assessmentJSON.exploring_questions
}

// Helper function to get career-specific questions
export function getCareerQuestions(careerId) {
  return assessmentJSON.career_questions[careerId] || []
}

// Helper function to get all careers
export function getCareers() {
  return assessmentJSON.careers
}

export default assessmentJSON
