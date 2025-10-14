import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html'
})
export class PortfolioComponent {
  protected readonly hero = {
    name: 'Edmond Mbadu',
    title: 'Software Engineer',
    summary:
      'I craft accessible, performant web experiences with a focus on component-driven UIs, thoughtful design systems, and resilient infrastructure.',
    location: 'Based in Accra, GH — collaborating remotely worldwide'
  };

  protected readonly projects = [
    {
      name: 'Atlas Dashboard',
      description:
        'An operations dashboard with real-time analytics, custom data visualizations, and role-based access.',
      stack: ['Angular', 'Nx', 'D3', 'Tailwind'],
      link: '#'
    },
    {
      name: 'Pulse Mobile',
      description:
        'Cross-platform mobile companion app for tracking health metrics and surfacing personalized insights.',
      stack: ['Flutter', 'Firebase', 'Cloud Functions'],
      link: '#'
    },
    {
      name: 'Sierra Design System',
      description:
        'A scalable design system and component library powering multiple product lines with unified branding.',
      stack: ['Storybook', 'Angular', 'Sass'],
      link: '#'
    }
  ];

  protected readonly experience = [
    {
      role: 'Senior Software Engineer',
      company: 'Northwind Labs',
      period: '2022 — Present',
      summary:
        'Leading the front-end platform team, driving accessibility improvements, and mentoring engineers across squads.'
    },
    {
      role: 'UI Engineer',
      company: 'Orbit Studios',
      period: '2019 — 2022',
      summary:
        'Shipped interactive marketing experiences for global brands with scalable component architectures.'
    },
    {
      role: 'Product Engineer',
      company: 'Indie Projects',
      period: '2016 — 2019',
      summary:
        'Built end-to-end products for startups from prototype to launch, focusing on iterative delivery and user feedback.'
    }
  ];

  protected readonly skills = [
    'Angular',
    'TypeScript',
    'RxJS',
    'Tailwind CSS',
    'Node.js',
    'GraphQL',
    'Storybook',
    'Jest & Vitest',
    'Design Systems',
    'Accessibility',
    'CI/CD',
    'Cloud Architecture'
  ];
}
