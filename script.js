const linkConfig = {
    whatsapp: "",
    instagram: "",
    reviews: "",
    privacy: ""
};

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
const anchorLinks = document.querySelectorAll("a[href]");
const pendingLinks = document.querySelectorAll("[data-link-key]");
const revealElements = document.querySelectorAll(".reveal, .animate-on-scroll");

function syncHeaderState() {
    if (!header) {
        return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 100);
    header.classList.toggle("scrolled", window.scrollY > 100);
}

function closeMenu() {
    if (!menuToggle || !nav) {
        return;
    }

    menuToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    header?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
}

function openMenu() {
    if (!menuToggle || !nav) {
        return;
    }

    menuToggle.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
    header?.classList.add("is-open");
    document.body.classList.add("menu-open");
}

function configureLinks() {
    pendingLinks.forEach((link) => {
        const key = link.dataset.linkKey;
        const url = linkConfig[key];

        if (url) {
            link.href = url;
            link.target = "_blank";
            link.rel = "noreferrer";
            link.classList.remove("is-pending");
            return;
        }

        link.classList.add("is-pending");
        link.removeAttribute("target");
        link.removeAttribute("rel");
    });
}

function observeReveals() {
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
        });
    }, {
        rootMargin: "0px 0px -100px 0px",
        threshold: 0.1
    });

    revealElements.forEach((element) => {
        observer.observe(element);
    });
}

syncHeaderState();
configureLinks();
observeReveals();

window.addEventListener("scroll", syncHeaderState, { passive: true });

menuToggle?.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";

    if (expanded) {
        closeMenu();
        return;
    }

    openMenu();
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});

anchorLinks.forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");

        if (!href || !href.startsWith("#") || href === "#") {
            return;
        }

        const target = document.querySelector(href);

        if (!target) {
            return;
        }

        event.preventDefault();
        closeMenu();

        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    });
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
        closeMenu();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});
