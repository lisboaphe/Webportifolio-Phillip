export const site = {
  name: "Phillip Lisboa",
  resumeUrl: "",
  resumes: [{ language: "English", lang: "en", url: "/api/resume/en" }, { language: "Deutsch", lang: "de", url: "/api/resume/de" }],
  role: "Frontend Developer",
  eyebrow: "React • Next.js • Tailwind",
  heroLine: "Building thoughtful web experiences, one pixel at a time.",
  intro:
    "I enjoy turning ideas into clean, responsive interfaces with personality. This portfolio is still growing with me — more projects, experiments and details are coming along the way.",
  socials: {
    github: "https://github.com/lisboaphe",
    linkedin: "https://www.linkedin.com/in/phillip-bittencourt-lisboa-056b05306/",
  },
  skills: [
    "Python",
    "Java",
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Responsive UI",
    "Git / GitHub",
  ],
  projects: [
    {
      number: "01",
      title: "Crew Office",
      category: "Multiplayer · AI",
      description:
        "A multiplayer pixel-art office where every player brings their own team of AI agents. Host an office, invite friends, hand it a project, and watch the agents plan, message each other, write files, run tests and review the work — every movement on the floor is a real backend event.",
      tags: ["JavaScript", "Node.js", "Multiplayer", "AI agents", "Pixel art"],
      status: "1.0.0 beta",
      href: "https://github.com/lisboaphe/Crew-Office",
      layout: "wide",
      images: [
        { src: "/projects/crew-office-floor.webp", alt: "Crew Office: the 2D pixel-art office floor with desks, a break area and the player at their desk" },
        { src: "/projects/crew-office-characters.webp", alt: "Crew Office: the character picker with six pixel-art characters" },
      ],
    },
    {
      number: "02",
      title: "Omachi Pet",
      category: "Desktop companion",
      description:
        "An Egg-and-Slime desktop companion for Omarchy. Hatch your egg, feed and play with your slime, and let it roam the desktop. What you do on your computer — coding, music, gaming — trains its attributes and changes how it reacts.",
      tags: ["QML", "Quickshell", "Hyprland", "Pixel art"],
      status: "v1.0.0",
      href: "https://github.com/lisboaphe/omachi-pet",
      layout: "tall",
      images: [
        { src: "/projects/omachi-pet-home.webp", alt: "Omachi Pet home tab: a blue slime listening to music by a lake, with fullness, happiness and energy bars" },
        { src: "/projects/omachi-pet-activities.webp", alt: "Omachi Pet activities tab with activity detection and training settings" },
      ],
    },
    {
      number: "03",
      title: "Portfolio Playground",
      category: "Development",
      description:
        "This site: a personal space where modern UI meets small pixel-art details, playful motion and a responsive bento layout.",
      tags: ["Next.js", "TypeScript", "Tailwind"],
      status: "Live",
      href: "https://github.com/lisboaphe/Webportifolio-Phillip",
      layout: "wide",
      images: [
        { src: "/projects/portfolio-home.webp", alt: "The portfolio home page with the pixel-art character and bento tiles" },
      ],
    },
  ],
};
