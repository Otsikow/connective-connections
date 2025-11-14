import { generateAvatarUrl } from "./avatar";

const avatar = (seed: string) => generateAvatarUrl(`community-${seed}`);

export type CommunityParticipant = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type CommunityGroup = {
  id: string;
  name: string;
  category: string;
  description: string;
  members: number;
  image: string;
  meetingTime: string;
  host: CommunityParticipant;
  participants: CommunityParticipant[];
  chatWelcome: string;
  chatSampleConversation: Array<{
    sender: string;
    content: string;
    time: string;
    isMine: boolean;
  }>;
  chatQuickReplies: string[];
  chatSuggestions: string[];
};

export const communityGroups: CommunityGroup[] = [
  {
    id: "grp-001",
    name: "Downtown Book Club",
    category: "Book Club",
    description:
      "Monthly discussions on contemporary fiction. Currently reading 'The Midnight Library'. Join us for coffee and conversation!",
    members: 124,
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
    meetingTime: "Every 2nd Saturday, 3:00 PM",
    host: { id: "cg-h1", name: "Jess", avatarUrl: avatar("Jess host") },
    participants: [
      { id: "cg-p1", name: "Aria", avatarUrl: avatar("Aria reader") },
      { id: "cg-p2", name: "Noah", avatarUrl: avatar("Noah reader") },
      { id: "cg-p3", name: "Maya", avatarUrl: avatar("Maya reader") },
      { id: "cg-p4", name: "Eli", avatarUrl: avatar("Eli reader") },
    ],
    chatWelcome: "Welcome everyone! Can't wait to hear your thoughts on this month's book.",
    chatSampleConversation: [
      {
        sender: "Jess",
        content: "Welcome everyone! Can't wait to hear your thoughts on 'The Midnight Library'.",
        time: "8:55 AM",
        isMine: false,
      },
      {
        sender: "You",
        content: "Same here! The ending really stuck with me.",
        time: "8:57 AM",
        isMine: true,
      },
      {
        sender: "Aria",
        content: "Agreed! Let's kick off with favorite quotes?",
        time: "8:59 AM",
        isMine: false,
      },
    ],
    chatQuickReplies: [
      "What themes stood out to you?",
      "Favorite character and why?",
      "Should we plan a meetup?",
    ],
    chatSuggestions: [
      "Ask if anyone finished the bonus chapter",
      "Share your biggest takeaway from the book",
      "Suggest a cozy cafe for the next in-person meetup",
    ],
  },
  {
    id: "grp-002",
    name: "Summit Seekers Hiking",
    category: "Hiking Team",
    description:
      "Weekend warriors exploring local trails. All fitness levels welcome. We provide carpools and gear advice for beginners.",
    members: 89,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    meetingTime: "Sundays, 7:00 AM",
    host: { id: "cg-h2", name: "Leo", avatarUrl: avatar("Leo summit host") },
    participants: [
      { id: "cg-p5", name: "Mika", avatarUrl: avatar("Mika hiker") },
      { id: "cg-p6", name: "Harper", avatarUrl: avatar("Harper hiker") },
      { id: "cg-p7", name: "Cam", avatarUrl: avatar("Cam hiker") },
      { id: "cg-p8", name: "Rowan", avatarUrl: avatar("Rowan hiker") },
    ],
    chatWelcome: "Welcome to the Summit Seekers trail chat!",
    chatSampleConversation: [
      {
        sender: "Leo",
        content: "Welcome to the Summit Seekers chat! This Sunday we're tackling the Pinecrest Loop.",
        time: "6:15 AM",
        isMine: false,
      },
      {
        sender: "You",
        content: "Sounds great! Is the trail dog-friendly?",
        time: "6:17 AM",
        isMine: true,
      },
      {
        sender: "Mika",
        content: "Yep! Plenty of shade and water stops. Bring booties if it's been rainy.",
        time: "6:19 AM",
        isMine: false,
      },
    ],
    chatQuickReplies: [
      "Where should we meet?",
      "Need a carpool buddy",
      "What gear do I need?",
    ],
    chatSuggestions: [
      "Coordinate rides for the upcoming hike",
      "Share your favorite trail snack recommendations",
      "Ask about the elevation gain for new members",
    ],
  },
  {
    id: "grp-003",
    name: "Spanish Language Exchange",
    category: "Language Swap",
    description:
      "Practice español in a friendly environment. Native speakers and learners meet for conversational practice over tapas.",
    members: 156,
    image:
      "https://images.unsplash.com/photo-1522199995045-76c3c3d77c32?auto=format&fit=crop&w=900&q=80",
    meetingTime: "Wednesdays, 6:30 PM",
    host: { id: "cg-h3", name: "Lucia", avatarUrl: avatar("Lucia spanish host") },
    participants: [
      { id: "cg-p9", name: "Diego", avatarUrl: avatar("Diego spanish") },
      { id: "cg-p10", name: "Sofia", avatarUrl: avatar("Sofia spanish") },
      { id: "cg-p11", name: "Mateo", avatarUrl: avatar("Mateo spanish") },
      { id: "cg-p12", name: "Isla", avatarUrl: avatar("Isla spanish") },
    ],
    chatWelcome: "¡Bienvenidos! Let's get the conversation started.",
    chatSampleConversation: [
      {
        sender: "Lucia",
        content: "¡Bienvenidos! This week we'll practice travel phrases. Any topics you'd like to cover?",
        time: "6:20 PM",
        isMine: false,
      },
      {
        sender: "You",
        content: "I'd love to practice ordering at a restaurant.",
        time: "6:22 PM",
        isMine: true,
      },
      {
        sender: "Diego",
        content: "¡Perfecto! Podemos hacer un role play de camarero y cliente.",
        time: "6:23 PM",
        isMine: false,
      },
    ],
    chatQuickReplies: [
      "¿Qué nivel eres?",
      "Busco compañero de práctica",
      "¿Algún recurso recomendado?",
    ],
    chatSuggestions: [
      "Preguntar si hay encuentros informales esta semana",
      "Compartir tu meta de aprendizaje para el mes",
      "Pedir recomendaciones de series o podcasts en español",
    ],
  },
  {
    id: "grp-004",
    name: "French Conversation Circle",
    category: "Language Swap",
    description:
      "Bonjour! Improve your French through casual conversation. All levels welcome, from beginners to advanced speakers.",
    members: 92,
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    meetingTime: "Thursdays, 7:00 PM",
    host: { id: "cg-h4", name: "Camille", avatarUrl: avatar("Camille french host") },
    participants: [
      { id: "cg-p13", name: "Louis", avatarUrl: avatar("Louis french") },
      { id: "cg-p14", name: "Amélie", avatarUrl: avatar("Amelie french") },
      { id: "cg-p15", name: "Henri", avatarUrl: avatar("Henri french") },
      { id: "cg-p16", name: "Zoé", avatarUrl: avatar("Zoe french") },
    ],
    chatWelcome: "Bienvenue à tous! Prêts pour notre session de ce soir?",
    chatSampleConversation: [
      {
        sender: "Camille",
        content: "Bonsoir tout le monde! Ce soir on pratique les conversations de voyage.",
        time: "6:55 PM",
        isMine: false,
      },
      {
        sender: "You",
        content: "Génial! Je veux apprendre comment demander des directions.",
        time: "6:57 PM",
        isMine: true,
      },
      {
        sender: "Amélie",
        content: "Parfait, on peut jouer une scène à la gare.",
        time: "6:59 PM",
        isMine: false,
      },
    ],
    chatQuickReplies: [
      "Je cherche un partenaire de conversation",
      "Conseils pour améliorer ma prononciation",
      "Ressources préférées?",
    ],
    chatSuggestions: [
      "Partager ton moment préféré de la dernière session",
      "Demander des recommandations de podcasts français",
      "Proposer une sortie culturelle ensemble",
    ],
  },
  {
    id: "grp-005",
    name: "Mystery & Thriller Readers",
    category: "Book Club",
    description:
      "For fans of suspense, crime novels, and psychological thrillers. Share theories and recommendations with fellow sleuths.",
    members: 78,
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
    meetingTime: "Every 3rd Sunday, 4:00 PM",
    host: { id: "cg-h5", name: "Priya", avatarUrl: avatar("Priya mystery host") },
    participants: [
      { id: "cg-p17", name: "Evan", avatarUrl: avatar("Evan mystery") },
      { id: "cg-p18", name: "Skye", avatarUrl: avatar("Skye mystery") },
      { id: "cg-p19", name: "Jon", avatarUrl: avatar("Jon mystery") },
      { id: "cg-p20", name: "Rhea", avatarUrl: avatar("Rhea mystery") },
    ],
    chatWelcome: "Calling all armchair detectives!",
    chatSampleConversation: [
      {
        sender: "Priya",
        content: "Hey sleuths! Ready to discuss the twist in chapter 12?",
        time: "3:45 PM",
        isMine: false,
      },
      {
        sender: "You",
        content: "Absolutely! I have a wild theory about the neighbor.",
        time: "3:47 PM",
        isMine: true,
      },
      {
        sender: "Skye",
        content: "Same! Let's compare notes tonight.",
        time: "3:48 PM",
        isMine: false,
      },
    ],
    chatQuickReplies: [
      "Share your best theory",
      "Recommend a similar book",
      "Ask about next month's pick",
    ],
    chatSuggestions: [
      "Start a thread for spoiler discussions",
      "Suggest a themed meetup night",
      "Ask if anyone wants to swap book copies",
    ],
  },
  {
    id: "grp-006",
    name: "Sunrise Trail Runners",
    category: "Hiking Team",
    description:
      "Early morning trail running group. We focus on building endurance and exploring scenic routes. Coffee stop included!",
    members: 65,
    image:
      "https://images.unsplash.com/photo-1526401485004-2aa6f7d3fe6c?auto=format&fit=crop&w=900&q=80",
    meetingTime: "Tuesdays & Saturdays, 6:00 AM",
    host: { id: "cg-h6", name: "Riley", avatarUrl: avatar("Riley runners host") },
    participants: [
      { id: "cg-p21", name: "Kai", avatarUrl: avatar("Kai runner") },
      { id: "cg-p22", name: "June", avatarUrl: avatar("June runner") },
      { id: "cg-p23", name: "Parker", avatarUrl: avatar("Parker runner") },
      { id: "cg-p24", name: "Nia", avatarUrl: avatar("Nia runner") },
    ],
    chatWelcome: "Rise and shine, runners!",
    chatSampleConversation: [
      {
        sender: "Riley",
        content: "Morning crew! Saturday's run is the Riverside 8K. Pace groups posted above.",
        time: "5:45 AM",
        isMine: false,
      },
      {
        sender: "You",
        content: "Thanks! Anyone up for grabbing coffee after?",
        time: "5:46 AM",
        isMine: true,
      },
      {
        sender: "Kai",
        content: "Count me in! There's a new cafe by the finish.",
        time: "5:48 AM",
        isMine: false,
      },
    ],
    chatQuickReplies: [
      "Looking for a pace partner",
      "Need route details",
      "Recovery tips?",
    ],
    chatSuggestions: [
      "Ask who needs foam rollers or gear",
      "Coordinate warm-up stretches",
      "Share your latest running playlist",
    ],
  },
  {
    id: "grp-007",
    name: "Italian Culture & Conversation",
    category: "Language Swap",
    description:
      "Parliamo italiano! Learn Italian while discovering Italian culture, cuisine, and traditions. Beginner-friendly sessions.",
    members: 103,
    image:
      "https://images.unsplash.com/photo-1520342868574-5fa3804e551c?auto=format&fit=crop&w=900&q=80",
    meetingTime: "Mondays, 7:30 PM",
    host: { id: "cg-h7", name: "Giulia", avatarUrl: avatar("Giulia italian host") },
    participants: [
      { id: "cg-p25", name: "Marco", avatarUrl: avatar("Marco italian") },
      { id: "cg-p26", name: "Luna", avatarUrl: avatar("Luna italian") },
      { id: "cg-p27", name: "Enzo", avatarUrl: avatar("Enzo italian") },
      { id: "cg-p28", name: "Bianca", avatarUrl: avatar("Bianca italian") },
    ],
    chatWelcome: "Ciao a tutti!",
    chatSampleConversation: [
      {
        sender: "Giulia",
        content: "Ciao! Questa settimana parliamo di cucina regionale. Preferenze?",
        time: "7:10 PM",
        isMine: false,
      },
      {
        sender: "You",
        content: "Adoro la cucina siciliana!",
        time: "7:12 PM",
        isMine: true,
      },
      {
        sender: "Marco",
        content: "Ottima scelta! Posso condividere una ricetta di arancini.",
        time: "7:13 PM",
        isMine: false,
      },
    ],
    chatQuickReplies: [
      "Cerco un partner di conversazione",
      "Consigli per migliorare il vocabolario",
      "Risorse per principianti?",
    ],
    chatSuggestions: [
      "Proporre una cena italiana di gruppo",
      "Condividere i tuoi obiettivi linguistici",
      "Chiedere consigli su film italiani",
    ],
  },
  {
    id: "grp-008",
    name: "Women's Mountain Hiking",
    category: "Hiking Team",
    description:
      "Empowering women through mountain adventures. Build confidence, fitness, and lasting friendships on challenging trails.",
    members: 141,
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
    meetingTime: "1st & 3rd Sunday, 8:00 AM",
    host: { id: "cg-h8", name: "Sasha", avatarUrl: avatar("Sasha mountain host") },
    participants: [
      { id: "cg-p29", name: "Ivy", avatarUrl: avatar("Ivy mountain") },
      { id: "cg-p30", name: "Tara", avatarUrl: avatar("Tara mountain") },
      { id: "cg-p31", name: "Lena", avatarUrl: avatar("Lena mountain") },
      { id: "cg-p32", name: "Mara", avatarUrl: avatar("Mara mountain") },
    ],
    chatWelcome: "Hey trailblazers!",
    chatSampleConversation: [
      {
        sender: "Sasha",
        content: "Hey trailblazers! Next summit is Eagle Peak. Training hike this weekend.",
        time: "7:05 PM",
        isMine: false,
      },
      {
        sender: "You",
        content: "Excited! Any tips for the steep section?",
        time: "7:07 PM",
        isMine: true,
      },
      {
        sender: "Tara",
        content: "Bring trekking poles—makes a big difference on the switchbacks.",
        time: "7:08 PM",
        isMine: false,
      },
    ],
    chatQuickReplies: [
      "Looking for a gear checklist",
      "Need ride coordination",
      "Share training progress",
    ],
    chatSuggestions: [
      "Ask about women's specific hiking gear",
      "Coordinate a strength training session",
      "Share confidence-boosting trail stories",
    ],
  },
];
