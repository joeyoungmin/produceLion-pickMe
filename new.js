import { slidesData } from "./slideData.js";

const circle = document.getElementById('circle');
const centerImage = document.getElementById('centerImage');
const airplane = document.querySelector('.move');
const airplaneSound = new Audio('./audio/99ED974F5CF009522F.mp3');
let currentIndex = 0;
airplaneSound.volume = 0.1;

const radius = 120;
const total = slidesData.length;
const angleIncrement = (360 / total);

circle.innerHTML = slidesData
  .map(
    (slide, index) => {
      const angle = angleIncrement * index;
      const radians = (angle * Math.PI)
      const x = radius * Math.cos(radians);
      const y = radius * Math.sin(radians);

      return `
        <li style="
          position: absolute;
          transform: translate(${x}px, ${y}px) rotate(${angle}deg);
          transform-origin: center center;
        ">
          <img src="${slide.src}" alt="${slide.alt}" data-id="${slide.id}" />
        </li>
      `;
    }
  )
  .join("");

const images = Array.from(circle.querySelectorAll("img"));

function updateCenterImage(index) {
  const selectedImage = images[index];
  centerImage.style.backgroundImage = `url(${selectedImage.src})`;
}

images.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentIndex = index;
    updateCenterImage(index);

    const rotation = -angleIncrement * currentIndex;

    images.forEach((image, i) => {
      const currentAngle = angleIncrement * i + rotation;
      const radians = (currentAngle * Math.PI) / 180;

      const x = radius * Math.cos(radians);
      const y = radius * Math.sin(radians);

      image.parentElement.style.transform = `
        translate(${x}px, ${y}px) rotate(${currentAngle}deg)
      `;
    });
  });
});

updateCenterImage(currentIndex);

document.getElementById("next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % total;
  images[currentIndex].click();
});

document.getElementById("prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + total) % total;
  images[currentIndex].click();
});

function moveAirplane() {
  return new Promise((resolve) => {
    airplane.style.top = '-2000px';
    airplane.style.transition = 'top 5s ease';

    airplane.addEventListener('transitionend', function () {
      airplane.style.transition = 'none';
      airplane.style.top = '10000px';
      resolve();
    }, { once: true });
  });
}

centerImage.addEventListener('click', function () {
  airplaneSound.play();

  moveAirplane().then(() => {
    const container = document.createElement('div');
    container.id = 'swiper-container';
    container.style.position = 'absolute';
    container.style.zIndex = '1000';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

    document.body.appendChild(container);

    const swiperHTML = `
      <div style="--swiper-navigation-color: #fff; --swiper-pagination-color: #fff" class="swiper mySwiper">
        <div class="parallax-bg" style="background-image: url(https://swiperjs.com/demos/images/nature-1.jpg); data-swiper-parallax="-23%"></div>
        <div class="swiper-wrapper">
          ${slidesData.map((slide, index) => `
            <div class="swiper-slide" style="background-image: url('./images/lion0${index + 1}.jpg');">
              <div class="title" data-swiper-parallax="-300">${slide.title}</div>
              <br />
              <div class="subtitle" data-swiper-parallax="-200">${slide.subtitle}</div>
              <div class="text" data-swiper-parallax="-100">
                <p>${slide.text}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </div>
    `;

    const con = document.getElementById('swiper-container');
    con.innerHTML = swiperHTML;

    const swiper = new Swiper('.mySwiper', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });

    const closeBtn = document.createElement('button');
    closeBtn.id = 'closeSwiper';
    closeBtn.textContent = 'Close';
    closeBtn.style.position = 'fixed';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.backgroundColor = 'red';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.padding = '10px 20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '1001';

    closeBtn.addEventListener('click', () => {
      document.body.removeChild(container);
    });

    container.appendChild(closeBtn);
const centerImageBackground = getComputedStyle(centerImage).backgroundImage;

if (!centerImageBackground || centerImageBackground === 'none') {
} else {
  const centerImagePath = './' + centerImageBackground.slice(centerImageBackground.lastIndexOf('/') + 1, -2);
  const slideIndex = slidesData.findIndex(slide => {
    const slideImagePath = './' + slide.src.slice(slide.src.lastIndexOf('/') + 1);
    return slideImagePath === centerImagePath;
  });
}
  });
});