export interface StoryWeaverBook {
  id: string;
  title: string;
  subtitle?: string;
  level: 1 | 2 | 3 | 4;
  levelTitle: string;
  levelColor: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
  };
  author: string;
  illustrator: string;
  translator?: string;
  synopsis: string;
  languages: string[];
  originalLanguage: string;
  categories: string[];
  ageGroup: '3-5' | '6-8' | '9-10' | '11-12';
  readCount: string;
  pageCount: number;
  hasAudio: boolean;
  license: string;
  isEditorSpotlight?: boolean;
  spotlightQuote?: string;
  coverTheme: {
    gradient: string;
    accent: string;
    iconEmoji: string;
    pattern: string;
  };
  samplePages: {
    pageNumber: number;
    text: string;
    scenePrompt: string;
  }[];
}

export const READING_LEVEL_INFO = {
  1: {
    name: 'Level 1: First Words',
    short: 'Level 1',
    description: 'For children eager to begin reading. Big bright pictures & simple words.',
    words: '0–250 words',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    dotColor: '#10B981',
  },
  2: {
    name: 'Level 2: Early Reader',
    short: 'Level 2',
    description: 'For children learning to read with help. Short sentences & fun wordplay.',
    words: '250–600 words',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    dotColor: '#0EA5E9',
  },
  3: {
    name: 'Level 3: Reading Alone',
    short: 'Level 3',
    description: 'For children reading independently. Longer paragraphs & exciting plots.',
    words: '600–1200 words',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    dotColor: '#F59E0B',
  },
  4: {
    name: 'Level 4: Advanced',
    short: 'Level 4',
    description: 'For proficient readers seeking rich vocabulary & nuanced dilemmas.',
    words: '1200+ words',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    dotColor: '#A855F7',
  },
};

