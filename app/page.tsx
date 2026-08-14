import { PageContainer } from '@/components/page-container';
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { SkillsGrid } from '@/components/sections/skills-grid';
import { ProjectsGrid } from '@/components/sections/projects-grid';
import { ContactForm } from '@/components/sections/contact-form';

export default function Home() {
  return (
    <PageContainer>
      <HeroSection />
      <AboutSection />
      <SkillsGrid />
      <ProjectsGrid />
      <ContactForm />
    </PageContainer>
  );
}