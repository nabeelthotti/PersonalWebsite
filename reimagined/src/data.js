import articleContent from './articles.json';

// Current work and personal details come from Nabeel's supplied brief and corrections.
// Client work is anonymized; no private performance metrics are published here.
// Earlier engineering projects retain the original portfolio's technical descriptions.
// Article body text is extracted verbatim from the author's supplied PDFs.

const currentProjects = [
  {
    slug: 'beel',
    title: 'Beel',
    summary: 'Go to outreach platform. Releasing soon.',
    category: 'Personal products',
    kind: 'product',
    status: 'What I am currently working on',
    stack: [],
    description: 'Beel is an all-in-one outreach sequencer I’m building: AI emails, phone calls, voicemails, iMessages, SMS, WhatsApp, and LinkedIn sequences, with support for Instagram, X, Facebook, and Reddit. One sequencer for every channel that matters. The product is in development.',
    challenge: 'Bring the channels used to start and follow up on conversations into one outreach sequence.',
    approach: ['Build AI email, phone-call, and voicemail steps into a shared sequence.', 'Connect iMessage, SMS, WhatsApp, and LinkedIn outreach.', 'Include support for Instagram, X, Facebook, and Reddit.'],
    result: '',
    images: [],
    github: '',
    placeholder: true,
    presentation: { label: 'Product in development', caption: 'Beel preview. Product screenshots to be added.' },
  },

  {
    slug: 'personal-website',
    title: 'Personal Website',
    summary: 'The site you’re on: my story, projects, writing, and life outside work.',
    category: 'Web applications',
    kind: 'engineering',
    status: 'Ongoing',
    stack: ['React', 'Vite', 'CSS', 'D3 Geo', 'Netlify'],
    description: 'A personal website with two ways to explore. The animated homepage opens through the letter in my name and takes you through my story, work, writing, and interests. A simpler version lets you navigate directly between pages.',
    challenge: 'Make a website that feels personal and playful.',
    approach: [
      'Connect layered project cards and full-screen writing sections to scrolling.',
      'Add an interactive travel globe and shared photo slideshows.',
      'Provide direct navigation, reduced-motion support, and pre-rendered pages for search engines.',
    ],
    result: 'A home for my work and the things I care about, with room to keep changing as I do.',
    images: ['/assets/photos/personal-website.png'],
    github: 'https://github.com/nabeelthotti/PersonalWebsite',
    live: 'https://nabeelthotti.com',
    placeholder: false,
    presentation: { label: 'Personal website', caption: 'The homepage entrance.' },
  },
];