export const STORYWEAVER_LANGUAGES = [
  { id: 'all', name: 'All Languages (350+)', native: 'सभी भाषाएँ' },
  { id: 'en', name: 'English', native: 'English' },
  { id: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { id: 'mr', name: 'Marathi', native: 'मराठी' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { id: 'te', name: 'Telugu', native: 'తెలుగు' },
  { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'bn', name: 'Bengali', native: 'বাংলা' },
  { id: 'es', name: 'Spanish', native: 'Español' },
  { id: 'fr', name: 'French', native: 'Français' },
];

export const QUICK_CATEGORIES = [
  { id: 'all', label: 'All 150 Books', icon: '📚' },
  { id: 'Ages 3-5', label: 'Ages 3–5', icon: '🐣' },
  { id: 'Ages 6-8', label: 'Ages 6–8', icon: '🌱' },
  { id: 'Ages 9-10', label: 'Ages 9–10', icon: '🚀' },
  { id: 'Ages 11-12', label: 'Ages 11–12', icon: '🧭' },
  { id: 'STEM Stories', label: 'STEM Stories', icon: '🔬' },
  { id: 'Bedtime', label: 'Bedtime & Calm', icon: '🌙' },
  { id: 'Bilingual', label: 'Bilingual Stories', icon: '🗣️' },
  { id: 'Nature & Animals', label: 'Nature & Animals', icon: '🌿' },
  { id: 'Humour', label: 'Humour & Fun', icon: '😄' },
];

export const CURATED_150_BOOKS: StoryWeaverBook[] = [
  {
    id: 'sw-fat-king',
    title: 'Fat King Thin Dog',
    subtitle: 'A rollicking chase through town with a fast pup!',
    level: 1,
    levelTitle: 'Level 1: First Words',
    levelColor: {
      bg: 'from-emerald-900/60 to-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/20',
    },
    author: 'Parismita Singh',
    illustrator: 'Parismita Singh',
    synopsis:
      'The Fat King has a thin dog. One day, the thin dog spots a playful bird and runs! The king runs after the dog. Who will get tired first? A legendary classic that has taught millions of children their first joyful English words.',
    languages: ['English', 'Hindi', 'Marathi', 'Tamil', 'Spanish', 'French'],
    originalLanguage: 'English',
    categories: ['Ages 3-5', 'Humour', 'Bilingual'],
    ageGroup: '3-5',
    readCount: '48.9k',
    pageCount: 16,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    isEditorSpotlight: true,
    spotlightQuote:
      '“A masterpiece of visual storytelling with minimal words that never fails to spark giggles and reading confidence.”',
    coverTheme: {
      gradient: 'from-amber-600 via-orange-500 to-rose-600',
      accent: '#FFD166',
      iconEmoji: '👑🐕',
      pattern: 'dots',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'This is a fat king. The fat king has a thin dog.',
        scenePrompt: 'A jolly round king in royal robes proudly petting his bouncy little greyhound pup.',
      },
      {
        pageNumber: 2,
        text: 'The fat king and his thin dog go for a walk.',
        scenePrompt: 'Strolling through the palace garden under golden sunshine and whispering palm trees.',
      },
      {
        pageNumber: 3,
        text: 'The dog sees a bird. The dog runs! The king runs after the dog!',
        scenePrompt: 'The pup sprints at full speed, ears flapping, while the king chases puffing with laughter!',
      },
    ],
  },
  {
    id: 'sw-ammachi-machines',
    title: "Ammachi's Amazing Machines",
    subtitle: 'Grandmother’s ingenious coconut-picking contraption',
    level: 2,
    levelTitle: 'Level 2: Early Reader',
    levelColor: {
      bg: 'from-sky-900/60 to-sky-950/80',
      text: 'text-sky-300',
      border: 'border-sky-500/40',
      badgeBg: 'bg-sky-500/20',
    },
    author: 'Rajiv Eipe',
    illustrator: 'Rajiv Eipe',
    synopsis:
      'Sooraj wants to eat delicious fresh coconut barfi. But the ripe coconuts are high up in the towering palm tree! Armed with pulleys, old cycle parts, and endless curiosity, grandmother Ammachi invents an astonishing climbing machine.',
    languages: ['English', 'Hindi', 'Malayalam', 'Marathi', 'Kannada', 'Bengali'],
    originalLanguage: 'English',
    categories: ['STEM Stories', 'Ages 6-8', 'Humour'],
    ageGroup: '6-8',
    readCount: '62.4k',
    pageCount: 24,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    isEditorSpotlight: true,
    spotlightQuote:
      '“Celebrates female ingenuity, intergenerational love, and everyday mechanical engineering in rural Kerala.”',
    coverTheme: {
      gradient: 'from-teal-600 via-emerald-600 to-cyan-700',
      accent: '#2EC4B6',
      iconEmoji: '🥥⚙️',
      pattern: 'gears',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: '“Ammachi, can we make coconut barfi today?” asked Sooraj with hopeful eyes.',
        scenePrompt: 'Sooraj tugging grandma’s saree in the kitchen surrounded by brass pots.',
      },
      {
        pageNumber: 2,
        text: '“Only if you help me pick the coconuts!” laughed Ammachi, wheeling out her toolbox.',
        scenePrompt: 'Ammachi adjusting levers, pulleys, and ropes connected to an old bicycle frame.',
      },
      {
        pageNumber: 3,
        text: 'Whoosh! With pedals spinning and pulleys creaking, Ammachi zipped straight up the tall palm!',
        scenePrompt: 'Grandma soaring up the tree trunk with a helmet and triumphant grin.',
      },
    ],
  },
  {
    id: 'sw-gappu-dance',
    title: "Gappu Can't Dance",
    subtitle: 'A sweet story of rhythm, friendship, and finding your own groove',
    level: 1,
    levelTitle: 'Level 1: First Words',
    levelColor: {
      bg: 'from-emerald-900/60 to-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/20',
    },
    author: 'Menaka Raman',
    illustrator: 'Gaurav Wakankar',
    synopsis:
      'Komal the cow loves to salsa, tap-dance, and twirl! But her best buddy Gappu the elephant trips over his own enormous feet. Can Gappu ever find his own signature moves for the forest carnival?',
    languages: ['English', 'Hindi', 'Tamil', 'Marathi', 'German'],
    originalLanguage: 'English',
    categories: ['Ages 3-5', 'Humour', 'Nature & Animals'],
    ageGroup: '3-5',
    readCount: '31.1k',
    pageCount: 16,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    coverTheme: {
      gradient: 'from-fuchsia-600 via-pink-600 to-rose-700',
      accent: '#FF9F68',
      iconEmoji: '🐘💃',
      pattern: 'music',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'One, two, three, hop! Komal danced with grace across the grassy meadow.',
        scenePrompt: 'A spotted cow doing a graceful pirouette wearing a flower behind her ear.',
      },
      {
        pageNumber: 2,
        text: 'Gappu tried to jump. Thud! He landed right on a squishy watermelon!',
        scenePrompt: 'A clumsy little elephant tangled in vines with watermelon juice everywhere.',
      },
      {
        pageNumber: 3,
        text: 'Then the drums began: Boom-ba, boom-ba! Gappu swayed his trunk and ears. That was his dance!',
        scenePrompt: 'All jungle animals cheering as Gappu invents the world’s greatest Elephant Sway.',
      },
    ],
  },
  {
    id: 'sw-weigh-elephant',
    title: 'How to Weigh an Elephant',
    subtitle: 'Ancient Archimedes physics solved by a clever young girl',
    level: 3,
    levelTitle: 'Level 3: Reading Alone',
    levelColor: {
      bg: 'from-amber-900/60 to-amber-950/80',
      text: 'text-amber-300',
      border: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/20',
    },
    author: 'Geeta Dharmarajan',
    illustrator: 'Wen Hsu Chen',
    synopsis:
      'The royal king wants to know the exact weight of his beloved royal elephant. But no royal weighing scale in the world is large enough! The wise ministers are baffled until young Leelavati steps forward with a wooden boat, the river, and stones.',
    languages: ['English', 'Hindi', 'Marathi', 'Tamil', 'Kannada', 'Telugu'],
    originalLanguage: 'English',
    categories: ['STEM Stories', 'Ages 9-10', 'Bilingual'],
    ageGroup: '9-10',
    readCount: '54.7k',
    pageCount: 28,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    isEditorSpotlight: true,
    spotlightQuote:
      '“A timeless mathematical fable showing how displacement and creative problem solving can measure the seemingly impossible.”',
    coverTheme: {
      gradient: 'from-blue-700 via-indigo-600 to-purple-800',
      accent: '#7E69FF',
      iconEmoji: '🐘⛵',
      pattern: 'waves',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: '“Whoever can weigh my grand elephant shall receive a chest of gold coins!” proclaimed the king.',
        scenePrompt: 'A majestic royal elephant adorned in silk standing before an exasperated council of ministers.',
      },
      {
        pageNumber: 2,
        text: '“Walk the elephant onto the big boat,” said Leelavati gently. “And mark the waterline on the wood.”',
        scenePrompt: 'The boat tilting into the lake as the elephant boards, Leelavati marking the water level with chalk.',
      },
      {
        pageNumber: 3,
        text: '“Now lead the beast off, and fill the boat with stones until it sinks to the same line. Weigh the stones!”',
        scenePrompt: 'The ministers gasping in wonder as the math clicks into place.',
      },
    ],
  },
  {
    id: 'sw-red-raincoat',
    title: 'The Red Raincoat',
    subtitle: 'Waiting for monsoon clouds with boundless anticipation',
    level: 1,
    levelTitle: 'Level 1: First Words',
    levelColor: {
      bg: 'from-emerald-900/60 to-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/20',
    },
    author: 'Kiran Kasturia',
    illustrator: 'Zainab Tambawalla',
    synopsis:
      'Manu’s parents buy him a bright cherry-red raincoat. On Monday, no rain. On Tuesday, clear blue sky! Manu checks the weather every single day of the week, desperate for thunder and pitter-patter puddles.',
    languages: ['English', 'Hindi', 'Marathi', 'Tamil', 'Kannada', 'Spanish'],
    originalLanguage: 'Hindi',
    categories: ['Ages 3-5', 'Bedtime', 'Bilingual'],
    ageGroup: '3-5',
    readCount: '41.3k',
    pageCount: 16,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    coverTheme: {
      gradient: 'from-red-600 via-rose-600 to-pink-700',
      accent: '#FF7B66',
      iconEmoji: '🧥🌧️',
      pattern: 'raindrops',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'On Sunday, Manu got a bright red raincoat from his mother. “Can I wear it now?” he asked.',
        scenePrompt: 'A wide-eyed boy in pajamas admiring his glossy red raincoat against the morning sun.',
      },
      {
        pageNumber: 2,
        text: '“No, Manu. It is sunny today!” said Ma. On Monday, the sun shone even brighter.',
        scenePrompt: 'Manu looking at the dazzling cloudless sky with his raincoat folded in his arms.',
      },
      {
        pageNumber: 3,
        text: 'On Saturday... Thunder! Lightning! Pitter-patter, splash! Manu splashed in the rain!',
        scenePrompt: 'Manu leaping into puddles with water droplets flying and paper boats floating by.',
      },
    ],
  },
  {
    id: 'sw-chuskit-school',
    title: 'Chuskit Goes to School',
    subtitle: 'A courageous girl in Ladakh and a village that built a bridge',
    level: 3,
    levelTitle: 'Level 3: Reading Alone',
    levelColor: {
      bg: 'from-amber-900/60 to-amber-950/80',
      text: 'text-amber-300',
      border: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/20',
    },
    author: 'Sujatha Padmanabhan',
    illustrator: 'Madhuvanthi Mohan',
    synopsis:
      'Nine-year-old Chuskit cannot walk and uses a wheelchair in the rugged Himalayan mountains of Ladakh. The path to school across the rocky stream is impossible for wheels. But her determined friend Abdul and the village children unite to build a wooden ramp across the stream so Chuskit can study.',
    languages: ['English', 'Hindi', 'Ladakhi', 'Tibetan', 'Marathi', 'French'],
    originalLanguage: 'English',
    categories: ['Ages 9-10', 'Bilingual', 'Nature & Animals'],
    ageGroup: '9-10',
    readCount: '58.2k',
    pageCount: 32,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    coverTheme: {
      gradient: 'from-amber-700 via-yellow-600 to-stone-700',
      accent: '#FFD166',
      iconEmoji: '🏔️♿',
      pattern: 'mountains',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'From her window, Chuskit watched her younger brother tie his school bag and hurry down the hill.',
        scenePrompt: 'A cozy Ladakhi mud-brick room with prayer flags fluttering outside snow-capped peaks.',
      },
      {
        pageNumber: 2,
        text: '“Why can’t I go to school, Meme-ley?” she asked her grandfather. “The rocky path is too harsh for wheels, my child.”',
        scenePrompt: 'Her grandfather gently turning the spinning prayer wheel with a tender, sympathetic smile.',
      },
      {
        pageNumber: 3,
        text: 'Abdul gathered all the children and the school Headmaster. Together, they leveled the stones and laid smooth wooden planks.',
        scenePrompt: 'Dozens of children carrying wooden planks together over the rushing blue glacial stream.',
      },
    ],
  },
  {
    id: 'sw-annual-haircut',
    title: 'Annual Haircut Day',
    subtitle: 'Sringeri Srinivas and the comical quest to trim very long hair',
    level: 2,
    levelTitle: 'Level 2: Early Reader',
    levelColor: {
      bg: 'from-sky-900/60 to-sky-950/80',
      text: 'text-sky-300',
      border: 'border-sky-500/40',
      badgeBg: 'bg-sky-500/20',
    },
    author: 'Rohit Kulkarni',
    illustrator: 'Angie & Upesh',
    synopsis:
      'Sringeri Srinivas grows his hair all year long until it reaches his knees. On the annual haircut day, the barber refuses, his wife refuses, and even the village tailor refuses! Who will finally help trim this giant mop of hair?',
    languages: ['English', 'Hindi', 'Kannada', 'Marathi', 'Tamil', 'Spanish'],
    originalLanguage: 'Kannada',
    categories: ['Humour', 'Ages 6-8', 'Nature & Animals'],
    ageGroup: '6-8',
    readCount: '37.8k',
    pageCount: 20,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    coverTheme: {
      gradient: 'from-purple-700 via-violet-600 to-indigo-800',
      accent: '#A855F7',
      iconEmoji: '✂️🦁',
      pattern: 'stripes',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'Sringeri Srinivas had very, very long hair. It flowed past his shoulders and tickled his knees.',
        scenePrompt: 'A mustachioed banana farmer with an enormous cloud of dark curly hair towering above his head.',
      },
      {
        pageNumber: 2,
        text: 'He went to the village barber. The barber took one look at the gigantic bush of hair and yelled: “I need my holiday!”',
        scenePrompt: 'The barber dropping his scissors and running out the shop door into the dusty lane.',
      },
      {
        pageNumber: 3,
        text: 'Sringeri Srinivas fell asleep under a tree. A curious stray sheep wandered over and began munching the leafy curls snip-snip-snip!',
        scenePrompt: 'A contented fluffy white sheep nibbling the farmer’s hair into a surprisingly neat stylish bob.',
      },
    ],
  },
  {
    id: 'sw-under-my-bed',
    title: 'Under My Bed',
    subtitle: 'Bedtime shadows, creeping monsters, or cozy fluffy friends?',
    level: 1,
    levelTitle: 'Level 1: First Words',
    levelColor: {
      bg: 'from-emerald-900/60 to-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/20',
    },
    author: 'Anupa Lal',
    illustrator: 'Suvidha Mistry',
    synopsis:
      'At night when the lights go click, strange whispers echo from underneath the bed. Is it a dragon with glowing fangs? A toothy alligator? A young boy peeks under with a flashlight to uncover the funny nighttime truth.',
    languages: ['English', 'Hindi', 'Marathi', 'French', 'Bengali'],
    originalLanguage: 'English',
    categories: ['Bedtime', 'Ages 3-5', 'Humour'],
    ageGroup: '3-5',
    readCount: '29.4k',
    pageCount: 16,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    coverTheme: {
      gradient: 'from-indigo-900 via-slate-800 to-blue-950',
      accent: '#FEF08A',
      iconEmoji: '🔦🧸',
      pattern: 'stars',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'The moon is high. The room is quiet. Scratch, scratch goes something under my bed.',
        scenePrompt: 'A dark blue bedroom with moonbeams illuminating a cozy quilt and wide watchful eyes.',
      },
      {
        pageNumber: 2,
        text: 'I click on my yellow flashlight and take a big brave breath. 1... 2... 3!',
        scenePrompt: 'A bright beam of flashlight cutting across the floorboards into the shadowy underbed.',
      },
      {
        pageNumber: 3,
        text: 'Aha! Not a monster at all — just Mittens the kitten snoring softly beside my lost red slipper!',
        scenePrompt: 'A tiny orange striped kitten curled around an old wool slipper, purring happily.',
      },
    ],
  },
  {
    id: 'sw-butterfly-smile',
    title: 'A Butterfly Smile',
    subtitle: 'Finding belonging and kindness in a brand new classroom',
    level: 2,
    levelTitle: 'Level 2: Early Reader',
    levelColor: {
      bg: 'from-sky-900/60 to-sky-950/80',
      text: 'text-sky-300',
      border: 'border-sky-500/40',
      badgeBg: 'bg-sky-500/20',
    },
    author: 'Mathangi Subramanian',
    illustrator: 'Ayswarya Sankaranarayanan',
    synopsis:
      'Kavya moves from her quiet mountain village to a bustling megacity school. She misses the marigold blooms, the forest songs, and her friends. But when the teacher introduces the miracle of caterpillars becoming butterflies, Kavya finds her own wings.',
    languages: ['English', 'Hindi', 'Tamil', 'Kannada', 'Marathi'],
    originalLanguage: 'English',
    categories: ['Nature & Animals', 'Ages 6-8', 'STEM Stories'],
    ageGroup: '6-8',
    readCount: '33.5k',
    pageCount: 20,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    coverTheme: {
      gradient: 'from-emerald-700 via-teal-600 to-cyan-800',
      accent: '#34D399',
      iconEmoji: '🦋🌻',
      pattern: 'leaves',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'The city school was loud and crowded. Kavya sat at the back bench, holding her pencil case tight.',
        scenePrompt: 'Kavya in her crisp navy school uniform looking out the window longing for green hills.',
      },
      {
        pageNumber: 2,
        text: '“Today we study the life of the Monarch butterfly,” said Miss Anita, showing a glass jar with a green chrysalis.',
        scenePrompt: 'Children pressing their noses against the glass, eyes shining with fascination.',
      },
      {
        pageNumber: 3,
        text: 'Kavya smiled. “In my village, they fly by thousands across the pine forest,” she shared. The whole class listened in wonder.',
        scenePrompt: 'Her classmate passing her a drawing of a butterfly with “Will you be my friend?” written inside.',
      },
    ],
  },
  {
    id: 'sw-snoring-shanmugam',
    title: 'Snoring Shanmugam',
    subtitle: 'The lion who slept so loud he shook the mango trees',
    level: 2,
    levelTitle: 'Level 2: Early Reader',
    levelColor: {
      bg: 'from-sky-900/60 to-sky-950/80',
      text: 'text-sky-300',
      border: 'border-sky-500/40',
      badgeBg: 'bg-sky-500/20',
    },
    author: 'Radhika Chadha',
    illustrator: 'Priya Kuriyan',
    synopsis:
      'Shanmugam is supposed to be the terrifying king of the jungle. Instead, all he does is sleep! His thunderous snore — ZZZ-GROOONK! — rattles monkey branches and wakes baby deer. The exasperated animals hatch a plot to wake him up.',
    languages: ['English', 'Hindi', 'Tamil', 'Marathi', 'Bengali'],
    originalLanguage: 'Tamil',
    categories: ['Humour', 'Nature & Animals', 'Ages 6-8'],
    ageGroup: '6-8',
    readCount: '44.1k',
    pageCount: 24,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    coverTheme: {
      gradient: 'from-amber-600 via-orange-600 to-yellow-600',
      accent: '#FBBF24',
      iconEmoji: '🦁💤',
      pattern: 'dots',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'GROOO-HONK! The ground shook. Ripe guavas dropped from the trees like rain.',
        scenePrompt: 'A giant golden lion snoozing under a banyan tree with his mouth wide open.',
      },
      {
        pageNumber: 2,
        text: '“We haven’t slept in four days!” complained Cheeku the monkey, plugging his ears with two bananas.',
        scenePrompt: 'Monkeys, parrots, and squirrels holding an emergency jungle town hall meeting.',
      },
      {
        pageNumber: 3,
        text: 'Little ant Pip marched up Shanmugam’s golden nose and delivered a gentle, ticklish sneeze: “A-CHOO!”',
        scenePrompt: 'The lion sitting bolt upright with his mane standing on end, blinking at a tiny smiling ant.',
      },
    ],
  },
  {
    id: 'sw-moon-and-cap',
    title: 'The Moon and the Cap',
    subtitle: 'A windy hillside walk and a hat that reached the stars',
    level: 1,
    levelTitle: 'Level 1: First Words',
    levelColor: {
      bg: 'from-emerald-900/60 to-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/20',
    },
    author: 'Rohini Nilekani',
    illustrator: 'Angie & Upesh',
    synopsis:
      'Chintu buys a bright shiny blue cap from the village fair. But whoosh! The mountain wind swoops down and carries the cap up, up into the dusk sky. That night, Chintu looks out his window to see who is wearing his cap.',
    languages: ['English', 'Hindi', 'Marathi', 'Kannada', 'Spanish', 'French'],
    originalLanguage: 'English',
    categories: ['Bedtime', 'Ages 3-5', 'Bilingual'],
    ageGroup: '3-5',
    readCount: '52.6k',
    pageCount: 16,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    coverTheme: {
      gradient: 'from-blue-800 via-cyan-700 to-indigo-900',
      accent: '#67E8F9',
      iconEmoji: '🌙🧢',
      pattern: 'clouds',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'At the bustling town fair, Chintu picked a bright blue cap with silver stars.',
        scenePrompt: 'A happy boy spinning in a blue cap with ribbons dancing in the afternoon breeze.',
      },
      {
        pageNumber: 2,
        text: 'SWOOSH! A playful gust of mountain wind blew Chintu’s cap right off his head!',
        scenePrompt: 'The cap sailing higher and higher over rooftop tiles, pine trees, and evening clouds.',
      },
      {
        pageNumber: 3,
        text: 'That night, the full silver moon peered down through the pines... wearing the blue cap right on its head!',
        scenePrompt: 'A glowing smiling moon wearing the star-speckled blue cap at a jaunty angle.',
      },
    ],
  },
  {
    id: 'sw-bhimrao-library',
    title: "Bhimrao's Big Library",
    subtitle: 'The boy who loved books and transformed a nation',
    level: 4,
    levelTitle: 'Level 4: Advanced',
    levelColor: {
      bg: 'from-purple-900/60 to-purple-950/80',
      text: 'text-purple-300',
      border: 'border-purple-500/40',
      badgeBg: 'bg-purple-500/20',
    },
    author: 'Yogesh Maitreya',
    illustrator: 'Somesh Kumar',
    synopsis:
      'Young Bhimrao Ambedkar faced harsh unfair treatment and was made to sit on a burlap sack on the classroom floor. Yet his hunger for reading burned like a star. He read through dawn and dusk, collected thousands of volumes, and grew up to architect India’s Constitution — ensuring equality, dignity, and rights for all.',
    languages: ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu'],
    originalLanguage: 'Marathi',
    categories: ['Ages 11-12', 'Bilingual'],
    ageGroup: '11-12',
    readCount: '67.8k',
    pageCount: 36,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    coverTheme: {
      gradient: 'from-sky-800 via-blue-900 to-indigo-950',
      accent: '#93C5FD',
      iconEmoji: '📖⚖️',
      pattern: 'books',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'While other children played marbles outside, young Bhim sat in the corner devoured by the pages of history, philosophy, and poetry.',
        scenePrompt: 'A studious boy reading by the soft glow of an oil lamp surrounded by towers of books.',
      },
      {
        pageNumber: 2,
        text: '“Books give you wings that no wall can ever contain,” his father told him softly.',
        scenePrompt: 'Father and son discussing world history under a banyan tree with deep mutual respect.',
      },
      {
        pageNumber: 3,
        text: 'With the power of words, reason, and justice, Dr. Ambedkar penned the Constitution of India, guaranteeing equal dignity to every child.',
        scenePrompt: 'Dr. Ambedkar holding the sacred blue book of the Constitution with people of all walks celebrating.',
      },
    ],
  },
  {
    id: 'sw-dum-dum',
    title: 'Dum Dum-a-Dum Dum',
    subtitle: 'The rhythm of the dholak echoing through the forest village',
    level: 1,
    levelTitle: 'Level 1: First Words',
    levelColor: {
      bg: 'from-emerald-900/60 to-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/20',
    },
    author: 'Meera Tendolkar',
    illustrator: 'Sonali Biswas',
    synopsis:
      'Guddu has a little clay drum called a dholak. When he taps it with his fingers, animals come dancing! Dum-dum-a-dum-dum! The peacocks fan their feathers, the frog leaps high, and the village sings.',
    languages: ['English', 'Hindi', 'Marathi', 'Bengali', 'Tamil'],
    originalLanguage: 'Hindi',
    categories: ['Ages 3-5', 'Humour', 'Nature & Animals'],
    ageGroup: '3-5',
    readCount: '25.3k',
    pageCount: 16,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    coverTheme: {
      gradient: 'from-amber-600 via-rose-600 to-red-700',
      accent: '#FDE047',
      iconEmoji: '🪘🦚',
      pattern: 'music',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'Tap-tap! Guddu plays his little drum. Dum-dum-a-dum-dum!',
        scenePrompt: 'A joyful toddler in a yellow kurta playing a painted two-headed dholak drum.',
      },
      {
        pageNumber: 2,
        text: 'The peacock hears the beat. Rustle-shiver! Out spreads a giant fan of turquoise feathers!',
        scenePrompt: 'A proud emerald-and-blue peacock dancing on a stone wall to the drumbeat.',
      },
      {
        pageNumber: 3,
        text: 'Soon the entire village joins hands: grandma, grandpa, puppies, and cows dancing in a merry circle!',
        scenePrompt: 'A vibrant village sunset festival with lanterns and joyous dancing.',
      },
    ],
  },
  {
    id: 'sw-wild-cat',
    title: 'Wild Cat! Wild Cat!',
    subtitle: 'The mysterious leopards, snow cats, and cloud leopards of Asia',
    level: 3,
    levelTitle: 'Level 3: Reading Alone',
    levelColor: {
      bg: 'from-amber-900/60 to-amber-950/80',
      text: 'text-amber-300',
      border: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/20',
    },
    author: 'Sejal Mehta',
    illustrator: 'Rohan Chakravarty',
    synopsis:
      'Did you know that India is home to 15 different species of wild cats? From the fishing cat that dives for carp to the ghost-like snow leopard of Spiti Valley, discover how each feline has evolved magical superpowers for survival.',
    languages: ['English', 'Hindi', 'Marathi', 'Kannada', 'German'],
    originalLanguage: 'English',
    categories: ['STEM Stories', 'Nature & Animals', 'Ages 9-10'],
    ageGroup: '9-10',
    readCount: '41.9k',
    pageCount: 28,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    coverTheme: {
      gradient: 'from-emerald-800 via-green-700 to-teal-900',
      accent: '#A7F3D0',
      iconEmoji: '🐆🐾',
      pattern: 'jungle',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'Deep in the mangrove swamps, two amber eyes peer out through the tangled roots. Sploosh! A fishing cat dives underwater.',
        scenePrompt: 'A muscular spotted wild cat with partially webbed paws catching a silvery fish under moonlight.',
      },
      {
        pageNumber: 2,
        text: 'High up in Ladakh’s snowy cliffs, the snow leopard wraps her thick furry tail around her nose like a woolen scarf against minus-30-degree winds.',
        scenePrompt: 'A majestic smoke-gray snow leopard perched camouflage against granite boulders.',
      },
      {
        pageNumber: 3,
        text: 'Protecting these wild felines means saving our forests, rivers, and mountains for every living creature.',
        scenePrompt: 'A panoramic view of pristine tiger reserves and alpine ridges thriving in harmony.',
      },
    ],
  },
  {
    id: 'sw-kottavi-raja',
    title: "Kottavi Raja's Sleepy Kingdom",
    subtitle: 'The monarch who yawned so hard he put an entire city to sleep',
    level: 2,
    levelTitle: 'Level 2: Early Reader',
    levelColor: {
      bg: 'from-sky-900/60 to-sky-950/80',
      text: 'text-sky-300',
      border: 'border-sky-500/40',
      badgeBg: 'bg-sky-500/20',
    },
    author: 'Radhika Chadha',
    illustrator: 'Priya Kuriyan',
    synopsis:
      'Kottavi Raja has a terrible yawn condition. Whenever he opens his royal mouth — AAAAAAH-HHH-OUM! — the court soldiers drop their spears, the cook drops the ladle, and the palace horses collapse into snore-land!',
    languages: ['English', 'Hindi', 'Tamil', 'Telugu', 'Spanish'],
    originalLanguage: 'Tamil',
    categories: ['Bedtime', 'Humour', 'Ages 6-8'],
    ageGroup: '6-8',
    readCount: '36.4k',
    pageCount: 24,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    coverTheme: {
      gradient: 'from-indigo-700 via-purple-700 to-slate-900',
      accent: '#C4B5FD',
      iconEmoji: '🥱👑',
      pattern: 'night',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: '“Yawwwwn!” said the King. The Prime Minister yawned. The guards yawned. Even the royal parrot yawned.',
        scenePrompt: 'The whole royal courtroom stretching their arms with heavy droopy eyelids.',
      },
      {
        pageNumber: 2,
        text: 'The kingdom was snoring so loud that passing merchant ships thought it was a lighthouse foghorn!',
        scenePrompt: 'Sailing ships steering away from the misty slumbering harbor town.',
      },
      {
        pageNumber: 3,
        text: 'Only clever Little Meena had the cure: a cup of warm ginger water and a ticklish nursery riddle that made the King burst into laughter!',
        scenePrompt: 'The King giggling with tea splashing while everyone wakes up refreshed.',
      },
    ],
  },
  {
    id: 'sw-vayu-wind',
    title: "Vayu, The Wind's Secret Song",
    subtitle: 'An atmospheric voyage tracking monsoon air currents across oceans',
    level: 4,
    levelTitle: 'Level 4: Advanced',
    levelColor: {
      bg: 'from-purple-900/60 to-purple-950/80',
      text: 'text-purple-300',
      border: 'border-purple-500/40',
      badgeBg: 'bg-purple-500/20',
    },
    author: 'Jitendra Thakur',
    illustrator: 'Subhadra Sen',
    synopsis:
      'From the scorching sands of the Thar Desert to the mist-shrouded Western Ghats, follow Vayu the wind spirit as pressure gradients, ocean heat, and Coriolis forces conjure the life-giving Southwest Monsoon.',
    languages: ['English', 'Hindi', 'Marathi', 'Bengali', 'French'],
    originalLanguage: 'Hindi',
    categories: ['STEM Stories', 'Nature & Animals', 'Ages 11-12'],
    ageGroup: '11-12',
    readCount: '39.7k',
    pageCount: 32,
    hasAudio: true,
    license: 'CC-BY 4.0 (Pratham Books)',
    coverTheme: {
      gradient: 'from-teal-800 via-cyan-800 to-blue-900',
      accent: '#5EEAD4',
      iconEmoji: '🌪️🌊',
      pattern: 'wind',
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'As the summer sun bakes the continental plate, warm air expands and lifts like a gigantic invisible balloon.',
        scenePrompt: 'Shimmering thermal currents rising from sun-baked terracotta earth into the upper atmosphere.',
      },
      {
        pageNumber: 2,
        text: 'Over the Indian Ocean, heavy moisture-laden sea breezes rush to fill the void. The monsoon is born.',
        scenePrompt: 'Massive towering cumulonimbus clouds gathering moisture across deep sapphire ocean waves.',
      },
      {
        pageNumber: 3,
        text: 'When Vayu hits the emerald Western Ghats, clouds condense into rain, filling rivers that nourish millions of farmers.',
        scenePrompt: 'Waterfalls roaring down lush green cliffs with rainbow mists showering fertile paddy terraces.',
      },
    ],
  },
];
