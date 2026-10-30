import { lazy, Suspense } from 'react'
import Home from './home/home'

const About = lazy(() => import('./abtloader/about/about'))
const Skill = lazy(() => import('./abtloader/Skills/skills'))
const Contact = lazy(() => import('./contact/contact'))
const Projects = lazy(() => import('./project/projects'))

function PageSection({ children, className }) {
  return (
    <section className={className}>
      <Suspense fallback={null}>{children}</Suspense>
    </section>
  )
}

function Pageloader() {
  return (
    <>
    <section className='section1' ><Home /></section>
    <PageSection className='section2'><About /></PageSection>
    <PageSection className='section3'><Skill /></PageSection>
    <PageSection className='section4'><Projects /></PageSection>
    <PageSection className='section5'><Contact /></PageSection>
    </>
  )
}

export default Pageloader