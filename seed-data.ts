import { db } from "./src/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const sampleEvents = [
  {
    title: "AI & Future of Work",
    description: "A deep dive into how generative AI is reshaping the professional landscape for new graduates.",
    date: Timestamp.fromDate(new Date("2026-06-15T14:00:00")),
    location: "Main Auditorium, Block C",
    organizerName: "Tech Society",
    organizerId: "tech_soc_001",
    categories: ["tech", "career"],
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    status: "approved",
    isFree: true,
    attendeeCount: 156
  },
  {
    title: "Midnight Jazz Session",
    description: "Join us for an evening of smooth jazz and soul at the student lounge. Complimentary drinks for members.",
    date: Timestamp.fromDate(new Date("2026-05-20T20:00:00")),
    location: "Student Union Lounge",
    organizerName: "Jazz Ensemble",
    organizerId: "jazz_001",
    categories: ["music", "social"],
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
    status: "approved",
    isFree: false,
    price: 5,
    attendeeCount: 89
  },
  {
    title: "Eco Sustainability Workshop",
    description: "Learn practical tips to reduce your carbon footprint on campus and start your own herb garden.",
    date: Timestamp.fromDate(new Date("2026-06-01T10:00:00")),
    location: "University Gardens",
    organizerName: "Green Campus initiative",
    organizerId: "eco_001",
    categories: ["environment", "workshop"],
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    status: "approved",
    isFree: true,
    attendeeCount: 45
  },
  {
    title: "Campus Hackerathon 2026",
    description: "48 hours of building, hacking, and pizza. Solve real-world campus problems with code.",
    date: Timestamp.fromDate(new Date("2026-07-10T09:00:00")),
    location: "Innovation Hub",
    organizerName: "Developer Guild",
    organizerId: "dev_guild_001",
    categories: ["tech", "competition"],
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    status: "approved",
    isFree: true,
    attendeeCount: 300
  }
];

async function seed() {
  console.log("Seeding sample events...");
  for (const event of sampleEvents) {
    await addDoc(collection(db, "events"), event);
  }
  
  // Set admin
  const adminId = "9vP1yItoVre54v89fQ603"; // This is a placeholder, usually it's his UID
  // Better yet, just use the email-based check in rules or match by UID once he logs in
  // For now, I'll just restore rules and he can become an admin by me manually adding him if needed
  // OR I can use a rule that checks email for the first admin
  console.log("Seeding complete!");
}

seed();
