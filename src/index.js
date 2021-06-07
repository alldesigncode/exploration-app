import { gsap } from "gsap";
import { Flip } from "../Flip";
import { articles } from "./articles";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(Flip, ScrollToPlugin);

const details = document.querySelector(".detail"),
  detailImage = document.querySelector(".detail > img"),
  detailAuthor = document.querySelector(".detail .author");

let mid = Math.floor(articles.length / 2),
  disabled = false;

function initializeArticles() {
  const articleList = gsap.utils.toArray(".article");
  articleList[mid].classList.add("active");
  gsap.to("body", {
    background: articles[mid].color,
    ease: "power2.inOut",
    duration: 0.8,
  });

  for (let s = 0, i = mid - 1; i >= 0; i--) {
    s += 1;
    gsap.set(articleList[i], {
      translateX: -(1000 * s),
      transformOrigin: "top",
      scale: "0.6",
    });
  }

  for (let t = 0, j = mid + 1; j <= articles.length; j++) {
    t += 1;
    gsap.set(articleList[j], {
      translateX: 1000 * t,
      transformOrigin: "bottom",
      scale: "0.6",
    });
  }

  document.addEventListener("keydown", (e) => !disabled && move(e));
  articleList.forEach((a) =>
    a.addEventListener("click", () => !disabled && showDetails(a))
  );
}

function generateArticles() {
  const container = document.querySelector(".exploration");
  articles.forEach((a) => container.appendChild(createArticle(a)));
}

function createArticle(articleData) {
  const article = document.createElement("div"),
    title = document.createElement("title"),
    author = document.createElement("author"),
    img = document.createElement("img");
  article.classList.add("article");
  title.classList.add("title");
  author.classList.add("author");
  article.setAttribute("data-color", articleData.color);
  img.src = articleData.url;
  title.textContent = articleData.title;
  author.textContent = articleData.desc;
  article.appendChild(title);
  article.appendChild(img);
  article.appendChild(author);

  return article;
}

function move(e) {
  const artilceList = gsap.utils.toArray(".article");
  if (artilceList.some((s) => s.classList.contains("active"))) {
    mid = artilceList.findIndex((s) => s.classList.contains("active"));
  }

  // prevent moving items if detail is open
  if (!activeItem) {
    switch (e.key) {
      case "ArrowLeft":
        moveLeft(artilceList);
        break;
      case "ArrowRight":
        moveRight(artilceList);
        break;
    }
  }
}

function moveLeft(artilceList) {
  if (!artilceList[mid - 1]) {
    return;
  }

  disabled = true;

  for (let i = 0; i < mid; i++) {
    const a = artilceList[i];
    gsap.to(a, {
      translateX: gsap.getProperty(a, "translateX") + 1000,
      transformOrigin: "top",
      scale: "0.6",
      duration: 0.8,
      ease: "power2.inOut",
    });
  }

  gsap.to(artilceList[mid - 1], {
    translateX: gsap.getProperty(artilceList[mid - 1], "translateX") + 1000,
    transformOrigin: "initial",
    scale: "1",
    ease: "power2.inOut",

    duration: 0.8,
    onComplete: () => (disabled = false),
  });

  artilceList[mid].classList.remove("active");
  artilceList[mid - 1].classList.add("active");
  gsap.to("body", {
    background: articles[mid - 1].color,
    ease: "power2.inOut",
    duration: 0.8,
  });

  for (let i = mid; i < artilceList.length; i++) {
    gsap.to(artilceList[i], {
      translateX: gsap.getProperty(artilceList[i], "translateX") + 1000,
      transformOrigin: "bottom",
      scale: "0.6",
      ease: "power2.inOut",
      duration: 0.8,
    });
  }
}

function moveRight(artilceList) {
  if (!artilceList[mid + 1]) {
    return;
  }

  disabled = true;

  for (let i = 0; i <= mid; i++) {
    const a = artilceList[i];
    gsap.to(a, {
      translateX: gsap.getProperty(a, "translateX") - 1000,
      transformOrigin: "top",
      scale: "0.6",
      duration: 0.8,
      ease: "power2.inOut",
    });
  }

  gsap.to(artilceList[mid + 1], {
    translateX: gsap.getProperty(artilceList[mid - 1], "translateX") + 1000,
    transformOrigin: "initial",
    scale: "1",
    ease: "power2.inOut",

    duration: 0.8,
    onComplete: () => (disabled = false),
  });

  artilceList[mid].classList.remove("active");
  artilceList[mid + 1].classList.add("active");
  gsap.to("body", {
    background: articles[mid + 1].color,
    ease: "power2.inOut",
    duration: 0.8,
  });

  for (let i = mid + 2; i < artilceList.length; i++) {
    const a = artilceList[i];
    const prop = gsap.getProperty(a, "translateX");
    gsap.to(a, {
      translateX: prop - 1000,
      scale: "0.6",
      ease: "power2.inOut",

      duration: 0.8,
    });
  }
}

let activeItem; // keeps track of which item is open

function showDetails(e) {
  // select only active item
  if (!e.classList.contains("active")) {
    return;
  }

  if (activeItem) {
    return hideDetails();
  }
  const onLoad = () => {
    gsap.to(detailAuthor, {
      scale: 1.3,
      ease: "power2.inOut",
    });

    // position the details on the position of the active item
    Flip.fit(details, e);

    // record the state
    const state = Flip.getState(details);

    // set the final state
    gsap.set(document.querySelector(".detail"), { clearProps: true }); // wipe out all inline stuff so it's in the native state (not scaled)
    gsap.set(details, {
      visibility: "visible",
      overflow: "hidden",
      top: "0%",
      width: "100%",
      height: "100%",
      ease: "power2.inOut",
      backgroundColor: e.dataset.color,
      scrollTo: { y: 0, x: 0 },
    });

    gsap.to(detailImage, {
      height: "80%",
      ease: "power2.inOut",
    });
    gsap.to(detailAuthor, {
      top: "40%",
      ease: "power2.inOut",
    });

    // add state transition
    Flip.from(state, {
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => gsap.set(details, { overflow: "auto" }), // to permit scrolling if necessary
    }).to(".detail p", { autoAlpha: 1, stagger: 0.15 });

    detailImage.removeEventListener("load", onLoad);
    document.addEventListener("click", hideDetails);
  };

  detailImage.src = e.children[1].src;
  detailAuthor.textContent = e.children[2].textContent;
  detailImage.addEventListener("load", onLoad);

  activeItem = e;
}

function hideDetails() {
  document.removeEventListener("click", hideDetails);
  gsap.to(detailAuthor, {
    top: "50%",
    scale: 1,
    delay: 0.2,
    ease: "power2.inOut",
  });
  gsap.to(".detail p", { autoAlpha: 0 });

  const state = Flip.getState(details);

  // scale details down so that its detailImage fits exactly on top of activeItem
  Flip.fit(details, activeItem);
  gsap.to(detailImage, {
    height: "100%",
    delay: 0.2,
    ease: "power2.inOut",
  });

  gsap.to(details, {
    delay: 0.2,
    scrollTo: { y: 0, x: 0 },
  });

  // animate from the original state to the current one.
  Flip.from(state, {
    duration: 0.5,
    ease: "power2.inOut",
    delay: 0.2,
    onComplete: () => (activeItem = null),
  }).set(details, { clearProps: true });
}

window.addEventListener("load", () => {
  gsap.to([".user-info", ".exploration"], {
    autoAlpha: 1,
    delay: 0.2,
    duration: 0.2,
  });
  generateArticles();
  initializeArticles();
});
