// UTOPIA knowledge base (mock/local). Shape mirrors the future backend API.
const aksumImg = "/encyclopedia/aksum.jpg";
const lalibelaImg = "/encyclopedia/lalibela.jpg";
const simienImg = "/encyclopedia/simien.jpg";
const coffeeImg = "/encyclopedia/coffee.jpg";
const gondarImg = "/encyclopedia/gondar.jpg";
const guideImg = "/encyclopedia/guide.jpg";
const heroImg = "/encyclopedia/hero.jpg";

export const images = { aksumImg, lalibelaImg, simienImg, coffeeImg, gondarImg, guideImg, heroImg };

export type CategoryId =
  | "people" | "places" | "history" | "heritage" | "nature" | "wildlife" | "culture"
  | "languages" | "food" | "music" | "art" | "science" | "events" | "stories";

export interface Category {
  id: CategoryId;
  num: string;
  am: string;
  en: string;
  glyph: string; // Ge'ez letter used as illustrated sigil
  blurb: string;
}

export const categories: Category[] = [
  { id: "people", num: "01", am: "ሰዎች", en: "People", glyph: "ሰ", blurb: "Rulers, runners, thinkers and dreamers." },
  { id: "places", num: "02", am: "ቦታዎች", en: "Places", glyph: "ቦ", blurb: "Cities of stone, cliffs and coffee forests." },
  { id: "history", num: "03", am: "ታሪክ", en: "History", glyph: "ታ", blurb: "Three thousand years, one story." },
  { id: "heritage", num: "04", am: "ቅርሶች", en: "Heritage", glyph: "ቅ", blurb: "Treasures carved, written and kept." },
  { id: "nature", num: "05", am: "ተፈጥሮ", en: "Nature", glyph: "ተ", blurb: "From the Danakil to the roof of Africa." },
  { id: "wildlife", num: "06", am: "እንስሳት", en: "Wildlife", glyph: "እ", blurb: "Creatures found nowhere else on Earth." },
  { id: "culture", num: "07", am: "ባህል", en: "Culture", glyph: "ባ", blurb: "Ceremonies, calendars and celebrations." },
  { id: "languages", num: "08", am: "ቋንቋዎች", en: "Languages", glyph: "ቋ", blurb: "Over eighty tongues and an ancient script." },
  { id: "food", num: "09", am: "ምግብ", en: "Food", glyph: "ም", blurb: "Injera, berbere and the gift of coffee." },
  { id: "music", num: "10", am: "ሙዚቃ", en: "Music", glyph: "ሙ", blurb: "Krar strings, kebero drums, Ethio-jazz." },
  { id: "art", num: "11", am: "ስነ-ጥበብ", en: "Art", glyph: "ጥ", blurb: "Manuscripts, crosses and painted saints." },
  { id: "science", num: "12", am: "ሳይንስ እና ፈጠራ", en: "Science & Innovation", glyph: "ሳ", blurb: "Calendars, astronomy and new frontiers." },
  { id: "events", num: "13", am: "ክስተቶች", en: "Events", glyph: "ክ", blurb: "Moments that changed the course of Africa." },
  { id: "stories", num: "14", am: "ታሪኮች እና አፈ ታሪኮች", en: "Stories & Legends", glyph: "ኣ", blurb: "Queens, dancing goats and the Ark." },
];

export const categoryById = (id: string) => categories.find((c) => c.id === id);

export interface Exploration {
  id: string;
  title: string;
  amharicTitle: string;
  category: CategoryId;
  tags: CategoryId[];
  description: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  facts: { label: string; value: string }[];
  didYouKnow: string;
  story: string[];
  timeline?: { year: string; event: string }[];
  relatedItems: string[];
}