const engineeringProjects = [
  {
    slug: 'rekognize',
    title: 'Rekognize',
    summary: 'A handwriting recognition experiment for digits and letters.',
    category: 'Machine learning',
    stack: ['Python', 'TensorFlow', 'Keras', 'Flask', 'OpenCV', 'React'],
    description: 'Rekognize is a web application that identifies handwritten digits and alphabetic characters. It uses convolutional neural networks trained on MNIST and EMNIST, with TensorFlow handling prediction and Flask serving the application. The interface connects a drawing input to the recognition models.',
    challenge: 'Recognizing a character means accounting for the many ways people draw the same shape. The project brings image preprocessing, trained recognition models, and a browser interface into one workflow.',
    approach: [
      'Use MNIST and EMNIST as the training data for digit and alphabet recognition.',
      'Build convolutional neural networks with TensorFlow and Keras.',
      'Preprocess drawings with OpenCV before passing them to the models.',
      'Connect the models to a Flask application and a drawing interface.',
    ],
    images: ['/assets/legacy/Rekognize1.png', '/assets/legacy/Rekognize2.png', '/assets/legacy/Rekognize3.png'],
    github: 'https://github.com/nabeelthotti/Rekognize',
    live: 'https://rekognize.fly.dev/',
  },
  {
    slug: 'shopvista',
    title: 'ShopVista',
    summary: 'A shopping application built from product browsing through checkout.',
    category: 'Web applications',
    stack: ['React', 'Java', 'Spring Boot', 'Spring Security', 'MySQL', 'Axios'],
    description: 'ShopVista pairs a React frontend with a Spring Boot backend and MySQL database. Customers can browse products, manage a shopping cart, and complete checkout. The backend handles user data, inventory, and orders, while an admin panel supports product and user management.',
    challenge: 'A shopping experience connects several kinds of state: the product catalog, the customer account, the cart, and the order. The application needs those pieces to work together across the interface, API, and database.',
    approach: [
      'Build the product, cart, checkout, and account interfaces with React.',
      'Use Spring Boot for backend services and Spring Security for authentication and access controls.',
      'Store user profiles, product information, and transaction data in MySQL.',
      'Connect the frontend to backend APIs through Axios and manage navigation with React Router.',
      'Provide an admin interface for maintaining products and user data.',
    ],
    images: ['/assets/legacy/ShopVista1.png', '/assets/legacy/ShopVista2.png', '/assets/legacy/ShopVista3.png', '/assets/legacy/ShopVista4.png', '/assets/legacy/ShopVista5.png', '/assets/legacy/ShopVista6.png', '/assets/legacy/ShopVista7.png'],
    github: 'https://github.com/nabeelthotti/ShopVista',
  },
  {
    slug: 'portchat',
    title: 'PortChat',
    summary: 'A Python network chat application built with sockets and threads.',
    category: 'Systems & automation',
    stack: ['Python', 'Sockets', 'Threading'],
    description: 'PortChat implements a server-client architecture for text communication across a network. A Python server listens on a port and handles clients in separate threads, allowing multiple people to connect and exchange messages. Commands cover connecting, sending messages, and exiting.',
    challenge: 'Handling several conversations at once requires the server to manage concurrent connections without blocking message delivery or letting threads interfere with shared state.',
    approach: [
      'Use Python sockets to connect clients to a listening server.',
      'Run each incoming client connection in a separate thread.',
      'Use locks to protect shared resources and address race conditions.',
      'Provide commands for connecting, sending messages, and disconnecting.',
    ],
    images: ['/assets/legacy/PortChat1.png', '/assets/legacy/PortChat2.png'],
    github: 'https://github.com/nabeelthotti/PortChat',
  },
  {
    slug: 'find-my-parcel',
    title: 'Find My Parcel',
    summary: 'Shipment tracking through the AfterShip API.',
    category: 'Web applications',
    stack: ['JavaScript', 'HTML', 'CSS', 'AfterShip API'],
    description: 'Find My Parcel is a package tracking website that uses the AfterShip API to retrieve shipment updates across supported couriers. A visitor enters a tracking number to see the status and location information returned by the service.',
    challenge: 'The interface needs to turn a tracking number and an external service response into shipment information that is easy to find and read.',
    approach: [
      'Accept a tracking number through a simple web interface.',
      'Use the AfterShip API to retrieve shipment information.',
      'Handle the request and dynamic interface updates with JavaScript.',
      'Present the shipment status and location updates using HTML and CSS.',
    ],
    images: ['/assets/legacy/Parcel1.png', '/assets/legacy/Parcel2.png', '/assets/legacy/Parcel3.png'],
    github: 'https://github.com/nabeelthotti/FindMyParcel',
  },
  {
    slug: 'daily-commit',
    title: 'Daily Commit Bot',
    summary: 'Scheduled repository updates using Bash, Cron, and AWS EC2.',
    category: 'Systems & automation',
    stack: ['Bash', 'Cron', 'Git', 'GitHub', 'AWS EC2'],
    description: 'Daily Commit Bot runs from an AWS EC2 instance and performs scheduled commits to a GitHub repository. A Bash script appends the current date and time to daily_commit.txt, commits the change, and pushes it to GitHub. Cron schedules the script five times a day.',
    challenge: 'The project provides a repeatable source of repository changes for demonstrating scheduled automation and triggering CI/CD workflows.',
    approach: [
      'Run the automation from an AWS EC2 instance.',
      'Append a timestamp to a text file with a Bash script.',
      'Commit and push each update to a GitHub repository.',
      'Use Cron to schedule five runs each day.',
    ],
    images: ['/assets/legacy/commit1.png', '/assets/legacy/commit2.png'],
    github: 'https://github.com/nabeelthotti/DailyCommitBot',
  },
  {
    slug: 'chess',
    title: 'Two-player Chess',
    summary: 'A browser chess game for two players sharing a board.',
    category: 'Play',
    stack: ['JavaScript', 'HTML', 'CSS'],
    description: 'A browser-based implementation of chess with piece movement, alternating turns, and a reversible board. The original project explores event handling, objects and arrays, and classes and inheritance through the rules and interactions of a familiar game.',
    challenge: 'Every move changes the board and what each player can do next. The interface and game state need to remain synchronized as pieces move, turns change, and the board changes perspective.',
    approach: [
      'Represent the board and pieces with JavaScript objects and arrays.',
      'Model piece behavior through classes and inheritance.',
      'Use event listeners to connect player input to board updates.',
      'Display whose turn it is and allow players to reverse the board.',
    ],
    images: ['/assets/legacy/Chess1.png', '/assets/legacy/Chess2.png', '/assets/legacy/Chess3.png'],
    github: 'https://github.com/nabeelthotti/PersonalWebsite/tree/master/src/Chess',
  },
];

