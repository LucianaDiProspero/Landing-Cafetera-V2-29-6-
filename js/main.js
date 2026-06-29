// Animaciones suaves al hacer scroll. Agrega la clase .reveal a cualquier bloque nuevo.
const revealElements = document.querySelectorAll(".reveal");
const header = document.querySelector(".site-header");
const brandLink = document.querySelector(".brand");
const menuToggle = document.querySelector(".menu-toggle");
const headerMenu = document.querySelector("#header-menu");
const heroScroll = document.querySelector(".hero-scroll");
const heroProductLink = document.querySelector("[data-hero-product-link]");
const heroScrollCue = document.querySelector(".hero-scroll-cue");
const heroTransition = document.querySelector(".hero-transition");
const emotionalTransition = document.querySelector(".emotional-transition");
const emotionalSection = document.querySelector(".full-bleed-image");
const emotionalLineOne = document.querySelector(".window-line-1");
const emotionalLineTwo = document.querySelector(".window-line-2");
const headerSectionLinks = document.querySelectorAll(".header-links a");
const howSection = document.querySelector(".how");
const benefitsSection = document.querySelector(".benefits");
const specExploded = document.querySelector(".spec-exploded");
const lastHowStep = howSection?.querySelector(".how-step:last-child");
const benefitTabs = document.querySelectorAll("[data-benefit-index]");
const benefitItems = document.querySelectorAll(".benefit-item");
const benefitImage = document.querySelector(".benefit-image");
const accessoryPanels = document.querySelectorAll("[data-accessory-panel]");
const accessoryLinks = document.querySelectorAll("[data-accessory-link]");
const explodedPieceIds = ["tapa", "contratapa", "filtro", "cuerpo", "piso"];
const explodedHotspots = document.querySelectorAll("[data-exploded-hotspot]");
const finalCta = document.querySelector(".final-cta");
const accessoryProductUrl = "https://www.wacaco.com/products/minipresso-gr?srsltid=AfmBOorDPvngNIDBVf-H_lahJGFi0SnJkaCjnxM6dGQv4oc2yuUH7y0q";
const newsletterForm = document.querySelector("[data-newsletter-form]");
const newsletterStatus = document.querySelector("[data-newsletter-status]");
const desktopHoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

const benefits = [
  {
    description: "Compacta para mochila, valija o kit de ruta.",
    image: "assets/benefit-portable.jpg",
    alt: "Minipresso GR lista para llevar durante un viaje",
  },
  {
    description: "Sistema manual: no requiere batería ni electricidad.",
    image: "assets/benefit-independent.jpg",
    alt: "Minipresso GR funcionando de manera manual al aire libre",
  },
  {
    description: "Compatible con café molido para ajustar origen, molienda e intensidad.",
    image: "assets/benefit-customizable.jpg",
    alt: "Café molido preparado para personalizar una extracción",
  },
  {
    description: "Hasta 8 bares de presión para una extracción intensa y crema natural.",
    image: "assets/benefit-espresso.jpeg",
    alt: "Espresso intenso preparado con Minipresso GR",
  },
  {
    description: "El café deja de depender del lugar y vuelve a depender de vos.",
    image: "assets/benefit-pause.jpg",
    alt: "Una pausa de café con Minipresso GR durante el viaje",
  },
];

let activeBenefit = 0;
let benefitChangeTimer;
let benefitScrollAmount = 0;
let benefitTourCompleted = false;
let benefitSectionAligned = false;
let howAnimationTimer;
let howLinesTimer;
let specExplodedTimer;
let explodedHoverTimer;

const setActiveExplodedNote = (activeId) => {
  if (!specExploded) {
    return;
  }

  explodedPieceIds.forEach((id) => {
    const isActive = id === activeId;
    specExploded.querySelector(`.note-${id}`)?.classList.toggle("is-active", isActive);
    specExploded.querySelector(`.hotspot-${id}`)?.classList.toggle("is-active", isActive);
    specExploded.querySelector(`#${id}`)?.classList.toggle("is-piece-highlight", isActive);
  });

  explodedHotspots.forEach((button) => {
    button.setAttribute("aria-expanded", String(button.dataset.explodedHotspot === activeId));
  });
};