export const explorations: Exploration[] = [
  {
    id: "aksum", title: "Aksum", amharicTitle: "አክሱም", category: "places", tags: ["history", "heritage"],
    description: "Capital of one of the four great empires of the ancient world, crowned by towering granite stelae.",
    image: aksumImg, latitude: 14.1211, longitude: 38.7232, region: "Tigray, Ethiopia",
    facts: [
      { label: "Founded", value: "c. 100 BCE" },
      { label: "UNESCO", value: "1980" },
      { label: "Tallest stele", value: "33 m (fallen)" },
      { label: "Script", value: "Ge'ez" },
    ],
    didYouKnow: "Aksum minted its own gold, silver and bronze coins — one of the first African kingdoms to do so.",
    story: [
      "Long before the castles of Gondar or the churches of Lalibela, Aksum ruled the trade routes between Rome, Arabia, Persia and India. Ships at its port of Adulis carried ivory, gold and incense across the Red Sea.",
      "Its kings raised enormous single-stone stelae, carved to look like multi-storey palaces with false doors and windows. They marked royal tombs and announced Aksum's power to the world.",
      "In the 4th century, King Ezana embraced Christianity, making Aksum one of the first Christian states. Tradition holds that the Ark of the Covenant still rests here, in the Chapel of the Tablet.",
    ],
    timeline: [
      { year: "c. 100 BCE", event: "Aksumite kingdom rises in the northern highlands" },
      { year: "c. 270 CE", event: "Aksum begins minting coins" },
      { year: "c. 330 CE", event: "King Ezana adopts Christianity" },
      { year: "c. 940 CE", event: "Decline of the empire" },
      { year: "2005", event: "The Obelisk of Aksum returns from Rome" },
    ],
    relatedItems: ["ezana", "geez", "queen-of-sheba", "lalibela"],
  },
  {
    id: "lalibela", title: "Lalibela", amharicTitle: "ላሊበላ", category: "places", tags: ["heritage", "history"],
    description: "Eleven churches carved downward from living rock — a 'New Jerusalem' in the highlands.",
    image: lalibelaImg, latitude: 12.0317, longitude: 39.0476, region: "Amhara, Ethiopia",
    facts: [
      { label: "Built", value: "12th–13th c." },
      { label: "Churches", value: "11" },
      { label: "UNESCO", value: "1978" },
      { label: "Patron", value: "King Lalibela" },
    ],
    didYouKnow: "Bete Giyorgis was carved top-down from a single block of rock — no bricks, no mortar.",
    story: [
      "King Gebre Meskel Lalibela of the Zagwe dynasty set out to build a New Jerusalem so pilgrims would not need to travel to the Holy Land.",
      "Workers carved downward into volcanic tuff, freeing whole buildings from the mountain and connecting them with trenches, tunnels and passageways.",
      "Today, thousands of pilgrims dressed in white gather here for Genna (Ethiopian Christmas), filling the stone courtyards with chant and candlelight.",
    ],
    timeline: [
      { year: "c. 1181", event: "King Lalibela begins his reign" },
      { year: "c. 1220", event: "Bete Giyorgis completed" },
      { year: "1978", event: "Declared UNESCO World Heritage" },
    ],
    relatedItems: ["aksum", "timkat", "gondar"],
  },
  {
    id: "gondar", title: "Gondar", amharicTitle: "ጎንደር", category: "places", tags: ["history", "heritage"],
    description: "The 'Camelot of Africa' — royal castles from the 17th-century Ethiopian empire.",
    image: gondarImg, latitude: 12.6075, longitude: 37.4693, region: "Amhara, Ethiopia",
    facts: [
      { label: "Founded", value: "1636" },
      { label: "Founder", value: "Emperor Fasilides" },
      { label: "Site", value: "Fasil Ghebbi" },
      { label: "UNESCO", value: "1979" },
    ],
    didYouKnow: "Fasilides' Bath is filled with water once a year for the Timkat celebration.",
    story: [
      "Emperor Fasilides made Gondar his capital and built a castle unlike anything seen before — mixing Aksumite, Indian and Portuguese styles.",
      "Later emperors added palaces, libraries and banquet halls inside the walled royal enclosure called Fasil Ghebbi.",
    ],
    timeline: [
      { year: "1636", event: "Fasilides founds Gondar" },
      { year: "1700s", event: "Golden age of art and scholarship" },
    ],
    relatedItems: ["lalibela", "timkat", "lake-tana"],
  },
  {
    id: "harar", title: "Harar Jugol", amharicTitle: "ሐረር", category: "places", tags: ["culture", "heritage"],
    description: "A walled city of 82 mosques, colourful alleys and nightly hyena feeding.",
    latitude: 9.3117, longitude: 42.1255, region: "Harari, Ethiopia",
    facts: [
      { label: "Walls built", value: "16th c." },
      { label: "Gates", value: "6 historic" },
      { label: "Alleys", value: "368" },
      { label: "UNESCO", value: "2006" },
    ],
    didYouKnow: "Harar's 'hyena men' have fed wild hyenas by hand for generations.",
    story: [
      "Harar was a crossroads of trade between the Horn of Africa, Arabia and India, and a great centre of Islamic learning.",
      "Its Jugol wall encloses a maze of lanes where colourful houses and baskets tell stories of Harari craftsmanship.",
    ],
    relatedItems: ["coffee", "gondar"],
  },
  {
    id: "simien", title: "Simien Mountains", amharicTitle: "ሰሜን ተራሮች", category: "nature", tags: ["wildlife", "places"],
    description: "Jagged peaks and sheer escarpments — home to geladas and the Ethiopian wolf.",
    image: simienImg, latitude: 13.2667, longitude: 38.0, region: "Amhara, Ethiopia",
    facts: [
      { label: "Highest peak", value: "Ras Dashen 4,550 m" },
      { label: "National park", value: "1969" },
      { label: "UNESCO", value: "1978" },
      { label: "Nickname", value: "Chess set of the gods" },
    ],
    didYouKnow: "Some cliffs in the Simiens drop over 1,500 metres straight down.",
    story: [
      "Millions of years of erosion carved the Simien plateau into towers, gorges and ridges that look like a giant's chessboard.",
      "It is one of the last refuges of the Walia ibex, which exists nowhere else on Earth.",
    ],
    relatedItems: ["simien-wolf", "gelada", "lake-tana"],
  },
  {
    id: "lake-tana", title: "Lake Tana", amharicTitle: "ጣና ሐይቅ", category: "nature", tags: ["places", "heritage"],
    description: "Ethiopia's largest lake and source of the Blue Nile, dotted with island monasteries.",
    latitude: 11.6, longitude: 37.3833, region: "Amhara, Ethiopia",
    facts: [
      { label: "Area", value: "~3,000 km²" },
      { label: "Islands", value: "37" },
      { label: "Outflow", value: "Blue Nile (Abay)" },
      { label: "Boats", value: "Papyrus tankwa" },
    ],
    didYouKnow: "Fishermen still sail Lake Tana in tankwa — boats woven from papyrus reeds.",
    story: [
      "Monks have guarded ancient manuscripts and painted churches on Tana's islands for centuries.",
      "From its southern shore, the Blue Nile begins a 1,450 km journey to meet the White Nile in Khartoum.",
    ],
    relatedItems: ["gondar", "simien"],
  },
  {
    id: "danakil", title: "Danakil Depression", amharicTitle: "ዳናኪል", category: "nature", tags: ["science", "places"],
    description: "One of the hottest places on Earth — acid pools, salt flats and lava lakes.",
    latitude: 14.2417, longitude: 40.3, region: "Afar, Ethiopia",
    facts: [
      { label: "Lowest point", value: "−125 m" },
      { label: "Avg. temp", value: "34.5 °C" },
      { label: "Volcano", value: "Erta Ale" },
      { label: "Trade", value: "Salt caravans" },
    ],
    didYouKnow: "Scientists study Dallol's acid pools to understand where life might exist on other planets.",
    story: ["Afar salt miners still cut blocks by hand and carry them by camel caravan, as they have for centuries."],
    relatedItems: ["lucy", "simien"],
  },
  {
    id: "lucy", title: "Lucy (Dinkinesh)", amharicTitle: "ድንቅነሽ", category: "science", tags: ["history", "people"],
    description: "A 3.2-million-year-old ancestor whose bones rewrote the human story.",
    latitude: 11.1, longitude: 40.58, region: "Hadar, Afar",
    facts: [
      { label: "Age", value: "3.2 million years" },
      { label: "Species", value: "Australopithecus afarensis" },
      { label: "Found", value: "1974" },
      { label: "Height", value: "~1.1 m" },
    ],
    didYouKnow: "Her Amharic name, Dinkinesh, means 'you are marvellous'.",
    story: ["Discovered at Hadar, Lucy showed that our ancestors walked upright long before brains grew large. Ethiopia is often called the cradle of humankind."],
    relatedItems: ["danakil", "ethiopian-calendar"],
  },
  {
    id: "ezana", title: "King Ezana", amharicTitle: "ንጉሥ ዔዛና", category: "people", tags: ["history"],
    description: "The Aksumite king who made Christianity a state religion in the 4th century.",
    facts: [
      { label: "Reign", value: "c. 320–360 CE" },
      { label: "Capital", value: "Aksum" },
      { label: "Legacy", value: "Ezana Stone" },
    ],
    didYouKnow: "The Ezana Stone records his deeds in three languages: Ge'ez, Sabaean and Greek.",
    story: ["Taught by the Syrian monk Frumentius, Ezana converted and placed the cross on Aksum's coins — one of the earliest such coins in the world."],
    relatedItems: ["aksum", "geez"],
  },
  {
    id: "taytu", title: "Empress Taytu Betul", amharicTitle: "እቴጌ ጣይቱ", category: "people", tags: ["history", "events"],
    description: "Strategist, founder of Addis Ababa and a commander at the Battle of Adwa.",
    facts: [
      { label: "Born", value: "c. 1851" },
      { label: "Founded", value: "Addis Ababa (1886)" },
      { label: "Battle", value: "Adwa, 1896" },
    ],
    didYouKnow: "Taytu chose the site of Addis Ababa ('New Flower') near hot springs she loved.",
    story: ["Taytu refused to accept the unfair Treaty of Wuchale and led thousands of soldiers at Adwa, cutting off the Italian water supply."],
    relatedItems: ["adwa", "menelik"],
  },
  {
    id: "menelik", title: "Emperor Menelik II", amharicTitle: "ዳግማዊ ምኒልክ", category: "people", tags: ["history"],
    description: "The emperor who led Ethiopia to victory at Adwa and modernised the country.",
    facts: [
      { label: "Reign", value: "1889–1913" },
      { label: "Brought", value: "Railway, telephone" },
    ],
    didYouKnow: "Menelik brought the telephone and electricity to Ethiopia.",
    story: ["Menelik united much of modern Ethiopia and, with Empress Taytu, defended its independence at Adwa."],
    relatedItems: ["adwa", "taytu"],
  },
  {
    id: "abebe-bikila", title: "Abebe Bikila", amharicTitle: "አበበ ቢቂላ", category: "people", tags: ["events"],
    description: "Won Olympic marathon gold in Rome in 1960 — running barefoot.",
    facts: [
      { label: "Golds", value: "1960 & 1964" },
      { label: "First", value: "Black African Olympic champion" },
    ],
    didYouKnow: "He crossed the finish near the Obelisk of Aksum, which Italy had taken from Ethiopia.",
    story: ["Abebe's barefoot victory through the streets of Rome became a symbol of African pride."],
    relatedItems: ["aksum"],
  },
  {
    id: "adwa", title: "Battle of Adwa", amharicTitle: "የዓድዋ ጦርነት", category: "events", tags: ["history"],
    description: "1896: Ethiopia defeats an invading Italian army and keeps its independence.",
    latitude: 14.1667, longitude: 38.9, region: "Tigray, Ethiopia",
    facts: [
      { label: "Date", value: "1 March 1896" },
      { label: "Leaders", value: "Menelik II, Taytu" },
      { label: "Victory day", value: "Yekatit 23" },
    ],
    didYouKnow: "Adwa inspired independence movements across Africa and the Caribbean.",
    story: ["Ethiopians from every region marched north to Adwa. Their victory made Ethiopia a lasting symbol of freedom."],
    timeline: [
      { year: "1889", event: "Treaty of Wuchale signed" },
      { year: "1895", event: "Italian invasion begins" },
      { year: "1896", event: "Victory at Adwa" },
    ],
    relatedItems: ["menelik", "taytu"],
  },
  {
    id: "geez", title: "Ge'ez Script", amharicTitle: "ግዕዝ", category: "languages", tags: ["heritage", "history"],
    description: "One of the oldest alphabets still in use — the fidel behind Amharic and Tigrinya.",
    facts: [
      { label: "Age", value: "~2,000+ years" },
      { label: "Type", value: "Abugida" },
      { label: "Characters", value: "~231 in Amharic" },
    ],
    didYouKnow: "Each Ge'ez character combines a consonant and a vowel — ሀ ሁ ሂ ሃ ሄ ህ ሆ.",
    story: ["Ge'ez is still the liturgical language of the Ethiopian Orthodox Church, and its script carries dozens of modern languages."],
    relatedItems: ["aksum", "ezana", "amharic"],
  },
  {
    id: "amharic", title: "Amharic", amharicTitle: "አማርኛ", category: "languages", tags: ["culture"],
    description: "Ethiopia's working language, spoken by tens of millions.",
    facts: [
      { label: "Family", value: "Semitic" },
      { label: "Script", value: "Ge'ez fidel" },
    ],
    didYouKnow: "Amharic is the second most spoken Semitic language in the world after Arabic.",
    story: ["Amharic poetry loves 'wax and gold' (ሰምና ወርቅ) — words with a hidden second meaning."],
    relatedItems: ["geez", "afaan-oromo"],
  },
  {
    id: "afaan-oromo", title: "Afaan Oromo", amharicTitle: "ኦሮምኛ", category: "languages", tags: ["culture"],
    description: "The most widely spoken language in Ethiopia, written in the Latin-based Qubee.",
    facts: [{ label: "Family", value: "Cushitic" }, { label: "Script", value: "Qubee" }],
    didYouKnow: "The Gadaa system of the Oromo is a UNESCO-recognised form of democratic governance.",
    story: ["Afaan Oromo carries oral traditions, songs and the Gadaa system of rotating leadership."],
    relatedItems: ["amharic", "irreecha"],
  },
  {
    id: "coffee", title: "Coffee Ceremony", amharicTitle: "ቡና ማፍላት", category: "food", tags: ["culture"],
    description: "Roasted, ground and brewed in a jebena — three rounds of friendship.",
    image: coffeeImg, latitude: 7.25, longitude: 36.2, region: "Kaffa, Ethiopia",
    facts: [
      { label: "Rounds", value: "Abol, Tona, Baraka" },
      { label: "Pot", value: "Jebena" },
      { label: "Origin", value: "Kaffa forests" },
    ],
    didYouKnow: "The word 'coffee' may come from Kaffa, the region where wild coffee still grows.",
    story: [
      "Legend tells of Kaldi, a goatherd who saw his goats dancing after nibbling red berries.",
      "Today the ceremony brings neighbours together: green beans are roasted over coals, ground by hand and brewed three times, each round with a blessing.",
    ],
    relatedItems: ["kaldi", "injera", "harar"],
  },
  {
    id: "injera", title: "Injera", amharicTitle: "እንጀራ", category: "food", tags: ["culture"],
    description: "Spongy fermented flatbread made from teff — plate, spoon and food in one.",
    facts: [{ label: "Grain", value: "Teff" }, { label: "Fermentation", value: "2–3 days" }],
    didYouKnow: "Feeding someone a bite by hand — gursha — is a sign of love and respect.",
    story: ["Teff is tiny, gluten-free and rich in iron. Stews like doro wat are served on top of injera and shared from one plate."],
    relatedItems: ["coffee"],
  },
  {
    id: "timkat", title: "Timkat", amharicTitle: "ጥምቀት", category: "culture", tags: ["events", "heritage"],
    description: "Epiphany festival of processions, white robes and holy water every January.",
    latitude: 12.6075, longitude: 37.4693, region: "Celebrated nationwide",
    facts: [{ label: "Date", value: "Jan 19 (Ter 11)" }, { label: "UNESCO", value: "2019" }],
    didYouKnow: "Replicas of the Ark (tabots) are carried wrapped in rich cloth through the streets.",
    story: ["Priests carry the tabots to water, where crowds are blessed and sprinkled — joy, colour and song fill the day."],
    relatedItems: ["gondar", "lalibela", "meskel"],
  },
  {
    id: "meskel", title: "Meskel", amharicTitle: "መስቀል", category: "culture", tags: ["events"],
    description: "The finding of the True Cross, celebrated with a giant bonfire — the Demera.",
    facts: [{ label: "Date", value: "Sept 27" }, { label: "UNESCO", value: "2013" }],
    didYouKnow: "The direction the Demera falls is said to predict the year ahead.",
    story: ["Yellow Meskel daisies bloom across the highlands as the rainy season ends."],
    relatedItems: ["timkat", "ethiopian-calendar"],
  },
  {
    id: "irreecha", title: "Irreecha", amharicTitle: "ኢሬቻ", category: "culture", tags: ["events"],
    description: "Oromo thanksgiving festival held at lakes and rivers after the rains.",
    latitude: 8.75, longitude: 38.98, region: "Bishoftu, Oromia",
    facts: [{ label: "Season", value: "Early October" }, { label: "Place", value: "Hora Harsadi" }],
    didYouKnow: "People dip fresh grass and flowers in water to give thanks to Waaqa.",
    story: ["Millions gather in white and colourful dress to celebrate the start of the bright season."],
    relatedItems: ["afaan-oromo", "meskel"],
  },
  {
    id: "krar", title: "Krar", amharicTitle: "ክራር", category: "music", tags: ["culture"],
    description: "A bowl-shaped lyre with five or six strings, heart of azmari music.",
    facts: [{ label: "Strings", value: "5–6" }, { label: "Scales", value: "Qenet modes" }],
    didYouKnow: "Azmari singers improvise playful verses about the audience in real time.",
    story: ["Krar, masinko and kebero drums carry centuries of song from village weddings to Addis jazz clubs."],
    relatedItems: ["ethio-jazz"],
  },
  {
    id: "ethio-jazz", title: "Ethio-Jazz", amharicTitle: "ኢትዮ-ጃዝ", category: "music", tags: ["art"],
    description: "Mulatu Astatke's fusion of Ethiopian scales with jazz and Latin rhythms.",
    facts: [{ label: "Pioneer", value: "Mulatu Astatke" }, { label: "Era", value: "1960s–70s" }],
    didYouKnow: "The 'Éthiopiques' record series brought this golden age to the world.",
    story: ["Swinging Addis of the 1960s gave rise to a sound that is still sampled by artists everywhere."],
    relatedItems: ["krar"],
  },
  {
    id: "manuscripts", title: "Illuminated Manuscripts", amharicTitle: "የብራና መጻሕፍት", category: "art", tags: ["heritage"],
    description: "Goatskin books painted in vivid colour by monastic scribes.",
    facts: [{ label: "Material", value: "Parchment (brana)" }, { label: "Oldest", value: "Garima Gospels" }],
    didYouKnow: "The Garima Gospels may be the oldest illustrated Christian books in the world.",
    story: ["Scribes prepared parchment, mixed plant inks and painted saints with large, watchful eyes."],
    relatedItems: ["geez", "lake-tana"],
  },
  {
    id: "ethiopian-calendar", title: "Ethiopian Calendar", amharicTitle: "የኢትዮጵያ ዘመን አቆጣጠር", category: "science", tags: ["culture"],
    description: "Thirteen months of sunshine — and a calendar about 7–8 years behind the Gregorian.",
    facts: [{ label: "Months", value: "13" }, { label: "New year", value: "Enkutatash, Sept 11" }],
    didYouKnow: "The 13th month, Pagume, has only 5 days (6 in a leap year).",
    story: ["Ethiopian scholars kept their own reckoning of time, linked to the Alexandrian tradition."],
    relatedItems: ["meskel", "lucy"],
  },
  {
    id: "simien-wolf", title: "Ethiopian Wolf", amharicTitle: "ቀይ ቀበሮ", category: "wildlife", tags: ["nature"],
    description: "Africa's most endangered carnivore, hunting rodents on the high plateaus.",
    image: simienImg, latitude: 6.75, longitude: 39.75, region: "Bale Mountains",
    facts: [{ label: "Population", value: "~500" }, { label: "Status", value: "Endangered" }],
    didYouKnow: "It is the rarest canid in the world.",
    story: ["Ethiopian wolves live in family packs but hunt alone, pouncing on giant mole-rats."],
    relatedItems: ["gelada", "simien"],
  },
  {
    id: "gelada", title: "Gelada", amharicTitle: "ጭላዳ", category: "wildlife", tags: ["nature"],
    description: "Grass-eating primates with a bright red 'bleeding heart' patch.",
    image: simienImg, latitude: 13.25, longitude: 38.05, region: "Simien Mountains",
    facts: [{ label: "Diet", value: "Grass (90%)" }, { label: "Herds", value: "Up to 1,000" }],
    didYouKnow: "Geladas are the only primates that mostly eat grass.",
    story: ["They sleep on cliff ledges at night and spend days grazing on the highland meadows."],
    relatedItems: ["simien-wolf", "simien"],
  },
  {
    id: "queen-of-sheba", title: "Queen of Sheba", amharicTitle: "ንግሥተ ሳባ", category: "stories", tags: ["history", "people"],
    description: "Makeda, the legendary queen who journeyed to meet King Solomon.",
    facts: [{ label: "Name", value: "Makeda" }, { label: "Source", value: "Kebra Nagast" }],
    didYouKnow: "Her son Menelik I is said to have brought the Ark of the Covenant to Aksum.",
    story: ["The Kebra Nagast ('Glory of Kings') tells how Makeda travelled to Jerusalem, and how a dynasty was born."],
    relatedItems: ["aksum", "ezana"],
  },
  {
    id: "kaldi", title: "Kaldi & the Dancing Goats", amharicTitle: "ካልዲ", category: "stories", tags: ["food"],
    description: "The goatherd who discovered coffee when his goats wouldn't stop dancing.",
    facts: [{ label: "Region", value: "Kaffa" }, { label: "Lesson", value: "Curiosity rewards" }],
    didYouKnow: "In the legend, monks used the berries to stay awake during night prayers.",
    story: ["Kaldi followed his excited goats, tasted the red cherries himself, and soon the whole monastery was awake."],
    relatedItems: ["coffee"],
  },
];

