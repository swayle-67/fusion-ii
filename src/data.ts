import { Service, CaseStudy, BlogPost } from "./types";

export const SERVICES_DATA: Service[] = [
  {
    index: "01",
    title: "Intelligent Web Architectures",
    description: "We engineer high-fidelity, fluid systems that blend standard interfaces with bespoke Canvas renders, custom animations, and responsive responsive state engines built to execute at 60 fps natively.",
    capabilities: [
      "Custom state-machine design",
      "Interactive multi-dimensional pipelines",
      "Dynamic Canvas & WebGL engineering",
      "Optimized data streaming nodes",
    ],
  },
  {
    index: "02",
    title: "Algorithmic Brand & Asset Design",
    description: "Our design team builds generative code assets, fluid typography models, mathematical color schemes, and bespoke asset generators that render perfect vector identities instantly across any screen scaling.",
    capabilities: [
      "Dynamic procedural layouts",
      "Mathematical vector logo grids",
      "Interactive style guideline tokens",
      "Custom animation framework design",
    ],
  },
  {
    index: "03",
    title: "Cognitive AI Integrations",
    description: "We construct secure server-side conduits that map large language models, retrieval-augmented caches, custom embeddings, and real-time inference nodes directly to custom web-facing dashboards.",
    capabilities: [
      "Custom AI pipeline proxy wrappers",
      "Context-aware user interface flows",
      "Low-latency streaming interfaces",
      "Intelligent vector sorting modules",
    ],
  },
];

export const CASE_STUDIES_DATA: CaseStudy[] = [];

export const PHILOSOPHY_SECTIONS = [
  {
    number: "01",
    title: "Strict Minimalism",
    quote: "Noise should exist only in the grain of the background, never in the navigation of the mind.",
    body: "We believe in removing every non-essential container, banner, and line. True craftsmanship lets high-contrast space and perfect structural alignments do the storytelling, creating calm pathways that respect the human user's focus.",
  },
  {
    number: "02",
    title: "Algorithmic Symbiosis",
    quote: "The interface is a soft, breathing layer connecting code with human physical intuition.",
    body: "We do not treat AI as a text-matching chatbot. AI is an organic, multi-dimensional coordinate engine capable of adapting interfaces, calculating real-time fluid canvases, and generating beautiful procedural geometries suited for individual sessions.",
  },
  {
    number: "03",
    title: "Responsive Precision",
    quote: "Every layout should bind seamlessly across frames like silk expanding over stone.",
    body: "Responsive design is not simply wrapping stacked divs. It is the art of scaling content hierarchy elegantly, preserving aesthetic relationships, maintaining touch target sizes, and engineering layout transitions that feel completely native and butter-smooth.",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "vnoise-depth",
    category: "DESIGN SYSTEMS",
    title: "The Art of Velvet Noise: Elevating UI Depth",
    date: "June 20, 2026",
    readTime: "4 min read",
    author: "Founder",
    excerpt: "Why standard flat grids are giving way to high-fidelity, organic mathematical noise fields and fluid, ambient lighting networks.",
    content: [
      "For years, web design has been bound to flat panels, static shadows, and uniform color fills. While responsive layouts have perfected coordinate flow, they often lack tactile human presence. This is where sensory aesthetics come into play.",
      "Velvet Noise introduces high-fidelity grain and mathematical lighting hubs directly into the background of spatial interfaces. By layering radial gradients that pulse like slow lightning over organic procedural particles, we trigger physical intuition.",
      "The result is a digital environment that doesn't just display database rows, but breathes. Utilizing low-overhead canvas matrices ensures these multi-dimensional pipelines execute at 60 frames per second without burdening the browser's main cycle thread."
    ]
  },
  {
    id: "cognitive-ui",
    category: "AI + INTERFACE",
    title: "Designing Cognitive Interfaces in the LLM Era",
    date: "May 12, 2026",
    readTime: "5 min read",
    author: "Fusion Team",
    excerpt: "AI integrations shouldn't stop at raw text-matching chatbots. Exploring dynamic, ambient canvases that morph and adapt to user focus.",
    content: [
      "Most current artificial helper integrations suffer from a design failure: the text terminal trap. Prompting systems should not force human beings to type lengthy strings into tiny input rectangles, only to sit and watch blocks of dry prose compile on screen.",
      "A cognitive interface treats AI as a fluid shape-shifting assistant. The interface itself morphs, pre-generating widgets, predictive sliders, and interactive layout blocks tailored to the context of the user's workflow.",
      "Through sensory ambient indicators, we can communicate state changes, compute loads, and intelligence vector results wordlessly. Our task as modern engineers is to transform cold algorithms into tactile workspaces."
    ]
  },
  {
    id: "60fps-react",
    category: "ENGINEERING",
    title: "Unlocking 60 FPS Canvas Animations in React 19",
    date: "April 03, 2026",
    readTime: "6 min read",
    author: "Sales Team",
    excerpt: "Synthesizing deep performance lessons: leveraging unified refs, offscreen coordinate buffers, and mathematical sine scaling to stop re-renders.",
    content: [
      "React is exceptional for structural state resolution, but passing fast animation frames down standard JSX trees is a guaranteed path to sluggish, laggy displays. Each component render incurs virtual DOM diffing costs that destroy budget timelines.",
      "To obtain pristine, fluid movement on thousands of particles, the canvas rendering loop must be abstracted away from state updates. By mapping configurations to static references (`useRef`), you bypass React's reactive re-draw loops.",
      "In Fusion II, the VelvetNoise matrix runs entirely inside a single isolated frame loop. The main component updates only when physical size mutations are triggered, leaving the canvas free to paint beautiful, complex mathematical formulas natively in real time."
    ]
  }
];

