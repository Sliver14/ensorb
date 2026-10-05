export interface GiftItem {
  id: string
  title: string
  price: string
  numericPrice: number
  category: 'kitchen' | 'appliances' | 'tableware'
  categoryLabel: string
  image: string
  description: string
  featured?: boolean
  contributedAmount: number
  contributorCount: number
  isFullyGifted?: boolean
}

export type WishlistItem = GiftItem

export interface DressColor {
  id: string
  name: string
  subtitle: string
  hex: string
  rgb: string
  hsl: string
  pantone: string
  textColor: string
  tag: string
  description: string
  symbolism: string
  fabrics: string[]
  mensStyling: string
  womensStyling: string
  styling: string
  pairWith: string[]
  gradient: string
  accentColor: string
}

export interface ScheduleEvent {
  time: string
  title: string
  location: string
  description: string
  icon: string
}

export interface FAQItem {
  question: string
  answer: string
}

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'RSVP', href: '/rsvp' },
]

export const dressColors: DressColor[] = [
  {
    id: 'burgundy',
    name: 'Burgundy',
    subtitle: 'Deep Velvet Wine',
    hex: '#6B1D2F',
    rgb: 'rgb(107, 29, 47)',
    hsl: 'hsl(346, 57%, 27%)',
    pantone: 'Pantone 7428 C',
    textColor: '#ffffff',
    tag: 'Rich & Regal',
    description: 'A deep velvet wine shade radiating warmth, timeless celebration, and regal sophistication.',
    symbolism: 'Devotion, royalty, strength, and lasting passion',
    fabrics: ['Silk Velvet', 'Mikado Silk', 'Heavy Duchess Satin', 'Aso-Oke', 'Wool Crepe'],
    mensStyling: 'Velvet dinner jackets, bespoke agbada, satin lapel tuxedos, pocket squares & bowties',
    womensStyling: 'Corseted evening gowns, tiered lace dresses, rich gele headwraps & statement clutch',
    styling: 'Velvet blazers, agbada, satin evening gowns, pocket squares & ties',
    pairWith: ['Champagne Gold', 'Warm Ivory', 'Black Onyx', 'Rose Gold'],
    gradient: 'linear-gradient(135deg, #7A1F36 0%, #6B1D2F 55%, #4A121F 100%)',
    accentColor: '#D4AF37',
  },
  {
    id: 'blush',
    name: 'Blush',
    subtitle: 'Soft Rose Petal',
    hex: '#E8A598',
    rgb: 'rgb(232, 165, 152)',
    hsl: 'hsl(10, 62%, 75%)',
    pantone: 'Pantone 706 C',
    textColor: '#191919',
    tag: 'Soft & Romantic',
    description: 'A gentle pastel rose tone embodying tenderness, delicate grace, and romantic charm.',
    symbolism: 'Grace, tenderness, joy, and gentle romance',
    fabrics: ['Flowing Chiffon', 'French Tulle', 'Embroidered Cord Lace', 'Organza', 'Raw Silk'],
    mensStyling: 'Blush linen shirts, pastel ties & pocket silks, lightweight blazer accents',
    womensStyling: 'Chiffon tiered gowns, delicate lace midi dresses, floral appliqués, pearl jewelry',
    styling: 'Flowing chiffon dresses, pastel lace, silk shirts, delicate floral accessories',
    pairWith: ['Warm Burgundy', 'Rose Gold', 'Pearl White', 'Champagne'],
    gradient: 'linear-gradient(135deg, #F5D0C5 0%, #E8A598 55%, #D48B7E 100%)',
    accentColor: '#6B1D2F',
  },
  {
    id: 'mint-green',
    name: 'Mint Green',
    subtitle: 'Luminous Botanical',
    hex: '#A8D5BA',
    rgb: 'rgb(168, 213, 186)',
    hsl: 'hsl(144, 38%, 75%)',
    pantone: 'Pantone 565 C',
    textColor: '#191919',
    tag: 'Fresh & Serene',
    description: 'A soothing pastel botanical hue capturing vitality, fresh beginnings, and refined harmony.',
    symbolism: 'Renewal, prosperity, calm, and harmonious growth',
    fabrics: ['Shimmering Tissue Silk', 'Crepe de Chine', 'Embossed Brocade', 'Chantilly Lace', 'Linen'],
    mensStyling: 'Mint tailored waistcoats, pastel accessories, lightweight cream/mint linen jackets',
    womensStyling: 'Draped silk gowns, pleated mint maxi dresses, botanical lace ensembles',
    styling: 'Silk blouses, linen jackets, delicate lace, botanical accents',
    pairWith: ['Olive Green', 'Warm Gold', 'Soft Ivory', 'Blush'],
    gradient: 'linear-gradient(135deg, #C2E7D0 0%, #A8D5BA 55%, #88BD9C 100%)',
    accentColor: '#5B6B38',
  },
  {
    id: 'olive-green',
    name: 'Olive Green',
    subtitle: 'Earthy Majesty',
    hex: '#5B6B38',
    rgb: 'rgb(91, 107, 56)',
    hsl: 'hsl(80, 31%, 32%)',
    pantone: 'Pantone 7763 C',
    textColor: '#ffffff',
    tag: 'Earthy & Majestic',
    description: 'An earthy olive tone bringing natural majesty, grounded luxury, and dignified heritage.',
    symbolism: 'Peace, endurance, abundance, and grounded elegance',
    fabrics: ['Damask', 'Lustrous Jacquard', 'Italian Wool', 'Velvet Trim', 'Heavy Duchess Satin'],
    mensStyling: 'Deep olive three-piece suits, tailored senator wear, embroidered agbada with gold accents',
    womensStyling: 'Structured jacquard gowns, sleek column dresses, emerald & antique gold accessories',
    styling: 'Tailored suits, rich brocade, structured dresses, emerald & olive accents',
    pairWith: ['Mint Green', 'Antique Gold', 'Black Velvet', 'Warm Ivory'],
    gradient: 'linear-gradient(135deg, #6E8045 0%, #5B6B38 55%, #44512A 100%)',
    accentColor: '#D4AF37',
  },
]