export const explorationById = (id: string) => explorations.find((e) => e.id === id);
export const inCategory = (e: Exploration, c: string) => e.category === c || e.tags.includes(c as CategoryId);

export function searchExplorations(q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return explorations;
  return explorations.filter((e) =>
    [e.title, e.amharicTitle, e.description, e.region ?? "", e.category, ...e.tags, ...e.story]
      .join(" ")
      .toLowerCase()
      .includes(s.replace("'", "'")) ||
    e.title.toLowerCase().replace(/[^a-z]/g, "").includes(s.replace(/[^a-z]/g, "") || "~"),
  );
}

/* ---------- Challenges ---------- */
export interface Challenge {
  id: string;
  question: string;
  options: string[];
  answer: number;
  hints: string[];
  xp: number;
  explorationId: string;
  prompt?: string; // one friendly line shown under the question
}

export const challenges: Challenge[] = [
  { id: "c1", question: "Which ancient city is famous for its towering carved stelae?", options: ["Harar", "Aksum", "Gondar", "Bahir Dar"], answer: 1, hints: ["It was an empire trading with Rome.", "Its king Ezana adopted Christianity."], xp: 50, prompt: "Tall carved stones still stand in this city.", explorationId: "aksum" },
  { id: "c2", question: "In which year did Ethiopia win the Battle of Adwa?", options: ["1868", "1896", "1935", "1941"], answer: 1, hints: ["It was at the end of the 19th century."], xp: 50, prompt: "A victory still remembered across Africa.", explorationId: "adwa" },
  { id: "c3", question: "What grain is injera made from?", options: ["Wheat", "Sorghum", "Teff", "Barley"], answer: 2, hints: ["It's a tiny, gluten-free grain."], xp: 40, prompt: "Ethiopia's everyday flatbread starts with a tiny grain.", explorationId: "injera" },
  { id: "c4", question: "How many months are in the Ethiopian calendar?", options: ["12", "13", "14", "10"], answer: 1, hints: ["The last month, Pagume, is very short."], xp: 40, prompt: "Ethiopia keeps a calendar all its own.", explorationId: "ethiopian-calendar" },
  { id: "c5", question: "What does Lucy's Amharic name 'Dinkinesh' mean?", options: ["Ancient one", "You are marvellous", "First mother", "Small bones"], answer: 1, hints: ["It's a compliment!"], xp: 50, prompt: "A famous fossil has two names.", explorationId: "lucy" },
  { id: "c6", question: "Which Ethiopian place is home to eleven rock-hewn churches?", options: ["Aksum", "Lalibela", "Gondar", "Harar"], answer: 1, hints: ["The churches were carved downward into solid rock.", "The town is named after the king who ordered them built."], xp: 50, prompt: "Look closely. The answer is written in stone.", explorationId: "lalibela" },
];

