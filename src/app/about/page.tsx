import { Rocket, Target, Users2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center">
        <Rocket className="mx-auto text-primary" size={36} />
        <h1 className="text-3xl font-bold text-slate-800 mt-3">About EventPilot AI</h1>
        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
          EventPilot AI started as a class project to solve a real problem: Dhaka's tech and
          student community has dozens of hackathons, workshops, and meetups every month, scattered
          across Facebook groups and WhatsApp chats with no central place to discover them.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mt-12">
        <div className="card p-6">
          <Target className="text-secondary mb-3" size={24} />
          <h2 className="font-semibold text-slate-800">Our Mission</h2>
          <p className="text-sm text-slate-500 mt-2">
            Make it effortless to discover and host tech events in Dhaka, while using AI to remove
            the busywork of writing listings and answering repetitive questions.
          </p>
        </div>
        <div className="card p-6">
          <Users2 className="text-secondary mb-3" size={24} />
          <h2 className="font-semibold text-slate-800">Who It's For</h2>
          <p className="text-sm text-slate-500 mt-2">
            Students, developers, and community organizers who want a fast, no-clutter way to
            post and find events without fighting with spreadsheets or social media threads.
          </p>
        </div>
      </div>

      <div className="card p-8 mt-10">
        <h2 className="font-semibold text-slate-800 text-lg">Built With</h2>
        <p className="text-sm text-slate-500 mt-2">
          Next.js 14, TypeScript, Tailwind CSS, and TanStack Query on the frontend; Node.js, Express,
          and MongoDB on the backend; JWT and Google Sign-In for authentication; and Groq-hosted
          LLMs for the AI description generator and chat assistant.
        </p>
      </div>
    </div>
  );
}