const setActiveBenefit = (nextIndex, direction = 1) => {
  if (!benefitImage || nextIndex === activeBenefit) {
    return;
  }

  window.clearTimeout(benefitChangeTimer);
  activeBenefit = (nextIndex + benefits.length) % benefits.length;
  benefitTabs.forEach((tab, index) => {
    const isActive = index === activeBenefit;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("aria-expanded", String(isActive));
    benefitItems[index]?.classList.toggle("is-active", isActive);
  });

  benefitImage.classList.add("is-changing");

  benefitChangeTimer = window.setTimeout(() => {
    benefitImage.src = benefits[activeBenefit].image;
    benefitImage.alt = benefits[activeBenefit].alt;
    benefitImage.classList.remove("is-changing");
  }, 240);
};

benefitTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const nextIndex = Number(tab.dataset.benefitIndex);
    setActiveBenefit(nextIndex, nextIndex > activeBenefit ? 1 : -1);
  });
});

window.addEventListener("wheel", (event) => {
  if (!benefitsSection || !benefitImage || benefitTabs.length === 0) {
    return;
  }

  const rect = benefitsSection.getBoundingClientRect();
  const direction = event.deltaY > 0 ? 1 : -1;
  const headerHeight = header?.offsetHeight ?? 0;
  const alignedTop = headerHeight;
  const isAligned = Math.abs(rect.top - alignedTop) <= 28;
  const isApproaching =
    direction > 0 &&
    rect.top <= alignedTop + 90 &&
    rect.top > alignedTop - 120 &&
    rect.bottom > window.innerHeight * 0.8;

  if (!benefitTourCompleted && !benefitSectionAligned && isApproaching) {
    event.preventDefault();
    benefitSectionAligned = true;
    window.scrollTo({
      top: benefitsSection.offsetTop - headerHeight,
      behavior: "smooth",
    });
    return;
  }

  const canLock = benefitSectionAligned || (benefitTourCompleted && isAligned);
  const shouldLock =
    canLock &&
    ((direction > 0 && activeBenefit < benefits.length - 1) ||
      (direction < 0 && activeBenefit > 0));

  if (!canLock) {
    benefitScrollAmount = 0;
    return;
  }

  if (shouldLock) {
    event.preventDefault();
  }

  benefitScrollAmount += event.deltaY;

  if (Math.abs(benefitScrollAmount) >= 160) {
    const nextIndex = Math.min(Math.max(activeBenefit + direction, 0), benefits.length - 1);
    setActiveBenefit(nextIndex, direction);
    benefitScrollAmount = 0;

    if (direction > 0 && nextIndex === benefits.length - 1) {
      benefitTourCompleted = true;
      benefitSectionAligned = false;
    }
  }
}, { passive: false });

const setActiveAccessory = (activeIndex) => {
  accessoryPanels.forEach((item, index) => {
    const isActive = index === activeIndex;
    item.classList.toggle("is-active", isActive);
    item.querySelector(".accessory-panel-trigger")?.setAttribute("aria-expanded", String(isActive));
  });
};