export function todaysChallengeIndex(date = new Date()) {
  const d = Math.floor(date.getTime() / 86400000);
  return d % challenges.length;
}

/* ---------- Time Journeys ---------- */
export const episodes = [
  { id: "aksum", num: "01", title: "Kingdom of Aksum", role: "Scribe's Apprentice", era: "c. 340 CE", status: "available" as const, image: aksumImg },
  { id: "lalibela", num: "02", title: "Lalibela", role: "Stone Carver", era: "c. 1200 CE", status: "locked" as const, image: lalibelaImg },
  { id: "gondar", num: "03", title: "Gondar", role: "Royal Messenger", era: "c. 1640 CE", status: "locked" as const, image: gondarImg },
  { id: "adwa", num: "04", title: "Adwa", role: "Field Scout", era: "1896 CE", status: "locked" as const, image: "/art/adwa.jpg" },
];

/* ---------- Mini-games ---------- */
export type MiniGameKind = "choice" | "order";
export interface MiniGameRound {
  prompt: string;
  image?: string;
  glyph?: string;
  options: string[];
  answer: number;
}
export interface MiniGame {
  id: string;
  title: string;
  am: string;
  blurb: string;
  kind: MiniGameKind;
  glyph: string;
  time: number;
  xp: number;
  rounds?: MiniGameRound[];
  orderItems?: { label: string; sub: string }[]; // correct order
  orderPrompt?: string;
}

