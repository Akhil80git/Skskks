import wikiPreview from '../assets/images/preview_wikipedia_encyclopedia_1793758680849.jpg';
import githubPreview from '../assets/images/preview_github_repositories_1793758681708.jpg';
import mdnPreview from '../assets/images/preview_mdn_webdocs_1793758684026.jpg';
import techNewsPreview from '../assets/images/preview_technews_feed_1793758685252.jpg';

export interface SiteCard {
  id: string;
  url: string;
  hostname: string;
  title: string;
  screenshot: string;
  frameAllowed?: boolean;
  createdAt: number;
}

export interface DirectorySuggestion {
  title: string;
  url: string;
  hostname: string;
  category: string;
  keywords: string;
}

export const STARTER_CARDS: SiteCard[] = [
  {
    id: 'seed-wikipedia',
    url: 'https://www.wikipedia.org',
    hostname: 'wikipedia.org',
    title: 'Wikipedia — The Free Encyclopedia',
    screenshot: wikiPreview,
    frameAllowed: true,
    createdAt: Date.now() - 4000,
  },
  {
    id: 'seed-github',
    url: 'https://github.com',
    hostname: 'github.com',
    title: 'GitHub — Software Repositories & Code',
    screenshot: githubPreview,
    frameAllowed: false,
    createdAt: Date.now() - 3000,
  },
  {
    id: 'seed-mdn',
    url: 'https://developer.mozilla.org',
    hostname: 'developer.mozilla.org',
    title: 'MDN Web Docs — HTML, CSS & JavaScript',
    screenshot: mdnPreview,
    frameAllowed: false,
    createdAt: Date.now() - 2000,
  },
  {
    id: 'seed-hn',
    url: 'https://news.ycombinator.com',
    hostname: 'news.ycombinator.com',
    title: 'Hacker News — Engineering & Startup Links',
    screenshot: techNewsPreview,
    frameAllowed: false,
    createdAt: Date.now() - 1000,
  },
];

