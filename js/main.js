import ipads from '../data/ipads.js';
import navigations from '../data/navigations.js';

// 장바구니 버튼
// 장바구니 관련 요소 찾기
const basketStarterEl = document.querySelector('header .basket-starter')
const basketEl = basketStarterEl.querySelector('.basket')

basketStarterEl.addEventListener('click', event => {
  event.stopPropagation() // 이벤트 버블링 정지! - 버튼을 클릭했을 때 드롭다운 메뉴가 나타나야 함.
  if (basketEl.classList.contains('show')) {
    hideBasket()
  } else {
    showBasket()
  }
})
basketEl.addEventListener('click', event => {
  event.stopPropagation() // 이벤트 버블링 정지! - 드롭다운 메뉴 영역을 클릭했을 때 메뉴가 사라지지 않아야 함.
})
// 화면 전체를 클릭했을 때 메뉴가 사라짐.
window.addEventListener('click', () => {
  hideBasket()
})

// 특정 로직을 직관적인 함수 이름으로 묶음(추상화 시킴) -> 상위에 넣어서 가독성 높힘
function showBasket() {
  basketEl.classList.add('show')
}
function hideBasket() {
  basketEl.classList.remove('show')
}



// 검색!
// 검색 관련 요소 찾기
const headerEl = document.querySelector('header')
// 전개연산자 -> 얕은 복사 사용 배열에 담기
const headerMenuEls = [...headerEl.querySelectorAll('ul.menu > li')]

const searchWrapEl = headerEl.querySelector('.search-wrap')
const searchStarterEl = headerEl.querySelector('.search-starter')
const searchCloserEl = searchWrapEl.querySelector('.search-closer')
const searchShadowEl = searchWrapEl.querySelector('.shadow')

const searchInputEl = searchWrapEl.querySelector('input')
const searchDelayEls = [...searchWrapEl.querySelectorAll('li')]
const duration = .4 // 초(seconds) 단위, 시간을 변수에 저장해서 사용하면 쉽게 관리 용이


// 검색 아이콘 클릭 시 
searchStarterEl.addEventListener('click', showSearch)
searchCloserEl.addEventListener('click', event => {
  event.stopPropagation() // 데스크탑 레이아웃에서 클릭 이벤트가 버블링되어, 모바일 레이아웃에서 searchTextFieldEl가 클릭된 상태로 변하는 것을 방지
  hideSearch()
})
searchShadowEl.addEventListener('click', hideSearch)

// 추상화 서치창 보이기 
function showSearch() {
  headerEl.classList.add('searching')
  stopScroll()

  //애니메이션 효과 사라질 때 왼쪽에서 오른쪽
  headerMenuEls.reverse().forEach((el, index) => {
    el.style.transitionDelay = `${index * duration / headerMenuEls.length}s` // 순서 * 지연 시간 / 애니메이션할 요소 개수
  })

  //  애니메이션 효과 나타날 때 오른쪽에서 왼쪽
  // .reverse() 사용하지 않고 원래 순서대로 반복 처리.
  searchDelayEls.forEach((el, index) => {
    el.style.transitionDelay = `${index * duration / searchDelayEls.length}s`
  })
  
  // 검색 인풋 요소가 나타난 후 애니메이션 동작 0.6초 뒤에 동작
  setTimeout(() => {
    searchInputEl.focus()
  }, 600);
}

// 추상화 서치창 숨기기
function hideSearch() {
  headerEl.classList.remove('searching')
  playScroll()
  headerMenuEls.reverse().forEach((el, index) => {
    el.style.transitionDelay = `${index * duration / headerMenuEls.length}s`
  })
  searchDelayEls.reverse().forEach((el, index) => {
    el.style.transitionDelay = `${index * duration / searchDelayEls.length}s`
  })
  searchDelayEls.reverse() // 나타날 때 원래의 순서대로 처리해야 하기 때문에 다시 뒤집어서 순서 돌려놓기!
  searchInputEl.value = '' // 입력값 초기화
}



// 해더 메뉴 토글 [모바일]
const menuStarterEl = document.querySelector('header .menu-starter')
menuStarterEl.addEventListener('click', function(){
  if(headerEl.classList.contains('menuing')){
    headerEl.classList.remove('menuing')
    playScroll()
    basketStarterEl.style.visibility ='visible';
  }else{
    headerEl.classList.add('menuing')
    stopScroll()
    basketStarterEl.style.visibility ='hidden';
  }
})