export const miniGames: MiniGame[] = [
  {
    id: "match-the-artifact", title: "Match the Artifact", am: "ቅርሱን አዛምድ", glyph: "ቅ", kind: "choice", time: 60, xp: 80,
    blurb: "Look closely. Name the treasure.",
    rounds: [
      { prompt: "What is this place?", image: aksumImg, options: ["Stelae of Aksum", "Fasil Ghebbi", "Harar Jugol", "Tiya stones"], answer: 0 },
      { prompt: "Which church is carved from a single rock?", image: lalibelaImg, options: ["Debre Berhan Selassie", "Bete Giyorgis", "Narga Selassie", "Ura Kidane Mehret"], answer: 1 },
      { prompt: "Name this royal enclosure.", image: gondarImg, options: ["Menelik Palace", "Fasil Ghebbi", "Yeha Temple", "Aksum Palace"], answer: 1 },
      { prompt: "What is the clay pot used for coffee called?", image: coffeeImg, options: ["Mesob", "Jebena", "Sini", "Gourd"], answer: 1 },
    ],
  },
  {
    id: "geez-match", title: "Ge'ez Match", am: "ፊደል አዛምድ", glyph: "ፊ", kind: "choice", time: 45, xp: 60,
    blurb: "Read the fidel. Find its sound.",
    rounds: [
      { prompt: "How is this character pronounced?", glyph: "ሀ", options: ["ha", "lu", "mi", "sa"], answer: 0 },
      { prompt: "How is this character pronounced?", glyph: "ሉ", options: ["la", "lu", "li", "le"], answer: 1 },
      { prompt: "How is this character pronounced?", glyph: "ማ", options: ["mu", "mi", "ma", "me"], answer: 2 },
      { prompt: "How is this character pronounced?", glyph: "ሰ", options: ["sa", "ra", "ba", "ta"], answer: 0 },
      { prompt: "How is this character pronounced?", glyph: "ቦ", options: ["bi", "bo", "be", "ba"], answer: 1 },
    ],
  },
  {
    id: "history-timeline", title: "History Timeline", am: "የታሪክ መስመር", glyph: "ታ", kind: "order", time: 90, xp: 90,
    blurb: "Put three thousand years in order.",
    orderPrompt: "Tap the events from oldest to newest.",
    orderItems: [
      { label: "Lucy lives in Afar", sub: "3.2 million years ago" },
      { label: "King Ezana adopts Christianity", sub: "c. 330 CE" },
      { label: "Lalibela's churches are carved", sub: "c. 1200" },
      { label: "Fasilides founds Gondar", sub: "1636" },
      { label: "Victory at Adwa", sub: "1896" },
    ],
  },
  {
    id: "wildlife-detective", title: "Wildlife Detective", am: "የዱር እንስሳት መርማሪ", glyph: "እ", kind: "choice", time: 45, xp: 60,
    blurb: "Follow the clues. Name the creature.",
    rounds: [
      { prompt: "I eat mostly grass and have a red patch on my chest.", options: ["Walia ibex", "Gelada", "Hyena", "Ostrich"], answer: 1 },
      { prompt: "I'm the rarest canid on Earth, hunting mole-rats in Bale.", options: ["Ethiopian wolf", "Jackal", "Fennec fox", "Caracal"], answer: 0 },
      { prompt: "I'm a wild goat found only in the Simien Mountains.", options: ["Mountain nyala", "Walia ibex", "Klipspringer", "Gerenuk"], answer: 1 },
      { prompt: "In Harar, people feed me by hand at night.", options: ["Lion", "Hyena", "Leopard", "Baboon"], answer: 1 },
    ],
  },
  {
    id: "coffee-ceremony", title: "Coffee Ceremony", am: "ቡና ማፍላት", glyph: "ቡ", kind: "order", time: 60, xp: 70,
    blurb: "Brew it the way grandmothers do.",
    orderPrompt: "Tap each step of the ceremony in order.",
    orderItems: [
      { label: "Wash the green beans", sub: "Start fresh" },
      { label: "Roast over coals", sub: "Share the aroma" },
      { label: "Grind in the mukecha", sub: "By hand" },
      { label: "Boil in the jebena", sub: "Patience" },
      { label: "Serve Abol, Tona, Baraka", sub: "Three rounds" },
    ],
  },
  {
    id: "who-am-i", title: "Who Am I?", am: "ማን ነኝ?", glyph: "ማ", kind: "choice", time: 60, xp: 70,
    blurb: "Guess the legend from their story.",
    rounds: [
      { prompt: "I won Olympic gold running barefoot in Rome.", options: ["Haile Gebrselassie", "Abebe Bikila", "Derartu Tulu", "Kenenisa Bekele"], answer: 1 },
      { prompt: "I founded Addis Ababa and fought at Adwa.", options: ["Empress Zewditu", "Queen Makeda", "Empress Taytu", "Queen Gudit"], answer: 2 },
      { prompt: "I'm a 3.2-million-year-old ancestor.", options: ["Ardi", "Selam", "Lucy", "Turkana Boy"], answer: 2 },
      { prompt: "I placed the cross on Aksum's coins.", options: ["King Ezana", "King Kaleb", "Lalibela", "Fasilides"], answer: 0 },
    ],
  },
  {
    id: "map-the-journey", title: "Map the Journey", am: "ጉዞውን ካርታ", glyph: "ካ", kind: "choice", time: 60, xp: 60,
    blurb: "Where in Ethiopia is it?",
    rounds: [
      { prompt: "Which region holds Aksum?", options: ["Tigray", "Oromia", "Sidama", "Somali"], answer: 0 },
      { prompt: "The Blue Nile flows out of which lake?", options: ["Lake Abaya", "Lake Tana", "Lake Ziway", "Lake Langano"], answer: 1 },
      { prompt: "The Danakil Depression lies in which region?", options: ["Amhara", "Afar", "Gambela", "Harari"], answer: 1 },
      { prompt: "Wild coffee forests grow in…", options: ["Kaffa", "Gondar", "Mekelle", "Dire Dawa"], answer: 0 },
    ],
  },
  {
    id: "architecture-puzzle", title: "Architecture Puzzle", am: "የሥነ-ሕንፃ እንቆቅልሽ", glyph: "ሕ", kind: "choice", time: 60, xp: 60,
    blurb: "Stone, timber and genius.",
    rounds: [
      { prompt: "Lalibela's churches were carved into…", options: ["Marble", "Volcanic tuff", "Granite", "Sandstone bricks"], answer: 1 },
      { prompt: "Aksum's stelae imitate multi-storey…", options: ["Palaces", "Ships", "Trees", "Pyramids"], answer: 0 },
      { prompt: "Gondar's castles blend Aksumite with which influence?", options: ["Portuguese & Indian", "Chinese", "Aztec", "Norse"], answer: 0 },
    ],
  },
];

