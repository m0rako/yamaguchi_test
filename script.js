document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.section__page');
    const items = document.querySelectorAll('.sidebar__item');
    const section = document.querySelector('.section');
    const list = document.querySelector('.sidebar__list');
    if (!pages.length || !items.length || !section || !list) return;

    const itemsMap = new Map();
    items.forEach(item => {
        itemsMap.set(Number(item.dataset.slide), item);
    });

    let activeSlide = 1;
    const total = items.length;

    function normalize(num) {
        if (num < 1) return num + total;
        if (num > total) return num - total;
        return num;
    }

    function updateSidebar(newActive) {
        const fragment = document.createDocumentFragment();

        items.forEach(item => {
            item.classList.remove('sidebar__item--active');
        });

        // Элементы добавляются в порядке -2, -1, 0, 1, 2 для CSS nth-child
        for (let offset = -2; offset <= 2; offset++) {
            const slideNum = normalize(newActive + offset);
            const item = itemsMap.get(slideNum);
            if (!item) continue;

            if (offset === 0) {
                item.classList.add('sidebar__item--active');
            }

            fragment.appendChild(item);
        }

        list.appendChild(fragment);
        activeSlide = newActive;
    }

    items.forEach(item => {
        item.addEventListener('click', () => {
            const slideId = Number(item.dataset.slide);
            const targetPage = document.querySelector(`.section__page[data-slide="${slideId}"]`);
            if (targetPage) {
                targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const slideNum = Number(entry.target.dataset.slide);
                if (slideNum && slideNum !== activeSlide) {
                    updateSidebar(slideNum);
                }
            }
        });
    }, { root: section, threshold: 0.5 });

    pages.forEach(page => observer.observe(page));
    updateSidebar(activeSlide);
});

