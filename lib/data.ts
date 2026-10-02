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
}

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
  { label: 'Our Story', href: '/story' },
  { label: 'Details & Dress Code', href: '/details' },
  { label: 'Gifts', href: '/gifts' },
  { label: 'RSVP & Tickets', href: '/rsvp' },
  { label: 'FAQ', href: '/#faq' },
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
    hex: '#88C4A6',
    rgb: 'rgb(136, 196, 166)',
    hsl: 'hsl(150, 36%, 65%)',
    pantone: 'Pantone 565 C',
    textColor: '#191919',
    tag: 'Fresh & Luminous',
    description: 'A fresh botanical pastel bringing subtle vitality, floral balance, and modern radiance.',
    symbolism: 'Growth, serenity, freshness, and new beginnings',
    fabrics: ['Crisp Linen', 'Lightweight Crepe', 'Damask', 'Lustrous Brocade', 'Organza'],
    mensStyling: 'Bespoke pastel caftans, mint ties/accessories, tailored linen two-piece suits',
    womensStyling: 'Pleated midi gowns, beaded lace dresses, modern traditional wraps, jade or gold accents',
    styling: 'Modern traditional attire, linen suits, summer gowns, statement jewelry',
    pairWith: ['Olive Green', 'Classic Ivory', 'Burnished Gold', 'Soft Blush'],
    gradient: 'linear-gradient(135deg, #A8DEC1 0%, #88C4A6 55%, #67A887 100%)',
    accentColor: '#5B6B38',
  },
  {
    id: 'olive-green',
    name: 'Olive Green',
    subtitle: 'Earthy Botanical Luxe',
    hex: '#5B6B38',
    rgb: 'rgb(91, 107, 56)',
    hsl: 'hsl(79, 31%, 32%)',
    pantone: 'Pantone 5753 C',
    textColor: '#ffffff',
    tag: 'Earthy & Chic',
    description: 'An earthy, distinguished olive green grounding our palette in organic luxury and poise.',
    symbolism: 'Harmony, peace, endurance, and organic prosperity',
    fabrics: ['Rich Brocade', 'Italian Wool', 'Structured Jacquard', 'Aso-Oke', 'Shantung Silk'],
    mensStyling: 'Deep olive three-piece suits, tailored senator wear, embroidered agbada with gold accents',
    womensStyling: 'Structured jacquard gowns, sleek column dresses, emerald & antique gold accessories',
    styling: 'Tailored suits, rich brocade, structured dresses, emerald & olive accents',
    pairWith: ['Mint Green', 'Antique Gold', 'Black Velvet', 'Warm Ivory'],
    gradient: 'linear-gradient(135deg, #6E8045 0%, #5B6B38 55%, #44512A 100%)',
    accentColor: '#D4AF37',
  },
]

export const registryGifts: GiftItem[] = [
  {
    id: 'lg-air-conditioner',
    title: 'LG Dual Inverter Air Conditioner',
    price: '₦650,000',
    numericPrice: 650000,
    category: 'appliances',
    categoryLabel: 'Home & Living',
    image: '/gifts/lg-air-conditioner.jpeg',
    description: 'Energy-efficient dual inverter air conditioner for our new home.',
    featured: true,
  },
  {
    id: 'washing-machine',
    title: 'Front-Load Smart Washing Machine',
    price: '₦580,000',
    numericPrice: 580000,
    category: 'appliances',
    categoryLabel: 'Home Appliances',
    image: '/gifts/washing-machine.jpeg',
    description: 'Automatic front-loading washing machine with steam care and eco wash.',
    featured: true,
  },
  {
    id: 'porcelain-dinnerware',
    title: 'Luxury Porcelain Dinnerware Set',
    price: '₦125,000',
    numericPrice: 125000,
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
    category: 'appliances',
    categoryLabel: 'Home Care',
    image: '/gifts/philips-steam-iron.jpeg',
    description: 'Continuous steam generator garment care iron with OptimalTEMP.',
  },
]

export const galleryPhotos = [
  { src: 'https://framerusercontent.com/images/MLAikOcemvt4b3jOH9t7pHiJOo.webp?width=1536&height=2304', alt: 'A black and white woodland portrait', caption: 'Quiet moments under the canopy' },
  { src: 'https://framerusercontent.com/images/bJihjKJXX6yWxcwchCEMFK8uhm0.webp?width=1536&height=2304', alt: 'Walking together through the woods', caption: 'Walking hand-in-hand towards forever' },
  { src: 'https://framerusercontent.com/images/PbQoMLyEr7yPMUmQyMU3EHldO0.webp?width=1536&height=2304', alt: 'A quiet woodland portrait', caption: 'Soft light & endless laughter' },
  { src: 'https://framerusercontent.com/images/wV7DAlVFa8z99FonQGPyi5poBrg.webp?width=2000&height=1333', alt: 'Sharing a playful moment in the woods', caption: 'Playful smiles, cherished memories' },
]

export const weddingSchedule: ScheduleEvent[] = [
  {
    time: '01:30 PM',
    title: 'Guest Arrival & Prelude',
    location: 'Christ Embassy Ogba 1 Auditorium, Lagos',
    description: 'Guests arrive, check in with their digital wedding pass, and are seated as orchestral melodies welcome everyone.',
    icon: '🎻',
  },
  {
    time: '02:00 PM',
    title: 'Holy Matrimony & Vows',
    location: 'Main Sanctuary',
    description: 'Procession of the bridal party, the solemn exchange of marital vows, prayer of blessing, and signing of the marriage register.',
    icon: '💍',
  },
  {
    time: '03:45 PM',
    title: 'Photo Session & Cocktail Hour',
    location: 'Courtyard & Banquet Foyer',
    description: 'Cocktails, artisanal finger foods, and celebratory photos with the newlyweds, family, and distinguished guests.',
    icon: '🥂',
  },
  {
    time: '05:00 PM',
    title: 'Grand Reception & Feast',
    location: 'Grand Ballroom',
    description: 'Grand entrance of the couple, cutting of the wedding cake, royal banquet dinner, heartwarming toasts, and first dance.',
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
    answer: 'Simply visit the RSVP & Tickets page, complete the brief registration with your contact info and photo, and your digital wedding pass will generate instantly for easy download and entrance verification.',
  },
  {
    question: 'Where will the wedding take place?',
    answer: 'The wedding ceremony and celebration will be held at Christ Embassy Ogba 1, Lagos, Nigeria on Saturday, October 31, 2026 starting at 2:00 PM.',
  },
  {
    question: 'How do the wedding gifts and cash blessings work?',
    answer: 'You can explore our curated gift registry on the Gifts page to reserve specific items, or transfer cash blessings directly to our designated wedding account with instant copy-to-clipboard details.',
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