accessoryPanels.forEach((panel, index) => {
  const nextButton = document.createElement("button");
  nextButton.className = "accessory-next";
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Ver siguiente accesorio");
  nextButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"></path>
      <path d="m13 6 6 6-6 6"></path>
    </svg>
  `;
  panel.appendChild(nextButton);

  panel.querySelector(".accessory-panel-trigger")?.addEventListener("click", () => {
    setActiveAccessory(index);
  });

  nextButton.addEventListener("click", (event) => {
    event.stopPropagation();
    setActiveAccessory((index + 1) % accessoryPanels.length);
  });
});

accessoryLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.stopPropagation();
    window.location.href = accessoryProductUrl;
  });
});

newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  newsletterForm.reset();

  if (newsletterStatus) {
    newsletterStatus.textContent = "Gracias por sumarte. Pronto vas a recibir novedades.";
  }
});

const closeMobileMenu = () => {
  menuToggle?.classList.remove("is-open");
  headerMenu?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Abrir men\u00fa");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = !menuToggle.classList.contains("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  headerMenu?.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar men\u00fa" : "Abrir men\u00fa");
});

headerSectionLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 575.98) {
    closeMobileMenu();
  }
});

heroProductLink?.addEventListener("click", (event) => {
  if (!heroScroll) {
    return;
  }

  event.preventDefault();
  const scrollDistance = heroScroll.offsetHeight - window.innerHeight;
  const productPosition = heroScroll.offsetTop + scrollDistance * 0.82;

  window.scrollTo({
    top: productPosition,
    behavior: "smooth",
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const finalCtaLineObserver = finalCta
  ? new IntersectionObserver(
      ([entry]) => {
        entry.target.classList.toggle("is-line-animated", entry.isIntersecting);
      },
      {
        threshold: 0.25,
      }
    )
  : null;

if (finalCta && finalCtaLineObserver) {
  finalCtaLineObserver.observe(finalCta);
}

const emotionalTransitionObserver = emotionalTransition
  ? new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-animated");
        } else {
          entry.target.classList.remove("is-animated");
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px 8% 0px",
      }
    )
  : null;

if (emotionalTransition && emotionalTransitionObserver) {
  emotionalTransitionObserver.observe(emotionalTransition);
}

const updateEmotionalWindow = () => {
  if (!emotionalSection) {
    return;
  }

  const rect = emotionalSection.getBoundingClientRect();
  const transitionRect = emotionalTransition?.getBoundingClientRect();
  const isVisible =
    (rect.bottom > 0 && rect.top < window.innerHeight) ||
    Boolean(transitionRect && transitionRect.bottom > 0 && transitionRect.top < window.innerHeight);
  const progress = Math.min(
    1,
    Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height))
  );
  const exitProgress = Math.min(
    1,
    Math.max(0, (window.innerHeight * 1.18 - rect.bottom) / window.innerHeight)
  );
  const caption = emotionalSection.querySelector(".full-bleed-caption p");

  document.body.classList.toggle("emotional-active", isVisible);
  emotionalLineOne?.classList.toggle("is-visible", progress > 0.15);
  emotionalLineTwo?.classList.toggle("is-visible", progress > 0.4);
  caption?.style.setProperty(
    "--emotional-caption-y",
    `${(exitProgress * window.innerHeight * 0.78).toFixed(2)}px`
  );
};

const howObserver = howSection
  ? new IntersectionObserver(
    ([entry]) => {
      window.clearTimeout(howAnimationTimer);
      window.clearTimeout(howLinesTimer);

      if (entry.isIntersecting) {
        heroTransition?.classList.remove("is-animated");
        howAnimationTimer = window.setTimeout(() => {
          entry.target.classList.add("is-animated");

          const animateHowLines = () => {
            heroTransition?.classList.add("is-animated");
          };

          if (lastHowStep) {
            lastHowStep.addEventListener("transitionend", animateHowLines, { once: true });
          }

          howLinesTimer = window.setTimeout(animateHowLines, 3100);
        }, 180);
        return;
      }

      entry.target.classList.remove("is-animated");
      heroTransition?.classList.remove("is-animated");
    },
    {
      threshold: 0.08,
      rootMargin: "0px",
    }
  )
  : null;

if (howSection && howObserver) {
  howObserver.observe(howSection);
}

brandLink?.addEventListener("click", (event) => {
  event.preventDefault();
  window.clearTimeout(howAnimationTimer);
  window.clearTimeout(howLinesTimer);

  revealElements.forEach((element) => {
    element.classList.remove("is-visible");
    revealObserver.unobserve(element);
  });

  if (howSection && howObserver) {
    howSection.classList.remove("is-animated");
    howObserver.unobserve(howSection);
  }

  heroTransition?.classList.remove("is-animated");

  if (emotionalTransition && emotionalTransitionObserver) {
    emotionalTransition.classList.remove("is-animated");
    emotionalTransitionObserver.unobserve(emotionalTransition);
  }

  emotionalLineOne?.classList.remove("is-visible");
  emotionalLineTwo?.classList.remove("is-visible");
  document.body.classList.remove("emotional-active");

  let animationsRearmed = false;
  const rearmAnimations = () => {
    if (animationsRearmed) {
      return;
    }

    animationsRearmed = true;
    revealElements.forEach((element) => revealObserver.observe(element));

    if (howSection && howObserver) {
      howObserver.observe(howSection);
    }

    if (emotionalTransition && emotionalTransitionObserver) {
      emotionalTransitionObserver.observe(emotionalTransition);
    }

  };

  window.addEventListener("scrollend", rearmAnimations, { once: true });
  window.setTimeout(rearmAnimations, 1800);

  window.scrollTo({
    top: heroScroll?.offsetTop ?? 0,
    behavior: "smooth",
  });
});

const updateActiveHeaderLink = (heroProgress = 0) => {
  const sectionIds = [
    "como-funciona",
    "beneficios",
    "especificaciones",
    "accesorios",
    "resenas",
  ];
  const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 260);
  let activeHref = "#hero";

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    const sectionTop = section?.offsetTop;

    if (sectionTop !== undefined && sectionTop <= marker) {
      activeHref = `#${id}`;
    }
  });

  headerSectionLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === activeHref);
  });
};