export const miniGameById = (id: string) => miniGames.find((g) => g.id === id);

/* ---------- Achievements ---------- */
export const achievements = [
  { id: "first-discovery", title: "First Discovery", am: "የመጀመሪያ ግኝት", desc: "Add your first entry to the መዝገብ." },
  { id: "time-traveler", title: "Time Traveler", am: "የጊዜ ተጓዥ", desc: "Complete a Time Journey episode." },
  { id: "map-reader", title: "Map Reader", am: "ካርታ አንባቢ", desc: "Open a location in Google Maps." },
  { id: "story-keeper", title: "Story Keeper", am: "ታሪክ ጠባቂ", desc: "Discover 10 entries." },
  { id: "curious-mind", title: "Curious Mind", am: "ጠያቂ አእምሮ", desc: "Answer Today's Challenge correctly." },
  { id: "voice-explorer", title: "Voice Explorer", am: "የድምፅ አሳሽ", desc: "Ask UTOPIA a question." },
  { id: "roots-routes", title: "Roots & Routes", am: "ሥርና መንገድ", desc: "Discover 5 places on your Journey." },
  { id: "game-master", title: "Game Master", am: "የጨዋታ ጌታ", desc: "Finish 3 different mini-games." },
] as const;
export type AchievementId = (typeof achievements)[number]["id"];

/* Journey route — order of the golden path */
export const journeyPath = [
  { id: "aksum", x: 52, y: 14 },
  { id: "adwa", x: 60, y: 10 },
  { id: "lalibela", x: 56, y: 32 },
  { id: "gondar", x: 36, y: 26 },
  { id: "simien", x: 44, y: 18 },
  { id: "lake-tana", x: 33, y: 38 },
  { id: "danakil", x: 74, y: 22 },
  { id: "harar", x: 80, y: 52 },
  { id: "coffee", x: 30, y: 66 },
  { id: "simien-wolf", x: 54, y: 72 },
];
