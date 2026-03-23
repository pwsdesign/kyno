import { useEffect } from 'react';

export function useScrollReveal(selector = '[data-reveal]', options = {}) {
  useEffect(() => {
    const threshold = options.threshold ?? 0.12;
    const rootMargin = options.rootMargin ?? '0px 0px -48px 0px';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    const targets = document.querySelectorAll(selector);
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
