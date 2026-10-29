import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Home from './home/home'

const About = lazy(() => import('./abtloader/about/about'))
const Skill = lazy(() => import('./abtloader/Skills/skills'))
const Contact = lazy(() => import('./contact/contact'))
const Projects = lazy(() => import('./project/projects'))
const Marquee = lazy(() => import('../Components/marquee/marquee'))

//gsap
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);

function DeferredSection({ children, className }) {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px' }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={`${className} deferred-section`}>
      {isVisible ? <Suspense fallback={null}>{children}</Suspense> : null}
    </section>
  )
}

function Pageloader() {
  return (
    <>
    <section className='section1' ><Home /></section>
    <DeferredSection className='section2'><About /></DeferredSection>
    <DeferredSection className='section3'><Marquee /></DeferredSection>
    <DeferredSection className='section3'><Skill /></DeferredSection>
    <DeferredSection className='section4'><Projects /></DeferredSection>
    <DeferredSection className='section5'><Contact /></DeferredSection>
    </>
  )
}

export default Pageloader