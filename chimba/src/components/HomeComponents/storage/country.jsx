import { imageRetrieve } from "./imageRetrive"
import Colombia from '/src/assets/flags/colombia.png';
import Peru from '/src/assets/flags/peru.png';
import Mexico from '/src/assets/flags/mexico.png';
import Spain from '/src/assets/flags/spain.png';
import Argentina from '/src/assets/flags/argentina.png';
import Venezuela from '/src/assets/flags/venezuela.png';
import Ecuador from '/src/assets/flags/ecuador.png';
import DominicanRepublic from '/src/assets/flags/dominican-republic.png';
import PuertoRico from '/src/assets/flags/puerto-rico.png';


export const countryInfo = [
    {
        id: 1,
        country: 'Colombia',
        subtitle: 'Rhythm, Coffee, and Paisa Charm',
        description: 'From the colorful streets of Cartagena to \nthe lush coffee valleys of Salento, Colombia\n is a country that pulses with life. Dance to \nthe rhythm of cumbia and reggaetón, and \nimmerse yourself in a culture known for its \nwarmth and passion.',
        motive: 'Speak Like a Parce, No Joda!',
        buttonText: 'Enroll for free!',
        images: imageRetrieve('co'),
        image: Colombia,
        margin: 87,
        infoSide: '',
        bgPhoto: '#FFC7D3',
        bgText: '#FFDDDE'
    },
    {
        id: 2,
        country: 'Perú',
        subtitle: 'Ancient Wonders and\n Culinary Magic',
        description: 'From the mystical ruins of Machu Picchu \nto the bustling food markets of Lima, Perú\n is a land of ancient history and world-class\n cuisine. Discover its Incan heritage,\n breathtaking landscapes, and legendary\n gastronomy.',
        motive: 'Speak Like a Peruano, Causa! \n Learn Peruvian Spanish today!',
        buttonText: 'Get started',
        images: imageRetrieve('pe'),
        image: Peru,
        margin: 87,
        infoSide: 'left',
        bgPhoto: '#FFE9EE',
        bgText: '#FFF0F0'
    },
    {
        id: 3,
        country: 'Argentina',
        subtitle: 'Tango, Passion, and Mate',
        description: 'From the bohemian streets of Buenos Aires to\n the jaw-dropping peaks of Patagonia,\n Argentina is a country of rhythm, soul, and \nadventure. Sip on mate, dance tango, and dive\n into fútbol culture like a true Porteño.',
        motive: 'Learn Argentinian Spanish and lunfardo slang with\n AI-powered lessons. Enroll for free and start\n sounding like a native today!',
        buttonText: 'Enroll',
        images: imageRetrieve('ar'),
        image: Argentina,
        margin: 108,
        infoSide: 'left',
        bgPhoto: '#FFDEE5',
        bgText: '#FFFEFE'
    },
    {
        id: 4,
        country: 'Spain',
        subtitle: 'History, Flamenco, and Fiesta',
        description: 'From the majestic Alhambra to the sun-\nsoaked beaches of Ibiza, Spain is a land\n of deep history, rich culture, and\n unforgettable nights. Experience\n flamenco, tapas, and vibrant local fiestas\n in every corner.',
        motive: 'Talk Like a Madrileño or Andaluz!',
        buttonText: 'Begin learning!',
        images: imageRetrieve('es'),
        image: Spain,
        margin: 94,
        infoSide: 0,
        bgPhoto: '#FFA8BB',
        bgText: '#FFEFEF'
    },
    {
        id: 5,
        country: 'Venezuela',
        subtitle: 'Caribbean Sun and Soul',
        description: 'From the Caribbean beaches of Los\n Roques to the towering Angel Falls,\n Venezuela is a country of rich landscapes,\n lively culture, and passionate people. Feel\n the energy of gaitas, salsa, and arepas on\n every street corner.',
        motive: 'Speak Venezolano, Vale!',
        buttonText: 'Start',
        images: imageRetrieve('ve'),
        image: Venezuela,
        margin: 106,
        infoSide: 'left',
        bgPhoto: '#E4BCC5',
        bgText: '#FFDDDD'
    },
    {
        id: 6,
        country: 'Puerto Rico',
        subtitle: 'Island Vibes and Reggaetón',
        description: 'From the cobblestone streets of Old San\n Juan to the pristine beaches of Culebra,\n Puerto Rico is a paradise of music, flavor,\n and natural beauty. Feel the energy of\n reggaetón, salsa, and the island’s rich\n culture wherever you go.',
        motive: 'Speak Boricua, Dale Pa’lante!',
        buttonText: 'Sign me up!',
        images: imageRetrieve('pr'),
        image: PuertoRico,
        margin: 95,
        infoSide: 'left',
        bgPhoto: '#FFEFF3',
        bgText: '#FFBFBF'
    },
    {
        id: 7,
        country: 'México',
        subtitle: 'Culture, Flavor, and Fiesta',
        description: "From the bustling streets of CDMX to the\n crystal-clear cenotes of the Yucatán, Mexico is\n a land of ancient history, vibrant traditions, and\n mouthwatering cuisine. Whether you're\n exploring Mayan ruins, mariachi-filled plazas, or\n Día de los Muertos celebrations, Mexico is a\n place where every moment feels alive.",
        motive: 'Speak Like a Chilango or a Tapatío—For Free!',
        buttonText: 'Join now',
        images: imageRetrieve('me'),
        image: Mexico,
        margin: 96,
        infoSide: 0,
        bgPhoto: '#FFF8F9',
        bgText: '#FFEAEA'
    },
    {
        id: 8,
        country: 'Ecuador',
        subtitle: 'Andes, Amazon, and Coastal Charm',
        description: "Ecuador is where the Amazon, the Andes, and the\n Pacific collide. Walk through Quito’s colonial streets,\n explore the Galápagos, or sip on canelazo in the\n highlands—every corner of Ecuador is packed with\n beauty and culture.",
        motive: 'Speak Like an Ecuatoriano, De Una!',
        buttonText: 'Start learning',
        images: imageRetrieve('ec'),
        image: Ecuador,
        margin: 109,
        infoSide: 'left',
        bgPhoto: '#FF93AA',
        bgText: '#FFC2C2'
    },
    {
        id: 9,
        country: 'Dominican Republic',
        subtitle: 'Merengue, Beaches, and Cultura',
        description: "With its turquoise waters, lively merengue, and\n vibrant street life, the Dominican Republic is a\n place of energy, warmth, and Afro-Caribbean\n soul. Whether you're in Santo Domingo or Punta\n Cana, the island’s rhythm is unmistakable.",
        motive: 'Speak Like a Dominicano, No Bulto!',
        buttonText: 'Get started',
        images: imageRetrieve('dr'),
        image: DominicanRepublic,
        margin: 106,
        infoSide: 'left',
        bgPhoto: '#FFF8F9',
        bgText: '#EBD1D1'
    }
]