const updateExplodedMinipresso = () => {
  if (!specExploded) {
    return;
  }

  const rect = specExploded.getBoundingClientRect();
  const sectionRect = specExploded.closest("section")?.getBoundingClientRect();
  const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
  const isSectionVisible = sectionRect
    ? sectionRect.bottom > 0 && sectionRect.top < window.innerHeight
    : isVisible;

  if (isVisible) {
    if (!specExploded.classList.contains("is-open") && !specExplodedTimer) {
      specExplodedTimer = window.setTimeout(() => {
        specExploded.classList.add("is-open");
        specExplodedTimer = undefined;
      }, 1800);
    }

    return;
  }

  if (specExploded.classList.contains("is-open") && isSectionVisible) {
    return;
  }

  window.clearTimeout(specExplodedTimer);
  specExplodedTimer = undefined;
  specExploded.classList.remove("is-open");
  setActiveExplodedNote(undefined);
};

if (specExploded) {
  explodedHotspots.forEach((button) => {
    const noteId = button.dataset.explodedHotspot;
    const note = specExploded.querySelector(`.note-${noteId}`);

    const keepExplodedNote = () => {
      window.clearTimeout(explodedHoverTimer);
      setActiveExplodedNote(noteId);
    };

    const releaseExplodedNote = () => {
      window.clearTimeout(explodedHoverTimer);
      explodedHoverTimer = window.setTimeout(() => {
        if (!button.matches(":hover") && !note?.matches(":hover")) {
          setActiveExplodedNote(undefined);
        }
      }, 90);
    };

    button.addEventListener("mouseenter", () => {
      if (desktopHoverQuery.matches) {
        keepExplodedNote();
      }
    });

    button.addEventListener("mouseleave", () => {
      if (desktopHoverQuery.matches) {
        releaseExplodedNote();
      }
    });

    button.addEventListener("focus", () => {
      if (desktopHoverQuery.matches) {
        keepExplodedNote();
      }
    });

    button.addEventListener("blur", () => {
      if (desktopHoverQuery.matches) {
        releaseExplodedNote();
      }
    });

    note?.addEventListener("mouseenter", () => {
      if (desktopHoverQuery.matches) {
        keepExplodedNote();
      }
    });

    note?.addEventListener("mouseleave", () => {
      if (desktopHoverQuery.matches) {
        releaseExplodedNote();
      }
    });

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      if (desktopHoverQuery.matches) {
        return;
      }

      const isAlreadyActive = button.classList.contains("is-active");
      setActiveExplodedNote(isAlreadyActive ? undefined : noteId);
    });
  });
}

const ambassadorGallery = document.querySelector("[data-ambassador-gallery]");
const ambassadorDots = document.querySelectorAll("[data-ambassador-index]");
const ambassadorPrev = document.querySelector("[data-ambassador-prev]");
const ambassadorNext = document.querySelector("[data-ambassador-next]");
const ambassadorProfiles = [
  {
    layout: "amamos",
    name: "Amamos Cafés",
    handle: "@amamoscafes",
    platform: "Instagram",
    description: "Pareja viajera especializada en café de especialidad alrededor del mundo.",
    profileUrl: "https://www.instagram.com/amamoscafes/",
    images: [
      ["assets/ambassador-amamos-5.png", "Pareja caminando hacia un lago entre montañas"],
      ["assets/ambassador-amamos-2.png", "Pareja de excursionistas junto a un lago de montaña"],
      ["assets/ambassador-amamos-1.jpg", "Granos de café recién cosechados"],
      ["assets/ambassador-amamos-3.jpg", "Minipresso y café frente a un paisaje al amanecer"],
      ["assets/ambassador-amamos-6.jpg", "Minipresso lista para usar durante un viaje"],
    ],
  },
  {
    layout: "breanna",
    name: "Breanna Wilson",
    handle: "@breannajwilson",
    platform: "Instagram",
    description: "Escritora y aventurera que lleva el café a rutas remotas y viajes sin mapa.",
    profileUrl: "https://www.instagram.com/breannajwilson/",
    images: [
      ["assets/ambassador-breanna-5.png", "Viajera con una Minipresso guardada en su mochila en un aeropuerto"],
      ["assets/ambassador-breanna-1.jpg", "Breanna disfrutando un café durante un viaje"],
      ["assets/ambassador-breanna-2.jpg", "Minipresso y objetos preparados para viajar"],
      ["assets/ambassador-breanna-3.jpg", "Equipo de viaje y café guardado en una mochila"],
    ],
  },
  {
    layout: "nicolette",
    name: "Nicolette",
    handle: "@wacaco_official",
    platform: "Instagram",
    description: "Aventurera de montaña que convierte cada pausa al aire libre en un ritual de café.",
    profileUrl: "https://www.instagram.com/wacaco_official/",
    images: [
      ["assets/ambassador-nicolette-vertical.jpg", "Nicolette con una Minipresso en la montaña"],
      ["assets/ambassador-nicolette-6.jpg", "Nicolette preparando espresso bajo la luz del sol"],
      ["assets/ambassador-nicolette-2.jpg", "Pausa de café junto a un bosque"],
      ["assets/ambassador-nicolette-3.jpg", "Café en una cumbre nevada"],
      ["assets/ambassador-nicolette-4.jpg", "Preparación de espresso en el bosque"],
      ["assets/ambassador-nicolette-5.jpg", "Nicolette en un paisaje de nieve"],
    ],
  },
  {
    layout: "vissers",
    name: "Vissers",
    handle: "@brodievissers",
    platform: "YouTube",
    description: "Filmmaker y barista nómada que explora culturas del café alrededor del mundo.",
    profileUrl: "https://www.youtube.com/@BrodieVissers",
    images: [
      ["assets/ambassador-vissers-vertical.jpg", "Viajero tomando café frente a un paisaje abierto"],
      ["assets/ambassador-vissers-3.png", "Preparación de café sobre una montaña"],
      ["assets/ambassador-vissers-1.png", "Brodie Vissers en una plantación de café"],
      ["assets/ambassador-vissers-2.jpg", "Fotógrafo explorando un paisaje rocoso"],
      ["assets/ambassador-vissers-4.jpg", "Extracción de espresso con Minipresso"],
    ],
  },
];

