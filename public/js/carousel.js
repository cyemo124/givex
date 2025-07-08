const slider = document.querySelector(".slider");

if (slider) {
    const totalItems = parseInt(getComputedStyle(slider).getPropertyValue("--quantity"));
    let position = 0;
    let interval;

    function updateCarousel() {
        const angle = position * (360 / totalItems);
        slider.style.transform = `perspective(1000px) rotateY(-${angle}deg)`;
    }

    function next() {
        position = (position + 1) % totalItems;
        updateCarousel();
    }

    function prev() {
        position = (position - 1 + totalItems) % totalItems;
        updateCarousel();
    }

    document.getElementById("next")?.addEventListener("click", () => {
        next();
        resetAutoplay();
    });

    document.getElementById("prev")?.addEventListener("click", () => {
        prev();
        resetAutoplay();
    });

    function startAutoplay() {
        interval = setInterval(next, 4000);
    }

    function resetAutoplay() {
        clearInterval(interval);
        startAutoplay();
    }

    document.querySelectorAll(".item").forEach((item) => {
        item.addEventListener("mouseenter", () => clearInterval(interval));
        item.addEventListener("mouseleave", () => startAutoplay());
    });

    updateCarousel();
    startAutoplay();
}