export const projects = [
  ...currentProjects,
  ...engineeringProjects.map((project) => ({
    ...project,
    kind: 'engineering',
    status: 'Archive',
    placeholder: false,
    presentation: { label: 'Engineering project', caption: 'Original project screenshots.' },
  })),
];

export const articles = articleContent;

export const videos = [
  {id:'-AfvGKXDkew',title:'Turn your LinkedIn Into an AI Chat 🤯',dateLabel:'16 Sep'},
  {id:'PULG3SKEsEs',title:'How to Export Your LinkedIn Data into GrokBot!',dateLabel:'16 Sep'},
  {id:'sfoHNF9-3kc',title:"You're sitting on unpaid LinkedIn pipeline!!",dateLabel:'10 Sep'},
  {id:'YDF8IzunnT4',title:'Your LinkedIn engagers are unpaid pipeline!',dateLabel:'10 Sep'},
].map(video=>({...video,url:`https://www.youtube.com/shorts/${video.id}`,thumbnail:`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}));

export const profile = {
  name: 'Nabeel Thotti',
  portrait: {
    src: '/assets/photos/nabeel-thotti-portrait.jpg',
    alt: 'Portrait of Nabeel Thotti wearing glasses',
    caption: 'Nabeel Thotti',
    width: 1152,
    height: 1536,
  },
  role: 'GTM engineer',
  title: 'GTM engineer at Syft Data',
  company: 'Syft Data',
  email: '',
  location: 'San Francisco, California',
  hometown: 'Los Angeles, California',
  github: 'https://github.com/nabeelthotti',
  linkedin: 'https://www.linkedin.com/in/nabeelthotti',
  x: 'https://x.com/nabeelthotti',
  youtube: 'https://www.youtube.com/@nabeelthotti',
  socialVerification: { github: 'source-provided', linkedin: 'source-provided' },
  resume: '/assets/legacy/NabeelsResume.pdf',
  about: [
    'Hi, I’m Nabeel. I’ve always broken things just to build them again. As a kid it was alternate LEGO builds, as a teenager it was fixing shitbox Miatas, and by college I was looking for the next thing to take apart. Software felt like the obvious next step in my life’s motif.',
    'I became a software engineer straight out of university, right as ChatGPT started taking over the world. I was writing slow code and mending it with AI, until eventually I was barely writing any code myself. I lost my love for the game. They sold me on being a problem solver, but most days I was just reviewing what AI wrote.',
    'Things changed when I started working with customers. They kept bringing me problems that no off-the-shelf solution could fix. And I didn’t always know the answer. The search, the frustration, the trial and error all returned. The same feeling that programming used to give me, I now get by increasing shareholder value. Jk, I get it by seeing my work show up in someone’s actual results.',
    'So that’s how I ended up doing GTM at Syft Data. I realized engineering never actually left. I still have to understand how things fit together and test my assumptions. These days, that means helping companies figure out who might need their product, how to start a useful conversation with them, and whether those conversations actually turn into customers.',
    'I couldn’t have mapped out a career from fixing Miatas to building outreach systems, but it’s been the same thing every time: I like getting involved enough to understand why something isn’t working, and having the room to do something about it.',
  ],
  interests: [
    { title: 'My Home', description: 'The place I live in' },
    { title: 'Travel', description: 'All the places I’ve been!' },
  ],
  experience: [
    {
      role: 'GTM Engineer',
      org: 'Syft Data',
      period: 'Current',
      summary: 'Customer-facing GTM work across market research, buyer data, signal-based outreach, CRM connections, and reporting. I also work on Syft’s own campaigns, landing pages, and GTM experiments.',
    },
    {
      role: 'Integration Developer Intern',
      org: 'University of California, Los Angeles',
      period: 'June–August 2024',
      summary: 'Worked on a serverless middleware platform connecting Oracle Financial Cloud with UCLA systems. Built integration services with AWS DynamoDB, S3, SQS, API Gateway, and Lambda, and orchestrated workflows with Step Functions.',
    },
    {
      role: 'Software Developer Intern',
      org: 'University of California, Los Angeles',
      period: 'June–August 2023',
      summary: 'Worked on migrating student financial aid systems from legacy mainframe infrastructure to Oracle Vocado. Configured AWS EC2 and RDS services, automated migration between environments, and contributed to system testing.',
    },
    {
      role: 'Data Specialist',
      org: 'Land of The Free L.P.',
      period: 'September 2021–September 2022',
      summary: 'Worked with SQL, spreadsheets, data warehousing methods, and parallel processing frameworks to improve data management and support larger datasets.',
    },
  ],
};