export const registryGifts: WishlistItem[] = [
  {
    id: 'honeymoon-fund',
    title: 'Honeymoon Fund',
    price: '₦500,000',
    numericPrice: 500000,
    contributedAmount: 300000,
    contributorCount: 6,
    isFullyGifted: false,
    category: 'appliances',
    categoryLabel: 'Experiences & Honeymoon',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80',
    description: 'Help us create unforgettable memories on our honeymoon.',
    featured: true,
  },
  {
    id: 'lg-air-conditioner',
    title: 'LG Dual Inverter Air Conditioner',
    price: '₦650,000',
    numericPrice: 650000,
    contributedAmount: 650000,
    contributorCount: 3,
    isFullyGifted: true,
    category: 'appliances',
    categoryLabel: 'Home & Living',
    image: '/gifts/lg-air-conditioner.jpeg',
    description: 'Energy-efficient dual inverter air conditioner for our new home.',
  },
  {
    id: 'washing-machine',
    title: 'Front-Load Smart Washing Machine',
    price: '₦580,000',
    numericPrice: 580000,
    contributedAmount: 435000,
    contributorCount: 4,
    isFullyGifted: false,
    category: 'appliances',
    categoryLabel: 'Home Appliances',
    image: '/gifts/washing-machine.jpeg',
    description: 'Automatic front-loading washing machine with steam care and eco wash.',
  },
  {
    id: 'porcelain-dinnerware',
    title: 'Luxury Porcelain Dinnerware Set',
    price: '₦125,000',
    numericPrice: 125000,
    contributedAmount: 125000,
    contributorCount: 2,
    isFullyGifted: true,
    category: 'tableware',
    categoryLabel: 'Dining & Tableware',
    image: '/gifts/porcelain-dinnerware.jpeg',
    description: '32-piece fine porcelain luxury dinner set with gold trim.',
  },
  {
    id: 'cookware-pot-set',
    title: 'Granite Non-Stick Cookware Set',
    price: '₦95,000',
    numericPrice: 95000,
    contributedAmount: 95000,
    contributorCount: 1,
    isFullyGifted: true,
    category: 'kitchen',
    categoryLabel: 'Kitchen Essentials',
    image: '/gifts/cookware-pot-set.jpeg',
    description: 'Premium multi-layer granite non-stick pot and pan collection.',
  },
  {
    id: 'gold-cutlery-set',
    title: '24-Piece Gold Cutlery Set',
    price: '₦45,000',
    numericPrice: 45000,
    contributedAmount: 45000,
    contributorCount: 1,
    isFullyGifted: true,
    category: 'tableware',
    categoryLabel: 'Dining & Tableware',
    image: '/gifts/gold-cutlery-set.jpeg',
    description: 'Mirror-polished luxury stainless steel gold dining silverware set.',
  },
  {
    id: 'food-processor-yam-pounder',
    title: 'Food Processor & Yam Pounder',
    price: '₦85,000',
    numericPrice: 85000,
    contributedAmount: 45000,
    contributorCount: 2,
    isFullyGifted: false,
    category: 'kitchen',
    categoryLabel: 'Kitchen Appliances',
    image: '/gifts/food-processor-yam-pounder.jpeg',
    description: 'Heavy-duty electric processor with traditional yam pounder attachments.',
  },
  {
    id: 'hisense-airfryer',
    title: 'Hisense Digital Touch Air Fryer',
    price: '₦75,000',
    numericPrice: 75000,
    contributedAmount: 25000,
    contributorCount: 1,
    isFullyGifted: false,
    category: 'kitchen',
    categoryLabel: 'Kitchen Appliances',
    image: '/gifts/hisense-airfryer.jpeg',
    description: 'Large capacity digital air fryer for healthy and delicious meals.',
  },
  {
    id: 'commercial-blender',
    title: 'Commercial Heavy-Duty Blender',
    price: '₦65,000',
    numericPrice: 65000,
    contributedAmount: 30000,
    contributorCount: 1,
    isFullyGifted: false,
    category: 'kitchen',
    categoryLabel: 'Kitchen Appliances',
    image: '/gifts/commercial-blender.jpeg',
    description: 'High-power professional blender with multi-blade crushing system.',
  },
  {
    id: 'cold-press-juicer',
    title: 'Cold Press Masticating Juicer',
    price: '₦55,000',
    numericPrice: 55000,
    contributedAmount: 0,
    contributorCount: 0,
    isFullyGifted: false,
    category: 'kitchen',
    categoryLabel: 'Kitchen Appliances',
    image: '/gifts/cold-press-juicer.jpeg',
    description: 'Slow masticating nutrient-preserving fruit and vegetable extractor.',
  },
  {
    id: 'philips-steam-iron',
    title: 'Philips PerfectCare Steam Iron',
    price: '₦48,000',
    numericPrice: 48000,
    contributedAmount: 24000,
    contributorCount: 1,
    isFullyGifted: false,
    category: 'appliances',
    categoryLabel: 'Home Care',
    image: '/gifts/philips-steam-iron.jpeg',
    description: 'Continuous steam generator garment care iron with OptimalTEMP.',
  },
]

