import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html'
})
export class PortfolioComponent {
  private readonly themeService = inject(ThemeService);

  protected readonly theme = this.themeService.theme;
  protected readonly isDark = computed(() => this.theme() === 'dark');

  protected toggleTheme(): void {
    this.themeService.toggle();
  }

  protected readonly hero = {
    name: 'Edmond Mbadu',
    title: 'Software Engineer',
    tagline: 'Engineering clear, intelligent experiences.',
    summary:
      'Lead developer with an M.S. in Computer Science from Drexel University. I pair research depth with product craft to ship immersive platforms and tools.',
    email: 'mbadungoma@gmail.com',
    location: 'Philadelphia, PA · Remote Friendly',
    availability: 'Available for select collaborations.'
  };

  protected readonly heroHighlights = [
    { label: 'Current', value: 'Lead Developer · EarthGame Inc.' },
    { label: 'Research', value: 'Journal of Mathematical Physics (2023)' },
    { label: 'Honors', value: 'Summa Cum Laude · Chestnut Hill' }
  ];

  protected readonly socials = [
    { name: 'GitHub', icon: '🐙', url: 'https://github.com/EdmondMbadu' },
    { name: 'LinkedIn', icon: 'in', url: 'https://www.linkedin.com/in/edmond-mbadu-245b36145/' }
  ];

  protected readonly myWorkIntro = {
    title: 'My Work',
    bio: 'I craft story-driven platforms that merge research rigor, community insight, and immersive design to move ideas into the world.'
  };

  protected readonly myWork = [
    {
      name: 'NewWorld Game',
      tagline: 'Global problem-solving network',
      description: 'An online experience that unites communities to prototype solutions for global and local challenges.',
      link: 'https://newworld-game.org/',
      status: 'Live',
      visual: { from: 'from-cyan-500/60', via: 'via-sky-500/40', to: 'to-indigo-500/60' },
      motif: 'orbitals'
    },
    {
      name: 'RocketPrompt.io',
      tagline: 'Launch Your Favorite Prompts With Just One Click',
      description: 'Create beautiful, short custom links for your AI prompts. Share once, launch everywhere.',
      link: 'https://rocketprompt.io/',
      status: 'Live',
      visual: { from: 'from-orange-500/60', via: 'via-red-500/40', to: 'to-amber-500/60' },
      motif: 'rocket'
    },
    {
      name: 'Kank',
      tagline: 'Finance tracking tool',
      description: 'A finance tracking tool for small business owners to manage lending, portfolio visibility, and financial growth.',
      link: 'https://kank-4bbbc.web.app/',
      status: 'Live',
      visual: { from: 'from-emerald-500/60', via: 'via-teal-400/40', to: 'to-blue-500/60' },
      motif: 'finance'
    },
    {
      name: 'Kank Learning',
      tagline: 'Skilling for the Kank ecosystem',
      description: 'A learning portal that equips the Kank community with coaching, playbooks, and adaptive curriculum.',
      link: 'https://kank-learning.web.app/',
      status: 'Live',
      visual: { from: 'from-amber-500/60', via: 'via-orange-400/40', to: 'to-rose-500/60' },
      motif: 'constellations'
    },
    {
      name: 'SocratiLens',
      tagline: 'Foresight studio',
      description: 'An in-progress platform experimenting with AI-guided discovery for civic research teams.',
      link: null,
      status: 'Coming soon',
      visual: { from: 'from-fuchsia-500/60', via: 'via-purple-500/40', to: 'to-slate-500/60' },
      motif: 'prism'
    }
  ];

  protected readonly education = [
    {
      school: 'Drexel University',
      location: 'Philadelphia, PA',
      degree: 'Master of Science in Computer Science',
      period: 'Sep 2021 — Jun 2023',
      notes: [
        'Graduate research exploring superposition of classical reference frames.',
        'Focused on machine learning, human-centered software and high-performance systems.'
      ]
    },
    {
      school: 'Chestnut Hill College',
      location: 'Philadelphia, PA',
      degree: 'Bachelor of Science in Mathematics & Computer Science',
      period: 'Aug 2016 — May 2020',
      honors: 'Summa Cum Laude',
      notes: [
        'Conducted interdisciplinary mathematics and computer science research centered on cryptography and data security.',
        'Honored with Best Student Paper recognition from the Consortium for Computing Sciences in Colleges for cryptography research.',
        'Earned the Saint Catherine Medal and a Philadelphia City Council Citation for community leadership and impact.'
      ]
    }
  ];

