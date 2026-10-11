import { useEffect, useMemo, useState } from "react";
import "./Roadmap.css";

const ROADMAPS = {
  "Full Stack Developer": [
    {
      title: "Web Development Fundamentals",
      duration: "2 weeks",
      goal: "Understand how websites are created.",
      topics: [
        ["HTML", "Elements, headings, paragraphs, links, images, forms, semantic tags"],
        ["CSS", "Selectors, box model, margins, padding, Flexbox, Grid"],
        ["JavaScript", "Variables, data types, operators, conditions, loops, functions"],
        ["JavaScript Practice", "Arrays, objects, DOM manipulation, events, promises, fetch"],
      ],
      tasks: [
        "Create a personal profile webpage using HTML.",
        "Style the page using CSS, Flexbox and Grid.",
        "Add form validation using JavaScript.",
        "Make the webpage responsive for mobile and desktop.",
      ],
      project: "Build a responsive personal portfolio website.",
      resources: [
        ["HTML and CSS", "https://developer.mozilla.org/en-US/docs/Learn_web_development"],
        ["JavaScript", "https://javascript.info/"],
      ],
    },
    {
      title: "Frontend Development with React",
      duration: "3 weeks",
      goal: "Build interactive user interfaces.",
      topics: [
        ["React Basics", "Components, JSX, props, state and events"],
        ["React Hooks", "useState, useEffect and useMemo basics"],
        ["Forms", "Controlled inputs, validation and form submission"],
        ["API Integration", "Fetch data, Axios, loading states and error handling"],
        ["Application Structure", "Reusable components, conditional rendering and lists"],
      ],
      tasks: [
        "Create reusable React components.",
        "Build a form with validation.",
        "Fetch and display data from an API.",
        "Add search, filtering and loading indicators.",
      ],
      project: "Build a student dashboard using React and API data.",
      resources: [
        ["React Documentation", "https://react.dev/learn"],
        ["MDN Web Development", "https://developer.mozilla.org/en-US/docs/Learn_web_development"],
      ],
    },
    {
      title: "Java and Spring Boot Backend",
      duration: "4 weeks",
      goal: "Create backend APIs using Java.",
      topics: [
        ["Java Fundamentals", "Variables, data types, operators, conditions and loops"],
        ["Object-Oriented Programming", "Classes, objects, inheritance, polymorphism and encapsulation"],
        ["Java Collections", "List, Set, Map, ArrayList and HashMap"],
        ["Exception Handling", "try, catch, finally and custom exceptions"],
        ["Spring Boot", "Controllers, services, repositories, dependency injection and entities"],
        ["REST APIs", "GET, POST, PUT, DELETE, request bodies and response status codes"],
      ],
      tasks: [
        "Write Java programs using classes and objects.",
        "Create a Spring Boot project.",
        "Build CRUD REST APIs.",
        "Separate controller, service and repository logic.",
      ],
      project: "Build a student management REST API.",
      resources: [
        ["Java Tutorials", "https://dev.java/learn/"],
        ["Spring Guides", "https://spring.io/guides"],
      ],
    },
    {
      title: "MySQL and Database Design",
      duration: "2 weeks",
      goal: "Store and retrieve application data.",
      topics: [
        ["SQL Basics", "SELECT, INSERT, UPDATE and DELETE"],
        ["Filtering and Sorting", "WHERE, ORDER BY, GROUP BY and HAVING"],
        ["Relationships", "Primary keys, foreign keys and one-to-many relationships"],
        ["Advanced Queries", "JOINs, aggregate functions and subqueries"],
        ["Database Design", "Normalization and constraints"],
        ["Spring Integration", "Spring Data JPA, entities and repositories"],
      ],
      tasks: [
        "Create related tables with primary and foreign keys.",
        "Write 15 SQL queries.",
        "Practice INNER JOIN and LEFT JOIN.",
        "Connect Spring Boot to MySQL.",
      ],
      project: "Create a course registration database with CRUD APIs.",
      resources: [
        ["MySQL Documentation", "https://dev.mysql.com/doc/"],
        ["SQLBolt", "https://sqlbolt.com/"],
      ],
    },
    {
      title: "Authentication and Full-Stack Integration",
      duration: "3 weeks",
      goal: "Connect frontend, backend and database securely.",
      topics: [
        ["Integration", "Connect React to Spring Boot using Axios"],
        ["Authentication", "Registration, login, password hashing and JWT"],
        ["Authorization", "Protected routes and role-based access"],
        ["Validation", "Frontend and backend input validation"],
        ["Error Handling", "CORS, HTTP errors and useful error messages"],
        ["Testing", "Test API endpoints and important user flows"],
      ],
      tasks: [
        "Connect a React form to a Spring Boot API.",
        "Implement registration and login.",
        "Send JWT tokens in Authorization headers.",
        "Test success, validation and unauthorized responses.",
      ],
      project: "Build a secure student skill tracking application.",
      resources: [
        ["Spring Security", "https://docs.spring.io/spring-security/reference/"],
        ["Axios", "https://axios-http.com/docs/intro"],
      ],
    },
    {
      title: "GitHub, Deployment and Interview Preparation",
      duration: "2 weeks",
      goal: "Publish your project and prepare to explain it.",
      topics: [
        ["Git", "init, add, commit, branch, merge and push"],
        ["GitHub", "Repositories, README files and version control"],
        ["Deployment", "Environment variables, frontend and backend deployment"],
        ["Project Documentation", "Architecture, features, database design and API documentation"],
        ["Interview Practice", "Java, SQL, React, REST APIs and basic DSA"],
      ],
      tasks: [
        "Push frontend and backend code to GitHub.",
        "Write a clear README with setup instructions.",
        "Deploy the frontend and backend.",
        "Test the deployed application.",
        "Explain your project in a two-minute presentation.",
      ],
      project: "Publish a complete, working full-stack project.",
      resources: [
        ["Git Documentation", "https://git-scm.com/doc"],
        ["Vercel Documentation", "https://vercel.com/docs"],
        ["Render Documentation", "https://render.com/docs"],
      ],
    },
  ],

  "Java Developer": [
    {
      title: "Java Fundamentals",
      duration: "2 weeks",
      goal: "Write Java programs confidently.",
      topics: [
        ["Basics", "Variables, data types, operators and input/output"],
        ["Control Flow", "if-else, switch, for, while and do-while"],
        ["Methods", "Parameters, return values, method overloading and recursion"],
        ["Arrays and Strings", "One-dimensional arrays, String methods and StringBuilder"],
      ],
      tasks: [
        "Solve 20 beginner Java programs.",
        "Write programs using arrays and strings.",
        "Practice number patterns and basic mathematical problems.",
      ],
      project: "Build a console-based student marks calculator.",
      resources: [["Java Learning", "https://dev.java/learn/"]],
    },
    {
      title: "OOP, Collections and Exceptions",
      duration: "3 weeks",
      goal: "Write structured and reusable Java code.",
      topics: [
        ["OOP", "Classes, objects, constructors, inheritance and polymorphism"],
        ["Encapsulation", "Access modifiers, getters and setters"],
        ["Abstraction", "Abstract classes and interfaces"],
        ["Collections", "List, Set, Map, ArrayList and HashMap"],
        ["Exceptions", "try-catch, finally, throw and throws"],
        ["File Handling", "Read and write text files"],
      ],
      tasks: [
        "Create classes using inheritance and interfaces.",
        "Store and search records using ArrayList and HashMap.",
        "Handle invalid input using exceptions.",
        "Read and write data in a file.",
      ],
      project: "Build a library management system in Java.",
      resources: [["Java Tutorials", "https://dev.java/learn/"]],
    },
    {
      title: "Data Structures and Algorithms",
      duration: "4 weeks",
      goal: "Improve problem-solving for coding interviews.",
      topics: [
        ["Complexity", "Time complexity and space complexity"],
        ["Arrays and Strings", "Searching, sorting, frequency counting and two pointers"],
        ["Linked Lists", "Insertion, deletion and traversal"],
        ["Stacks and Queues", "Operations and common applications"],
        ["Hashing", "HashSet, HashMap and frequency problems"],
        ["Recursion", "Base cases and recursive solutions"],
      ],
      tasks: [
        "Solve array and string problems.",
        "Implement linear and binary search.",
        "Implement common sorting algorithms.",
        "Solve at least 3 coding problems each week.",
      ],
      project: "Create a collection of tested DSA solutions.",
      resources: [["VisuAlgo", "https://visualgo.net/en"]],
    },
    {
      title: "SQL and Database Connectivity",
      duration: "2 weeks",
      goal: "Connect Java applications to databases.",
      topics: [
        ["SQL", "CRUD operations, joins, grouping and subqueries"],
        ["Database Design", "Keys, relationships and normalization"],
        ["JDBC", "Connection, PreparedStatement and ResultSet"],
        ["Transactions", "Commit, rollback and basic transaction handling"],
      ],
      tasks: [
        "Write 15 SQL queries.",
        "Connect a Java program to MySQL.",
        "Perform CRUD operations using JDBC.",
        "Use PreparedStatement for parameterized queries.",
      ],
      project: "Build a database-backed employee management application.",
      resources: [
        ["MySQL Documentation", "https://dev.mysql.com/doc/"],
        ["JDBC Basics", "https://docs.oracle.com/javase/tutorial/jdbc/"],
      ],
    },
    {
      title: "Spring Boot and REST APIs",
      duration: "4 weeks",
      goal: "Build backend applications used in real projects.",
      topics: [
        ["Spring Basics", "Dependency injection and Spring beans"],
        ["Spring Boot", "Project setup, application properties and configuration"],
        ["Layered Architecture", "Controller, service, repository and entity"],
        ["Spring Data JPA", "Repositories, entity relationships and queries"],
        ["REST APIs", "CRUD endpoints and HTTP status codes"],
        ["Security", "Password hashing, authentication and JWT basics"],
      ],
      tasks: [
        "Build a CRUD REST API.",
        "Connect the API to MySQL.",
        "Add validation and exception handling.",
        "Protect selected endpoints with authentication.",
      ],
      project: "Build a secure student management REST API.",
      resources: [
        ["Spring Guides", "https://spring.io/guides"],
        ["Spring Security", "https://docs.spring.io/spring-security/reference/"],
      ],
    },
    {
      title: "Testing, Projects and Interviews",
      duration: "2 weeks",
      goal: "Prepare your Java portfolio and interviews.",
      topics: [
        ["Testing", "JUnit basics and testing service logic"],
        ["Debugging", "Read stack traces and fix common errors"],
        ["Git", "Commits, branches and GitHub"],
        ["Interviews", "Java OOP, collections, SQL, Spring Boot and DSA"],
      ],
      tasks: [
        "Add tests to your backend project.",
        "Push your project to GitHub.",
        "Write project setup instructions.",
        "Practice explaining your design decisions.",
      ],
      project: "Publish a complete Java and Spring Boot project.",
      resources: [
        ["JUnit 5", "https://junit.org/junit5/docs/current/user-guide/"],
        ["Git Documentation", "https://git-scm.com/doc"],
      ],
    },
  ],

  "Python Developer": [
    {
      title: "Python Fundamentals",
      duration: "2 weeks",
      goal: "Understand Python syntax and solve basic problems.",
      topics: [
        ["Basics", "Variables, data types, input/output and operators"],
        ["Control Flow", "Conditions, loops, break and continue"],
        ["Strings", "Indexing, slicing, methods and formatting"],
        ["Collections", "Lists, tuples, sets and dictionaries"],
        ["Functions", "Parameters, return values, scope and lambda basics"],
      ],
      tasks: [
        "Solve 20 beginner Python problems.",
        "Practice string and list operations.",
        "Write programs using functions and dictionaries.",
      ],
      project: "Build a console-based expense tracker.",
      resources: [["Python Tutorial", "https://docs.python.org/3/tutorial/"]],
    },
    {
      title: "Intermediate Python",
      duration: "3 weeks",
      goal: "Write reliable programs using Python features.",
      topics: [
        ["OOP", "Classes, objects, inheritance and encapsulation"],
        ["Exceptions", "try, except, else, finally and custom exceptions"],
        ["Files", "Read, write, append and work with file paths"],
        ["Modules", "Imports, packages and creating reusable code"],
        ["Comprehensions", "List and dictionary comprehensions"],
        ["Testing", "Assertions and unit testing basics"],
      ],
      tasks: [
        "Create a program that reads and updates a file.",
        "Handle invalid input and missing files.",
        "Organize code into modules.",
        "Write tests for utility functions.",
      ],
      project: "Build a file-based contact management system.",
      resources: [
        ["Python Tutorial", "https://docs.python.org/3/tutorial/"],
        ["Python Testing", "https://docs.python.org/3/library/unittest.html"],
      ],
    },
    {
      title: "Data Structures and Algorithms",
      duration: "3 weeks",
      goal: "Develop problem-solving skills in Python.",
      topics: [
        ["Complexity", "Time and space complexity"],
        ["Arrays and Lists", "Searching, sorting and list operations"],
        ["Strings", "Frequency counting and substring problems"],
        ["Stacks and Queues", "Implementations and applications"],
        ["Hashing", "Sets and dictionaries for efficient lookup"],
        ["Recursion", "Base cases and recursive calls"],
      ],
      tasks: [
        "Solve array and string problems.",
        "Implement searching and sorting.",
        "Solve at least 15 coding problems.",
      ],
      project: "Create a Python DSA practice repository.",
      resources: [["VisuAlgo", "https://visualgo.net/en"]],
    },
    {
      title: "Databases and APIs",
      duration: "3 weeks",
      goal: "Build applications that use stored data and external services.",
      topics: [
        ["SQL", "CRUD, joins, filtering and grouping"],
        ["Database Access", "Connect Python to a relational database"],
        ["HTTP and JSON", "Requests, responses and JSON data"],
        ["API Integration", "GET, POST, status codes and error handling"],
        ["Environment Variables", "Keep configuration outside source code"],
      ],
      tasks: [
        "Write SQL queries using joins.",
        "Fetch JSON data from a public API.",
        "Handle timeouts and API errors.",
        "Store application records in a database.",
      ],
      project: "Build a weather or expense tracking application using an API.",
      resources: [
        ["Requests", "https://requests.readthedocs.io/en/latest/"],
        ["SQLite Documentation", "https://docs.python.org/3/library/sqlite3.html"],
      ],
    },
    {
      title: "Backend Development",
      duration: "3 weeks",
      goal: "Create web APIs with a Python framework.",
      topics: [
        ["Framework Basics", "Choose Flask or FastAPI and understand routes"],
        ["Request Handling", "Path parameters, query parameters and request bodies"],
        ["Validation", "Validate input and return useful errors"],
        ["Database Integration", "Connect routes to database operations"],
        ["Authentication", "Understand sessions, tokens and password hashing"],
        ["Testing", "Test API endpoints and failure cases"],
      ],
      tasks: [
        "Create GET and POST endpoints.",
        "Connect endpoints to a database.",
        "Validate request data.",
        "Test endpoints with an API client.",
      ],
      project: "Build a task management REST API.",
      resources: [
        ["FastAPI Tutorial", "https://fastapi.tiangolo.com/tutorial/"],
        ["Flask Documentation", "https://flask.palletsprojects.com/"],
      ],
    },
    {
      title: "Portfolio and Interviews",
      duration: "2 weeks",
      goal: "Prepare your projects for applications.",
      topics: [
        ["GitHub", "Repositories, commits and README files"],
        ["Deployment", "Environment variables and hosting basics"],
        ["Project Quality", "Validation, tests and error handling"],
        ["Interviews", "Python, OOP, SQL, APIs and DSA"],
      ],
      tasks: [
        "Publish two Python projects on GitHub.",
        "Write setup instructions.",
        "Practice explaining your code.",
        "Revise common Python interview questions.",
      ],
      project: "Publish a complete Python application.",
      resources: [
        ["Git Documentation", "https://git-scm.com/doc"],
        ["Python Documentation", "https://docs.python.org/3/"],
      ],
    },
  ],

  "Frontend Developer": [
    {
      title: "HTML and Web Fundamentals",
      duration: "2 weeks",
      goal: "Create well-structured web pages.",
      topics: [
        ["HTML", "Headings, links, images, lists, tables and forms"],
        ["Semantic HTML", "Header, nav, main, section, article and footer"],
        ["Forms", "Input types, labels and built-in validation"],
        ["Accessibility", "Meaningful labels, keyboard navigation and alt text"],
      ],
      tasks: [
        "Create a personal profile page.",
        "Build a contact form.",
        "Use semantic HTML elements.",
        "Check that forms can be used with a keyboard.",
      ],
      project: "Build a multi-section personal portfolio.",
      resources: [["MDN Web Development", "https://developer.mozilla.org/en-US/docs/Learn_web_development"]],
    },
    {
      title: "CSS and Responsive Design",
      duration: "2 weeks",
      goal: "Design attractive pages that work on different screens.",
      topics: [
        ["CSS Basics", "Selectors, colors, fonts and backgrounds"],
        ["Box Model", "Width, height, margin, border and padding"],
        ["Layout", "Flexbox, Grid and positioning"],
        ["Responsive Design", "Media queries and mobile-first layouts"],
        ["UI Polish", "Spacing, hover states, transitions and consistent colors"],
      ],
      tasks: [
        "Recreate a simple webpage layout.",
        "Build a responsive navigation bar.",
        "Create cards using CSS Grid.",
        "Test your page on mobile and desktop sizes.",
      ],
      project: "Build a responsive product landing page.",
      resources: [
        ["MDN CSS", "https://developer.mozilla.org/en-US/docs/Web/CSS"],
        ["Flexbox Guide", "https://css-tricks.com/snippets/css/a-guide-to-flexbox/"],
      ],
    },
    {
      title: "JavaScript",
      duration: "3 weeks",
      goal: "Add logic and interactivity to websites.",
      topics: [
        ["Core JavaScript", "Variables, operators, conditions and loops"],
        ["Functions", "Parameters, return values, arrow functions and scope"],
        ["Data", "Arrays, objects, map, filter and reduce"],
        ["DOM", "Select elements, update content and handle events"],
        ["Async JavaScript", "Promises, async/await and fetch"],
        ["Errors", "try-catch and handling failed requests"],
      ],
      tasks: [
        "Write programs using arrays and objects.",
        "Validate a form using JavaScript.",
        "Build a search and filter feature.",
        "Fetch and display API data.",
      ],
      project: "Build an interactive quiz application.",
      resources: [["JavaScript Guide", "https://javascript.info/"]],
    },
    {
      title: "React Development",
      duration: "3 weeks",
      goal: "Build reusable and interactive UI components.",
      topics: [
        ["React Basics", "JSX, components, props and rendering"],
        ["State", "useState and event handling"],
        ["Effects", "useEffect and fetching data"],
        ["Forms", "Controlled inputs and validation"],
        ["Reusable UI", "Lists, conditional rendering and component composition"],
        ["Application State", "Lifting state and sharing data between components"],
      ],
      tasks: [
        "Create reusable cards and forms.",
        "Build a dashboard using components.",
        "Add search, filters and sorting.",
        "Show loading, empty and error states.",
      ],
      project: "Build a React student dashboard.",
      resources: [["React Documentation", "https://react.dev/learn"]],
    },
    {
      title: "API Integration, Quality and Accessibility",
      duration: "2 weeks",
      goal: "Connect the interface to backend services.",
      topics: [
        ["HTTP", "GET, POST, PUT and DELETE"],
        ["Axios or Fetch", "Send requests and process responses"],
        ["Authentication", "Token storage and protected pages"],
        ["Accessibility", "Labels, keyboard use, focus and readable contrast"],
        ["Debugging", "Browser developer tools and network errors"],
      ],
      tasks: [
        "Connect a React form to a REST API.",
        "Display validation errors from the backend.",
        "Handle loading and unauthorized states.",
        "Test the UI at different screen sizes.",
      ],
      project: "Build a frontend for a task or student management API.",
      resources: [
        ["MDN HTTP", "https://developer.mozilla.org/en-US/docs/Web/HTTP"],
        ["React Documentation", "https://react.dev/learn"],
      ],
    },
    {
      title: "Portfolio and Deployment",
      duration: "2 weeks",
      goal: "Publish your work and prepare for interviews.",
      topics: [
        ["Git", "Commits, branches and pushing code"],
        ["Portfolio", "Projects, screenshots and clear descriptions"],
        ["Deployment", "Build commands, environment variables and hosting"],
        ["Interview Preparation", "JavaScript, React, CSS and basic DSA"],
      ],
      tasks: [
        "Publish your portfolio on GitHub.",
        "Deploy two frontend projects.",
        "Write a README for each project.",
        "Practice explaining component design and state.",
      ],
      project: "Deploy a complete portfolio with live project links.",
      resources: [
        ["Git Documentation", "https://git-scm.com/doc"],
        ["Vercel Documentation", "https://vercel.com/docs"],
      ],
    },
  ],

  "Data Analyst": [
    {
      title: "Excel and Data Fundamentals",
      duration: "2 weeks",
      goal: "Understand, clean and summarize tabular data.",
      topics: [
        ["Spreadsheets", "Rows, columns, data types and cell references"],
        ["Formulas", "SUM, AVERAGE, COUNTIF and IF"],
        ["Lookup Functions", "XLOOKUP or VLOOKUP basics"],
        ["Data Cleaning", "Duplicates, missing values and inconsistent formats"],
        ["Charts", "Bar charts, line charts and pie charts"],
        ["Pivot Tables", "Group, summarize and compare data"],
      ],
      tasks: [
        "Clean a messy spreadsheet.",
        "Calculate totals and averages.",
        "Create a pivot table.",
        "Build a simple sales dashboard.",
      ],
      project: "Analyze monthly sales using Excel.",
      resources: [["Excel Training", "https://support.microsoft.com/en-us/excel"]],
    },
    {
      title: "SQL for Data Analysis",
      duration: "3 weeks",
      goal: "Extract useful information from databases.",
      topics: [
        ["SQL Basics", "SELECT, WHERE, DISTINCT and ORDER BY"],
        ["Aggregations", "COUNT, SUM, AVG, GROUP BY and HAVING"],
        ["Joins", "INNER JOIN, LEFT JOIN and joining multiple tables"],
        ["Subqueries", "Nested queries and filtering results"],
        ["Advanced SQL", "CASE, common table expressions and window functions"],
        ["Data Quality", "NULL values, duplicates and date handling"],
      ],
      tasks: [
        "Write 20 SQL queries.",
        "Join customers, orders and products tables.",
        "Find top products and monthly sales.",
        "Calculate rankings using window functions.",
      ],
      project: "Create a SQL report for an online store.",
      resources: [
        ["SQLBolt", "https://sqlbolt.com/"],
        ["MySQL Documentation", "https://dev.mysql.com/doc/"],
      ],
    },
    {
      title: "Python for Data Analysis",
      duration: "3 weeks",
      goal: "Analyze datasets using Python.",
      topics: [
        ["Python Basics", "Variables, lists, dictionaries, loops and functions"],
        ["NumPy", "Arrays, shapes, indexing and numerical operations"],
        ["Pandas", "Series, DataFrames, filtering and grouping"],
        ["Data Cleaning", "Missing values, duplicates and data types"],
        ["Combining Data", "Merge, join and concatenate"],
        ["Exploration", "Summary statistics and identifying patterns"],
      ],
      tasks: [
        "Load a CSV file into Pandas.",
        "Clean missing and duplicate values.",
        "Group data and calculate summary statistics.",
        "Compare results across categories.",
      ],
      project: "Analyze a student performance dataset.",
      resources: [
        ["Python Tutorial", "https://docs.python.org/3/tutorial/"],
        ["Pandas Getting Started", "https://pandas.pydata.org/docs/getting_started/"],
        ["NumPy Learn", "https://numpy.org/learn/"],
      ],
    },
    {
      title: "Statistics and Business Thinking",
      duration: "2 weeks",
      goal: "Explain what the data means.",
      topics: [
        ["Descriptive Statistics", "Mean, median, mode, range and standard deviation"],
        ["Distributions", "Frequency, percentiles and outliers"],
        ["Relationships", "Correlation and avoiding incorrect causal conclusions"],
        ["Sampling", "Samples, populations and sampling bias"],
        ["Business Questions", "KPIs, trends and comparisons"],
      ],
      tasks: [
        "Calculate mean, median and standard deviation.",
        "Identify outliers in a dataset.",
        "Compare two groups of data.",
        "Write three evidence-based observations.",
      ],
      project: "Prepare a statistical report on student performance.",
      resources: [["Khan Academy Statistics", "https://www.khanacademy.org/math/statistics-probability"]],
    },
    {
      title: "Data Visualization",
      duration: "2 weeks",
      goal: "Present findings through clear charts and dashboards.",
      topics: [
        ["Chart Selection", "Choose suitable charts for different questions"],
        ["Visualization", "Matplotlib and Seaborn basics"],
        ["Dashboards", "Filters, KPIs and chart layouts"],
        ["Storytelling", "Explain findings and business recommendations"],
        ["Tools", "Explore Power BI or Tableau basics"],
      ],
      tasks: [
        "Create bar, line and scatter plots.",
        "Label charts correctly.",
        "Build a dashboard with at least four KPIs.",
        "Write a short explanation of the findings.",
      ],
      project: "Create a sales or student performance dashboard.",
      resources: [
        ["Matplotlib Tutorials", "https://matplotlib.org/stable/tutorials/"],
        ["Power BI Learning", "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/"],
      ],
    },
    {
      title: "Portfolio and Interview Preparation",
      duration: "2 weeks",
      goal: "Demonstrate your analytical skills to employers.",
      topics: [
        ["Projects", "Define a question, analyze data and explain findings"],
        ["Documentation", "Describe the dataset, cleaning and assumptions"],
        ["GitHub", "Publish notebooks and project files"],
        ["Interviews", "SQL, Excel, statistics, Pandas and business questions"],
      ],
      tasks: [
        "Complete two data analysis projects.",
        "Publish notebooks and documentation.",
        "Explain your findings in simple language.",
        "Practice SQL and statistics questions.",
      ],
      project: "Publish a complete data analysis portfolio.",
      resources: [
        ["Git Documentation", "https://git-scm.com/doc"],
        ["Kaggle Learn", "https://www.kaggle.com/learn"],
      ],
    },
  ],
};