// 네비게이션 메뉴 토글! [모바일]
const navEl = document.querySelector('nav')
const navMenuToggleEl = navEl.querySelector('.menu-toggler')
const navMenuShadowEl = navEl.querySelector('.shadow')
navMenuToggleEl.addEventListener('click', () => {
  if (navEl.classList.contains('menuing')) {
    hideNavMenu()
  } else {
    showNavMenu()
  }
})
navEl.addEventListener('click', event => {
  event.stopPropagation()
})
navMenuShadowEl.addEventListener('click', hideNavMenu)
window.addEventListener('click', hideNavMenu)
function showNavMenu() {
  navEl.classList.add('menuing')
}
function hideNavMenu() {
  navEl.classList.remove('menuing')
}



// 헤더 검색! [모바일]
const searchTextFieldEl = document.querySelector('header .textfield')
const searchCancelEl = document.querySelector('header .search-canceler')
searchTextFieldEl.addEventListener('click', () => {
  headerEl.classList.add('searching--mobile')
  searchInputEl.focus()
})
searchCancelEl.addEventListener('click', () => {
  headerEl.classList.remove('searching--mobile')
})

// 화면 크기가 달라졌을 때 검색 모드가 종료되도록 처리.
window.addEventListener('resize', event => {
  if (window.innerWidth <= 740) {
    headerEl.classList.remove('searching')
  } else {
    headerEl.classList.remove('searching--mobile')
  }
})



// 추상화 스크롤 창에서 메뉴 보일때 스크롤 정지 함수
function playScroll() {
  // documentElement is <html>
  document.documentElement.classList.remove('fixed')
}
function stopScroll() {
  document.documentElement.classList.add('fixed')
}

// 요소의 가시성 관찰
// 높이 값에 따라서 이미지 출력 
 const io = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if (!entry.isIntersecting){
      return
    }
    entry.target.classList.add('show')
  })
 })

 // 관찰할 요소들 검색
 const infoEls = document.querySelectorAll('.info')
//  관찰시작
 infoEls.forEach(function(el){
  io.observe(el)
 })

// 비디오 재생 
// Google 자동 재생 정책 확인! - https://developer.chrome.com/blog/autoplay/#audiovideo-elements
const video = document.querySelector('.stage video')
const playBtn = document.querySelector('.stage .controller--play')
const pauseBtn = document.querySelector('.stage .controller--pause')

playBtn.addEventListener('click',function () {
  video.play()
  playBtn.classList.add('hide');
  pauseBtn.classList.remove('hide');
})

pauseBtn.addEventListener('click',function () {
  video.pause()
  playBtn.classList.remove('hide');
  pauseBtn.classList.add('hide');
})


// ipad data 가져와서 연결하기 
const itemsEl = document.querySelector('section.compare .items')

// 렌더링 
ipads.forEach(function(ipad){
  const itemEl = document.createElement('div')
  itemEl.classList.add('item')
  
  // 컬러칩
  let colorList = ''
  ipad.colors.forEach(function(color) {
    colorList += `<li style="background-color: ${color};"></li>`
  })

// VS Code 확장 프로그램 설치 후 진행 - Comment tagged templates 
  itemEl.innerHTML = /*html*/ `
    <div class="thumbnail">
      <img src="${ipad.thumbnail}" alt="${ipad.name}">
    </div>
    <ul class="colors">
      ${colorList}
    </ul>
    <h3 class="name">${ipad.name}</h3>
    <p class="tagline">${ipad.tagline}</p>
    <p class="price">₩${ipad.price.toLocaleString('en-US')}부터</p>
    <button class="btn">구입하기</button>
    <a href="${ipad.price}" class="link">더 알아보기</a>
  `

  itemsEl.append(itemEl)
})

// 푸터 내비게이션 맵(map) 랜더링
const navigationsEl = document.querySelector('footer .navigations')
navigations.forEach(nav => {
  const mapEl = document.createElement('div')
  mapEl.classList.add('map')

  let mapList = ''
  nav.maps.forEach(map => {
    mapList += /* html */ `<li>
      <a href="${map.url}">${map.name}</a>
    </li>`
  })

  mapEl.innerHTML = /* html */ `
    <h3>
      <span class="text">${nav.title}</span>
      <span class="icon">+</span>
    </h3>
    <ul>
      ${mapList}
    </ul>
  `

  navigationsEl.append(mapEl)
})

// 올해 연도를 적용
const thisYearEl = document.querySelector('.this-year')
thisYearEl.textContent = new Date().getFullYear()

// 푸터 내비게이션 맵 아코디언
const mapEls = [...document.querySelectorAll('footer .navigations .map')]
mapEls.forEach(el => {
  const h3El = el.querySelector('h3')
  h3El.addEventListener('click', () => {
    el.classList.toggle('active')
  })
})