const ambassadorDisplayOrder = [2, 3, 1, 0];

let activeAmbassador = 0;
let ambassadorTransitionTimer;

const renderAmbassador = (index) => {
  if (!ambassadorGallery) {
    return;
  }

  const ambassador = ambassadorProfiles[ambassadorDisplayOrder[index]];
  ambassadorGallery.dataset.layout = ambassador.layout;
  ambassadorGallery.innerHTML = ambassador.images.map(([src, alt]) => `
    <article class="ambassador-photo" tabindex="0">
      <img src="${src}" alt="${alt}" loading="lazy" decoding="async">
      <div class="ambassador-photo-info">
        <h3>${ambassador.name}</h3>
        <p class="ambassador-meta">${ambassador.platform} &middot; ${ambassador.handle}</p>
        <p class="ambassador-description">${ambassador.description}</p>
        <a class="ambassador-profile-link" href="${ambassador.profileUrl}" target="_blank" rel="noopener noreferrer">Ver perfil</a>
      </div>
    </article>
  `).join("");

  ambassadorGallery.querySelectorAll(".ambassador-photo").forEach((photo) => {
    photo.addEventListener("click", (event) => {
      if (desktopHoverQuery.matches || event.target.closest("a")) {
        return;
      }

      const wasVisible = photo.classList.contains("is-info-visible");
      ambassadorGallery.querySelectorAll(".is-info-visible").forEach((item) => {
        item.classList.remove("is-info-visible");
      });
      photo.classList.toggle("is-info-visible", !wasVisible);
    });
  });
};

const setActiveAmbassador = (index) => {
  if (!ambassadorGallery || index === activeAmbassador) {
    return;
  }

  window.clearTimeout(ambassadorTransitionTimer);
  ambassadorGallery.classList.add("is-switching");
  ambassadorTransitionTimer = window.setTimeout(() => {
    activeAmbassador = index;
    renderAmbassador(activeAmbassador);
    ambassadorDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeAmbassador;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
    requestAnimationFrame(() => ambassadorGallery.classList.remove("is-switching"));
  }, 250);
};

ambassadorDots.forEach((dot) => {
  dot.addEventListener("click", () => setActiveAmbassador(Number(dot.dataset.ambassadorIndex)));
});

ambassadorPrev?.addEventListener("click", () => {
  setActiveAmbassador((activeAmbassador - 1 + ambassadorDisplayOrder.length) % ambassadorDisplayOrder.length);
});

ambassadorNext?.addEventListener("click", () => {
  setActiveAmbassador((activeAmbassador + 1) % ambassadorDisplayOrder.length);
});

renderAmbassador(activeAmbassador);

const updateHero = () => {
  heroScrollCue?.classList.toggle("is-hidden", window.scrollY > 8);

  updateActiveHeaderLink();
  updateEmotionalWindow();
  updateExplodedMinipresso();
};

updateHero();
window.addEventListener("scroll", updateHero, { passive: true });
window.addEventListener("resize", updateHero);
