export interface Programme {
  id: string;
  name: string;
  duration: string;
  type: "Bachelor" | "Master" | "PhD" | "Certificate";
  description: string;
}

export interface University {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  image: string;
  website: string;
  programmes: Programme[];
}

export const universities: University[] = [
  {
    id: "sorbonne",
    name: "Sorbonne University",
    city: "Paris",
    country: "France",
    description: "Leading French research university",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop",
    website: "https://www.sorbonne-universite.fr",
    programmes: [
      {
        id: "sorbonne-mba",
        name: "MBA International Business",
        duration: "2 years",
        type: "Master",
        description: "Comprehensive business management programme with international focus.",
      },
    ],
  },
  {
    id: "stanford",
    name: "Stanford University",
    city: "Stanford",
    country: "USA",
    description: "Premier private research university in Silicon Valley",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop",
    website: "https://www.stanford.edu",
    programmes: [
      {
        id: "stanford-cs",
        name: "Computer Science",
        duration: "4 years",
        type: "Bachelor",
        description: "World-renowned computer science undergraduate programme.",
      },
      {
        id: "stanford-mba",
        name: "MBA",
        duration: "2 years",
        type: "Master",
        description: "Top-ranked business administration programme.",
      },
      {
        id: "stanford-ai",
        name: "Artificial Intelligence",
        duration: "2 years",
        type: "Master",
        description: "Cutting-edge AI and machine learning programme.",
      },
      {
        id: "stanford-ee",
        name: "Electrical Engineering",
        duration: "4 years",
        type: "Bachelor",
        description: "Leading electrical engineering programme.",
      },
    ],
  },
  {
    id: "oxford",
    name: "University of Oxford",
    city: "Oxford",
    country: "UK",
    description: "World's oldest English-speaking university",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop",
    website: "https://www.ox.ac.uk",
    programmes: [
      {
        id: "oxford-ppe",
        name: "Philosophy, Politics and Economics",
        duration: "3 years",
        type: "Bachelor",
        description: "Prestigious interdisciplinary programme.",
      },
      {
        id: "oxford-law",
        name: "Law",
        duration: "3 years",
        type: "Bachelor",
        description: "Renowned legal studies programme.",
      },
    ],
  },
  {
    id: "mit",
    name: "MIT",
    city: "Cambridge",
    country: "USA",
    description: "Leading institution for science and technology",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop",
    website: "https://www.mit.edu",
    programmes: [
      {
        id: "mit-engineering",
        name: "Engineering",
        duration: "4 years",
        type: "Bachelor",
        description: "Top-ranked engineering programme.",
      },
      {
        id: "mit-physics",
        name: "Physics",
        duration: "4 years",
        type: "Bachelor",
        description: "World-class physics research programme.",
      },
      {
        id: "mit-sloan",
        name: "Sloan MBA",
        duration: "2 years",
        type: "Master",
        description: "Innovative business leadership programme.",
      },
    ],
  },
  {
    id: "tokyo",
    name: "University of Tokyo",
    city: "Tokyo",
    country: "Japan",
    description: "Japan's most prestigious research university",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop",
    website: "https://www.u-tokyo.ac.jp",
    programmes: [
      {
        id: "tokyo-intl",
        name: "Global Studies",
        duration: "4 years",
        type: "Bachelor",
        description: "English-taught international affairs programme.",
      },
      {
        id: "tokyo-science",
        name: "Advanced Science",
        duration: "2 years",
        type: "Master",
        description: "Cutting-edge scientific research programme.",
      },
    ],
  },
  {
    id: "eth",
    name: "ETH Zurich",
    city: "Zurich",
    country: "Switzerland",
    description: "Europe's leading science and technology institution",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop",
    website: "https://ethz.ch",
    programmes: [
      {
        id: "eth-robotics",
        name: "Robotics",
        duration: "2 years",
        type: "Master",
        description: "Advanced robotics and autonomous systems programme.",
      },
      {
        id: "eth-architecture",
        name: "Architecture",
        duration: "3 years",
        type: "Bachelor",
        description: "Innovative architectural design programme.",
      },
    ],
  },
];

export const getUniversityById = (id: string): University | undefined => {
  return universities.find((uni) => uni.id === id);
};