export const wishlistItems = registryGifts

export const galleryPhotos = [
  { src: '/couple/hero-portrait.png', alt: 'Ngozi & Sorbari intimate portrait', caption: 'Quiet moments of pure love & devotion' },
  { src: '/couple/story-polaroid.png', alt: 'Ngozi & Sorbari joyful smiles', caption: 'Laughter, friendship, and shared joy' },
  { src: '/couple/quote-portrait.jpg', alt: 'Sorbari holding Ngozi lovingly', caption: 'Walking hand-in-hand towards forever' },
  { src: '/couple/hero-portrait.png', alt: 'Ngozi & Sorbari elegant studio portrait', caption: 'Stepping into forever together' },
]

export const weddingSchedule: ScheduleEvent[] = [
  {
    time: '01:30 PM',
    title: 'Guest Arrival & Prelude',
    location: 'Main Sanctuary & Reception Foyer',
    description: 'Welcome music, ushering of guests to designated seats, and gathering for the sacred celebration.',
    icon: '🎻',
  },
  {
    time: '02:00 PM',
    title: 'Holy Matrimony & Vows',
    location: 'Main Sanctuary Floor',
    description: 'Procession of the bridal train, worship, exchange of holy matrimonial vows, and pastoral blessings.',
    icon: '💍',
  },
  {
    time: '03:30 PM',
    title: 'Photographs & Cocktail Hour',
    location: 'Church Courtyard & Grand Lawn',
    description: 'Formal family portraits, celebratory drinks, hors d’oeuvres, and warm congratulations with the couple.',
    icon: '🥂',
  },
  {
    time: '05:00 PM',
    title: 'Grand Reception & Feast',
    location: 'Emerald Celebration Hall',
    description: 'Grand entrance of the newlyweds, culinary banquet, toast, cake cutting, and couple’s first dance.',
    icon: '✨',
  },
  {
    time: '08:00 PM',
    title: 'Celebration & After Party',
    location: 'Grand Ballroom Floor',
    description: 'High-energy music, joyous dancing, dessert buffet, and celebrating the night away with Ngozi & Sorbari!',
    icon: '💃',
  },
]

export const faqData: FAQItem[] = [
  {
    question: 'What should I wear?',
    answer: 'Our official wedding color palette includes Burgundy, Blush, Mint Green, and Olive Green. We warmly invite you to dress in formal, traditional, or chic garden elegance incorporating any of these palette tones!',
  },
  {
    question: 'How do I RSVP and get my ticket pass?',
    answer: 'Simply visit the RSVP & Passes page, enter your personalized invitation code, and your digital wedding pass with QR verification will generate instantly for easy download and entrance verification.',
  },
  {
    question: 'Where will the wedding take place?',
    answer: 'The wedding ceremony and celebration will be held at Christ Embassy Ogba 1, Lagos, Nigeria on Saturday, October 31, 2026 starting at 2:00 PM.',
  },
  {
    question: 'How does the wedding wishlist and cash contributions work?',
    answer: 'You can explore our curated home wishlist on the Wishlist page to gift an entire item or contribute any amount of your choice towards items in progress. You may also transfer general cash blessings directly to our designated wedding account.',
  },
  {
    question: 'Can I bring a plus one?',
    answer: 'Your invitation and RSVP pass will reflect the number of reserved seats. If you have any special inquiries about extra guests, please feel free to reach out to us directly.',
  },
  {
    question: 'Are children invited?',
    answer: 'While we love little ones dearly, the ceremony and grand reception will be an adults-only celebration.',
  },
]

export const bankDetails = {
  bankName: 'Parallex Bank',
  accountName: 'SORBARI GODWIN UEBARI AND NGOZI EMELE KALU',
  accountNumber: '2003361527',
}
