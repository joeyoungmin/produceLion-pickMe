import { slidesData } from "./slideData.js";

const circle = document.getElementById('circle');
const centerImage = document.getElementById('centerImage');
const airplane = document.querySelector('.move');
const airplaneSound = new Audio('./audio/99ED974F5CF009522F.mp3');
let currentIndex = 0;
airplaneSound.volume = 0.1;

// 원 반지름 설정
const radius = 120; // 원의 반지름
const total = slidesData.length; // 이미지 개수
const angleIncrement = (360 / total); // 각도 증가량

// 이미지 배치
circle.innerHTML = slidesData
  .map(
    (slide, index) => {
      const angle = angleIncrement * index; // 각 이미지의 각도
      const radians = (angle * Math.PI) // 180;
      const x = radius * Math.cos(radians); // x 좌표
      const y = radius * Math.sin(radians); // y 좌표

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

// 이미지 요소 가져오기
const images = Array.from(circle.querySelectorAll("img"));

// 중앙 이미지 업데이트
function updateCenterImage(index) {
  const selectedImage = images[index];
  centerImage.style.backgroundImage = `url(${selectedImage.src})`;
}

// 이미지 클릭 시 회전
images.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentIndex = index;
    updateCenterImage(index);

    // 회전 각도 계산
    const rotation = -angleIncrement * currentIndex;

    // 모든 이미지 회전
    images.forEach((image, i) => {
      const currentAngle = angleIncrement * i + rotation;
      const radians = (currentAngle * Math.PI) / 180;

      const x = radius * Math.cos(radians);
      const y = radius * Math.sin(radians);

      // 회전 및 재배치
      image.parentElement.style.transform = `
        translate(${x}px, ${y}px) rotate(${currentAngle}deg)
      `;
    });
  });
});

// 중앙 이미지 초기화
updateCenterImage(currentIndex);

// "Next" 버튼
document.getElementById("next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % total;
  images[currentIndex].click(); // 다음 이미지 클릭 효과
});

// "Previous" 버튼
document.getElementById("prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + total) % total;
  images[currentIndex].click(); // 이전 이미지 클릭 효과
});

// 비행기 애니메이션
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

// 중앙 이미지 클릭 시 비행기 애니메이션 실행
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

    const centerImageBackground = centerImage.style.backgroundImage.slice(5, -2); // "http://.../images/lion01.jpg"
    const relativePathStartIndex = centerImageBackground.indexOf('/images'); // "/images"를 기준으로 경로 추출
    const centerImagePath = '.' + centerImageBackground.slice(relativePathStartIndex); // "./images/lion01.jpg"
    
    const slideIndex = slidesData.findIndex(slide => {
      const slideImagePath = './' + slide.src.slice(slide.src.indexOf('images')); // "./images/lion01.jpg"
      return slideImagePath === centerImagePath;
    });

    if (slideIndex !== -1) {
      swiper.slideTo(slideIndex);
    }
  });
});