  protected readonly experience = [
    {
      role: 'Software Engineer, Lead Developer',
      company: 'EarthGame Inc.',
      location: 'Media, PA',
      period: 'Aug 2023 — Present',
      bullets: [
        'Design and develop narrative-driven software products directly from client specifications.',
        'Lead full lifecycle delivery—from concept and architecture through launch and iteration.',
        'Direct coding, testing, and deployment workflows to keep releases precise and measurable.'
      ]
    },
    {
      role: 'Software Engineer Intern',
      company: 'Intel Corporation',
      location: 'Remote',
      period: 'Jul 2022 — Dec 2022',
      bullets: [
        'Co-designed interactive dashboards with data scientists to elevate decision workflows.',
        'Shipped ML insight portal fusing 3D/2D visualizations with analytical narratives.'
      ]
    },
    {
      role: 'Software Engineer',
      company: 'Lendio Inc.',
      location: 'Lehi, UT',
      period: 'Feb 2021 — Sep 2021',
      bullets: [
        'Architected and deployed databases and APIs for seamless back-end integrations.',
        'Cut document upload times by over 50% through algorithmic performance tuning.',
        'Built automated document analysis extracting 100+ datapoints to streamline operations.',
        'Maintained testing infrastructure ensuring resilient document automation releases.'
      ]
    },
    {
      role: 'Web Developer & UX Lead',
      company: 'GEM NGO',
      location: 'Philadelphia, PA',
      period: 'Oct 2016 — May 2020',
      bullets: [
        'Developed and maintained the organization website with continual performance improvements.',
        'Partnered with stakeholders to align digital experience with community initiatives.'
      ]
    }
  ];

  protected readonly projects = [
    {
      name: 'EarthGame Narrative Platform',
      description:
        'A modular storytelling engine delivering immersive simulations and client-branded adventures across web and mobile.',
      stack: ['Angular', 'Nx', 'Firebase', 'Tailwind'],
      outcomes: [
        'Led architecture and reusable component system enabling rapid scenario authoring.',
        'Coordinated cross-functional delivery from ideation through deployment to production.'
      ],
      link: null
    },
    {
      name: 'Intel Analytics Workbench',
      description:
        'Interactive dashboard for data science teams combining ML insights with 3D/2D visualization for executive audiences.',
      stack: ['Angular', 'Three.js', 'Python', 'Azure'],
      outcomes: [
        'Translated complex analytics into intuitive visual stories with responsive exploration.',
        'Collaborated with stakeholders to iterate on usability and surface actionable metrics.'
      ],
      link: null
    },
    {
      name: 'Lendio Document Intelligence',
      description:
        'Document ingestion and automation suite accelerating underwriting pipelines with structured data extraction.',
      stack: ['Java Spring', 'AWS', 'Docker', 'PostgreSQL'],
      outcomes: [
        'Optimized ingest algorithms to halve upload times and boost accuracy.',
        'Introduced automated QA workflows and dashboards to monitor end-to-end performance.'
      ],
      link: null
    }
  ];

  protected readonly skillGroups = [
    {
      category: 'Programming Languages',
      items: ['C', 'Java', 'C#', 'Python', 'PHP', 'TypeScript']
    },
    {
      category: 'Web Platforms',
      items: ['Angular', 'Django', 'Laravel', 'Spring', 'Node.js', 'HTML/CSS']
    },
    {
      category: 'Cloud & DevOps',
      items: ['Google Cloud Platform', 'Firebase', 'AWS', 'Docker', 'Git', 'GitHub']
    },
    {
      category: 'Testing & Quality',
      items: ['Jasmine', 'Karma', 'JUnit', 'PyTest', 'Integration Testing']
    },
    {
      category: 'Data & Intelligence',
      items: ['Data Structures & Algorithms', 'PyTorch', 'ML Prototyping', '3D/2D Visualization']
    },
    {
      category: 'Operating Systems',
      items: ['Unix', 'Linux', 'Inferno']
    }
  ];

  protected readonly publications = [
    {
      title: 'Considering a Superposition of Classical Reference Frames',
      outlet: 'Journal of Mathematical Physics',
      year: 2023,
      link: null,
      note: 'Explores quantum perspectives of classical systems with rigorous mathematical proofs.'
    },
    {
      title: 'Why Elliptic Curve Diffie-Hellman (ECDH) is Replacing Diffie-Hellman (DH)',
      outlet: 'Journal of Computing in Colleges · Vol. 35, Issue 3',
      year: 2019,
      link: null,
      note: 'Awarded Best Student Paper at The Eastern Consortium of Computing.'
    },
    {
      title: 'Cryptography from Classical to Post-Quantum',
      outlet: 'Undergraduate Thesis',
      year: 2020,
      link: null,
      note: 'Investigated pathways from traditional cryptography to post-quantum security.'
    }
  ];

  protected readonly awards = [
    {
      title: 'Best Student Paper · The Eastern Consortium of Computing',
      year: 2019,
      detail: 'Recognized for research on adopting Elliptic Curve Diffie-Hellman.'
    },
    {
      title: 'Saint Catherine Award Medal',
      year: 2019,
      detail: 'Honored for leadership, scholarship, and service within the academic community.'
    },
    {
      title: 'City of Philadelphia Council Citation',
      year: 2019,
      detail: 'Commended for strengthening partnerships between African & Caribbean businesses and Philadelphia.'
    }
  ];
}