export const GLOBAL_SITE_SUGGESTIONS: DirectorySuggestion[] = [
  { title: 'Wikipedia', url: 'https://www.wikipedia.org', hostname: 'wikipedia.org', category: 'Knowledge', keywords: 'wiki encyclopedia gyan padhai knowledge history science' },
  { title: 'GitHub', url: 'https://github.com', hostname: 'github.com', category: 'Developer', keywords: 'git code repo programming open source software developer' },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', hostname: 'developer.mozilla.org', category: 'Docs', keywords: 'html css js javascript web docs coding frontend' },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com', hostname: 'stackoverflow.com', category: 'Developer', keywords: 'code question bug programming developer answer error' },
  { title: 'Hacker News', url: 'https://news.ycombinator.com', hostname: 'news.ycombinator.com', category: 'Tech News', keywords: 'tech startup news engineering ycombinator hn' },
  { title: 'Internet Archive', url: 'https://archive.org', hostname: 'archive.org', category: 'Archive', keywords: 'wayback books movies history library free archive' },
  { title: 'NPM Registry', url: 'https://www.npmjs.com', hostname: 'npmjs.com', category: 'Developer', keywords: 'node javascript packages library react npm' },
  { title: 'Vercel', url: 'https://vercel.com', hostname: 'vercel.com', category: 'Cloud', keywords: 'deploy hosting frontend nextjs web cloud' },
  { title: 'Cloudflare', url: 'https://www.cloudflare.com', hostname: 'cloudflare.com', category: 'Cloud', keywords: 'dns cdn security workers network domain' },
  { title: 'Figma', url: 'https://www.figma.com', hostname: 'figma.com', category: 'Design', keywords: 'ui ux design wireframe prototype vector graphics' },
  { title: 'Dribbble', url: 'https://dribbble.com', hostname: 'dribbble.com', category: 'Design', keywords: 'design inspiration portfolio ui graphics creative' },
  { title: 'Behance', url: 'https://www.behance.net', hostname: 'behance.net', category: 'Design', keywords: 'creative art design showcase adobe graphic' },
  { title: 'Canva', url: 'https://www.canva.com', hostname: 'canva.com', category: 'Design', keywords: 'poster banner photo edit social media graphic template' },
  { title: 'CodePen', url: 'https://codepen.io', hostname: 'codepen.io', category: 'Developer', keywords: 'html css js sandbox frontend demo snippet code' },
  { title: 'LeetCode', url: 'https://leetcode.com', hostname: 'leetcode.com', category: 'Coding', keywords: 'dsa interview algorithm coding practice problem' },
  { title: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org', hostname: 'geeksforgeeks.org', category: 'Learning', keywords: 'coding tutorial c++ java python padhai placement cs' },
  { title: 'W3Schools', url: 'https://www.w3schools.com', hostname: 'w3schools.com', category: 'Learning', keywords: 'html css js sql python tutorial learn web' },
  { title: 'freeCodeCamp', url: 'https://www.freecodecamp.org', hostname: 'freecodecamp.org', category: 'Learning', keywords: 'learn code free certificate web dev python' },
  { title: 'Khan Academy', url: 'https://www.khanacademy.org', hostname: 'khanacademy.org', category: 'Education', keywords: 'math science study school padhai exam free education' },
  { title: 'Coursera', url: 'https://www.coursera.org', hostname: 'coursera.org', category: 'Education', keywords: 'online course university degree skill certificate' },
  { title: 'edX', url: 'https://www.edx.org', hostname: 'edx.org', category: 'Education', keywords: 'mit harvard online classes education course' },
  { title: 'BBC News', url: 'https://www.bbc.com/news', hostname: 'bbc.com', category: 'News', keywords: 'world news khabar international breaking headlines' },
  { title: 'Reuters', url: 'https://www.reuters.com', hostname: 'reuters.com', category: 'News', keywords: 'global news finance economy market breaking khabar' },
  { title: 'The Verge', url: 'https://www.theverge.com', hostname: 'theverge.com', category: 'Tech News', keywords: 'gadgets tech review phone laptop news' },
  { title: 'TechCrunch', url: 'https://techcrunch.com', hostname: 'techcrunch.com', category: 'Tech News', keywords: 'startup venture funding apps technology news' },
  { title: 'NDTV', url: 'https://www.ndtv.com', hostname: 'ndtv.com', category: 'India News', keywords: 'india news hindi khabar samachar live tv' },
  { title: 'The Hindu', url: 'https://www.thehindu.com', hostname: 'thehindu.com', category: 'India News', keywords: 'newspaper editorial upsc india news current affairs' },
  { title: 'Cricbuzz', url: 'https://www.cricbuzz.com', hostname: 'cricbuzz.com', category: 'Sports', keywords: 'cricket live score ipl match sports india' },
  { title: 'ESPNcricinfo', url: 'https://www.espncricinfo.com', hostname: 'espncricinfo.com', category: 'Sports', keywords: 'cricket stats score match commentary sports' },
  { title: 'YouTube', url: 'https://www.youtube.com', hostname: 'youtube.com', category: 'Video', keywords: 'video music vlog tutorial stream movie gaana yt' },
  { title: 'Vimeo', url: 'https://vimeo.com', hostname: 'vimeo.com', category: 'Video', keywords: 'film hd video creator cinema showcase' },
  { title: 'Spotify', url: 'https://open.spotify.com', hostname: 'open.spotify.com', category: 'Music', keywords: 'music song audio podcast playlist gaana' },
  { title: 'SoundCloud', url: 'https://soundcloud.com', hostname: 'soundcloud.com', category: 'Music', keywords: 'indie music beats tracks audio stream' },
  { title: 'Reddit', url: 'https://www.reddit.com', hostname: 'reddit.com', category: 'Community', keywords: 'forum discussion community ask memes topics' },
  { title: 'Medium', url: 'https://medium.com', hostname: 'medium.com', category: 'Publishing', keywords: 'blog articles writing stories essays tech' },
  { title: 'Substack', url: 'https://substack.com', hostname: 'substack.com', category: 'Publishing', keywords: 'newsletter writers reading columns essays' },
  { title: 'Product Hunt', url: 'https://www.producthunt.com', hostname: 'producthunt.com', category: 'Startups', keywords: 'new apps tools launch startups SaaS discover' },
  { title: 'Notion', url: 'https://www.notion.so', hostname: 'notion.so', category: 'Productivity', keywords: 'notes docs wiki tasks workspace planner' },
  { title: 'Trello', url: 'https://trello.com', hostname: 'trello.com', category: 'Productivity', keywords: 'kanban board project tasks workflow team' },
  { title: 'Excalidraw', url: 'https://excalidraw.com', hostname: 'excalidraw.com', category: 'Tools', keywords: 'whiteboard sketch diagram draw architecture' },
  { title: 'Photopea', url: 'https://www.photopea.com', hostname: 'photopea.com', category: 'Tools', keywords: 'photo editor psd photoshop free image tool' },
  { title: 'Squoosh', url: 'https://squoosh.app', hostname: 'squoosh.app', category: 'Tools', keywords: 'image compress resize webp png jpg' },
  { title: 'Speedtest', url: 'https://www.speedtest.net', hostname: 'speedtest.net', category: 'Tools', keywords: 'internet wifi speed bandwidth ping check' },
  { title: 'OpenStreetMap', url: 'https://www.openstreetmap.org', hostname: 'openstreetmap.org', category: 'Maps', keywords: 'map earth location street navigation world' },
  { title: 'Weather.com', url: 'https://weather.com', hostname: 'weather.com', category: 'Weather', keywords: 'mausam rain forecast temperature climate weather' },
  { title: 'Amazon', url: 'https://www.amazon.in', hostname: 'amazon.in', category: 'Shopping', keywords: 'shopping buy online store electronics books' },
  { title: 'Flipkart', url: 'https://www.flipkart.com', hostname: 'flipkart.com', category: 'Shopping', keywords: 'india shopping mobile fashion electronics store' },
  { title: 'IMDb', url: 'https://www.imdb.com', hostname: 'imdb.com', category: 'Movies', keywords: 'movies cinema rating series cast bollywood hollywood' },
  { title: 'Goodreads', url: 'https://www.goodreads.com', hostname: 'goodreads.com', category: 'Books', keywords: 'books reading reviews novel library kitaab' },
  { title: 'Project Gutenberg', url: 'https://www.gutenberg.org', hostname: 'gutenberg.org', category: 'Books', keywords: 'free ebooks literature classic books read' },
  { title: 'arXiv', url: 'https://arxiv.org', hostname: 'arxiv.org', category: 'Research', keywords: 'science papers physics cs math research preprint' },
  { title: 'NASA', url: 'https://www.nasa.gov', hostname: 'nasa.gov', category: 'Science', keywords: 'space astronomy mars planets universe rocket' },
  { title: 'IRCTC', url: 'https://www.irctc.co.in', hostname: 'irctc.co.in', category: 'Travel', keywords: 'train ticket railway india booking yatra' },
  { title: 'LinkedIn', url: 'https://www.linkedin.com', hostname: 'linkedin.com', category: 'Jobs', keywords: 'jobs career network resume hiring professional' },
  { title: 'DuckDuckGo', url: 'https://duckduckgo.com', hostname: 'duckduckgo.com', category: 'Search', keywords: 'search engine privacy web lookup find' },
  { title: 'Tailwind CSS', url: 'https://tailwindcss.com', hostname: 'tailwindcss.com', category: 'CSS', keywords: 'css utility styling frontend design framework' },
  { title: 'React Docs', url: 'https://react.dev', hostname: 'react.dev', category: 'Frontend', keywords: 'react hooks components javascript ui library' },
  { title: 'Python.org', url: 'https://www.python.org', hostname: 'python.org', category: 'Language', keywords: 'python coding programming docs download' },
  { title: 'Rust Lang', url: 'https://www.rust-lang.org', hostname: 'rust-lang.org', category: 'Language', keywords: 'rust systems programming cargo performance' },
  { title: 'Go.dev', url: 'https://go.dev', hostname: 'go.dev', category: 'Language', keywords: 'golang backend cloud programming google' },
];