function Roadmap({ selectedRole }) {
  const role = ROADMAPS[selectedRole] ? selectedRole : "Full Stack Developer";
  const phases = ROADMAPS[role];

  const studentId = localStorage.getItem("studentId") || "guest";
  const storageKey = `skillTrackRoadmap_${studentId}_${role}`;

  const [completedTasks, setCompletedTasks] = useState({});
  const [openPhases, setOpenPhases] = useState({ 0: true });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCompletedTasks(saved ? JSON.parse(saved) : {});
    } catch {
      setCompletedTasks({});
    }

    setOpenPhases({ 0: true });
  }, [storageKey]);

  const allTasks = useMemo(
    () =>
      phases.flatMap((phase, phaseIndex) =>
        phase.tasks.map((task, taskIndex) => ({
          key: `${phaseIndex}-${taskIndex}`,
          task,
        }))
      ),
    [phases]
  );

  const completedCount = allTasks.filter(
    (item) => completedTasks[item.key]
  ).length;

  const progress =
    allTasks.length > 0
      ? Math.round((completedCount / allTasks.length) * 100)
      : 0;

  const toggleTask = (key) => {
    setCompletedTasks((previous) => {
      const updated = { ...previous, [key]: !previous[key] };

      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (error) {
        console.error("Unable to save roadmap progress:", error);
      }

      return updated;
    });
  };

  const resetProgress = () => {
    if (!window.confirm("Reset all completed tasks for this career roadmap?")) {
      return;
    }

    setCompletedTasks({});
    localStorage.removeItem(storageKey);
  };

  return (
    <div className="detailed-roadmap">
      <div className="roadmap-intro">
        <div>
          <span className="roadmap-eyebrow">YOUR CAREER PLAN</span>
          <h3>{role} Roadmap</h3>
          <p>
            Follow the phases in order. Learn each topic, complete the tasks,
            and build the suggested project before moving forward.
          </p>
        </div>

        <div className="roadmap-duration">
          <span>Total learning time</span>
          <strong>
            {phases.reduce(
              (total, phase) =>
                total + Number.parseInt(phase.duration, 10),
              0
            )}{" "}
            weeks
          </strong>
          <span>{phases.length} learning phases</span>
        </div>
      </div>

      <div className="roadmap-progress-card">
        <div className="roadmap-progress-heading">
          <div>
            <strong>Overall progress</strong>
            <p>
              {completedCount} of {allTasks.length} practice tasks completed
            </p>
          </div>
          <strong className="roadmap-progress-percent">{progress}%</strong>
        </div>

        <div
          className="roadmap-progress-track"
          role="progressbar"
          aria-label="Overall roadmap progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="roadmap-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {progress === 100 && (
          <p className="roadmap-complete-message">
            🎉 Excellent! You have completed every practice task in this
            roadmap. Review your projects and prepare to demonstrate your skills.
          </p>
        )}
      </div>

      <div className="roadmap-guidance">
        <span>💡</span>
        <p>
          <strong>How to use this roadmap:</strong> Study the topics, try the
          practice tasks yourself, and build the mini-project. The duration is
          an estimate; take extra time whenever you need it.
        </p>
      </div>

      <div className="detailed-roadmap-phases">
        {phases.map((phase, phaseIndex) => {
          const phaseTasks = phase.tasks.map((task, taskIndex) => ({
            task,
            key: `${phaseIndex}-${taskIndex}`,
          }));

          const phaseCompleted = phaseTasks.filter(
            (task) => completedTasks[task.key]
          ).length;

          const phaseProgress = Math.round(
            (phaseCompleted / phaseTasks.length) * 100
          );

          const isOpen = Boolean(openPhases[phaseIndex]);

          return (
            <section
              className={`roadmap-phase ${isOpen ? "phase-open" : ""}`}
              key={phase.title}
            >
              <button
                type="button"
                className="roadmap-phase-header"
                onClick={() =>
                  setOpenPhases((previous) => ({
                    ...previous,
                    [phaseIndex]: !previous[phaseIndex],
                  }))
                }
                aria-expanded={isOpen}
              >
                <span className="roadmap-phase-number">
                  {String(phaseIndex + 1).padStart(2, "0")}
                </span>

                <span className="roadmap-phase-title">
                  <strong>{phase.title}</strong>
                  <small>
                    {phase.duration} · {phaseCompleted}/{phaseTasks.length}{" "}
                    tasks complete
                  </small>
                </span>

                <span
                  className={`roadmap-phase-status ${
                    phaseProgress === 100 ? "phase-finished" : ""
                  }`}
                >
                  {phaseProgress === 100 ? "Completed" : `${phaseProgress}%`}
                </span>

                <span className="roadmap-chevron" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              <div className="roadmap-phase-progress-track">
                <div
                  className="roadmap-phase-progress-fill"
                  style={{ width: `${phaseProgress}%` }}
                />
              </div>

              {isOpen && (
                <div className="roadmap-phase-content">
                  <div className="roadmap-goal">
                    <strong>Phase goal</strong>
                    <p>{phase.goal}</p>
                  </div>

                  <div className="roadmap-section">
                    <h4>📚 Topics you need to learn</h4>

                    <div className="roadmap-topic-list">
                      {phase.topics.map(([topic, details]) => (
                        <div className="roadmap-topic" key={topic}>
                          <strong>{topic}</strong>
                          <p>{details}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="roadmap-section">
                    <h4>✅ Practice tasks</h4>
                    <p className="roadmap-section-help">
                      Tick each task when you have actually completed it.
                    </p>

                    <div className="roadmap-task-list">
                      {phaseTasks.map(({ task, key }) => (
                        <label
                          className={`roadmap-task ${
                            completedTasks[key] ? "task-completed" : ""
                          }`}
                          key={key}
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(completedTasks[key])}
                            onChange={() => toggleTask(key)}
                          />
                          <span>{task}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="roadmap-project">
                    <span className="roadmap-project-icon">🚀</span>
                    <div>
                      <strong>Mini-project</strong>
                      <p>{phase.project}</p>
                      <small>
                        Try to complete this project before starting the next
                        phase.
                      </small>
                    </div>
                  </div>

                  <div className="roadmap-section roadmap-resources">
                    <h4>🔗 Learning resources</h4>
                    <div className="roadmap-resource-list">
                      {phase.resources.map(([label, url]) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {label} <span aria-hidden="true">↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="roadmap-footer">
        <p>
          Your progress is saved in this browser separately for each student
          and career role.
        </p>
        <button
          type="button"
          className="roadmap-reset-button"
          onClick={resetProgress}
        >
          Reset this roadmap
        </button>
      </div>
    </div>
  );
}

export default Roadmap;