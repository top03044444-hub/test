/* =======================================================================
   fx.js — 모든 페이지 공통 "잔잔한 연출"  (가벼운 버전)
   · 떠다니는 ♡·✦ 입자  · 클릭하면 하트  · 카드 살짝 기울기(데스크톱)
   ※ 무거운 효과(오로라/유리/blur) 없음 → 렉 거의 없음.
   ※ 전부 이 브라우저 안에서만 동작 → 서버/DB 트래픽 0.

   ▶ 사용법: 각 페이지 </body> 바로 위에 한 줄
       · 메인(루트):      <script src="fx.js"></script>
       · 서브폴더 페이지:  <script src="../fx.js"></script>
   ▶ 색은 페이지의 CSS 변수(--main)를 그대로 써서 다크모드까지 자동 적용.
   ======================================================================= */
(function () {
  var mqReduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqFine   = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- 공통 스타일 주입 ---------- */
  var css = `
    /* 빽빽한 정적 ♡벽 제거 (모든 페이지 공통) */
    body::before{ display:none !important; }

    /* 은은하게 천천히 떠다니는 입자 */
    #fx{ position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
    .fx-p{ position:absolute; top:-26px; color:var(--main); opacity:0;
           will-change:transform,opacity; animation:fxFall linear infinite; }
    @keyframes fxFall{
      0%{ transform:translateY(-26px) translateX(0) rotate(0); opacity:0; }
      12%{ opacity:.5; } 88%{ opacity:.4; }
      100%{ transform:translateY(103vh) translateX(var(--drift,20px)) rotate(210deg); opacity:0; }
    }

    /* 카드에 마우스 올리면 살짝 입체로 기울기 (데스크톱 마우스에서만) */
    .container, .wrap{ perspective:1300px; }
    .card{ transition:transform .25s ease, box-shadow .25s ease; will-change:transform; }
    .card.tilting{ box-shadow:0 14px 34px rgba(63,191,230,.22); }

    /* 클릭하면 하트가 살짝 떠오름 */
    .fx-heart{ position:fixed; z-index:500; pointer-events:none; color:var(--main);
               transform:translate(-50%,-50%); animation:fxHeart .95s ease-out forwards; }
    @keyframes fxHeart{
      0%{ opacity:0; transform:translate(-50%,-50%) scale(.4); }
      18%{ opacity:.85; }
      100%{ opacity:0; transform:translate(calc(-50% + var(--hx,0px)), calc(-50% - 62px)) scale(1.05); }
    }

    /* 움직임 줄이기 설정을 켠 사용자에겐 모션 끔 (멀미 방지) */
    @media (prefers-reduced-motion: reduce){
      #fx{ display:none; }
      .card{ transition:none; }
      .fx-heart{ display:none; }
    }
  `;
  var st = document.createElement('style');
  st.id = 'fx-style';
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- 레이어 만들기 + 카드 기울기 ---------- */
  function build() {
    // 입자
    if (!mqReduce) {
      var fx = document.getElementById('fx');
      if (!fx) {
        fx = document.createElement('div');
        fx.id = 'fx';
        fx.setAttribute('aria-hidden', 'true');
        document.body.appendChild(fx);
      }
      if (!fx.childElementCount) {
        var glyphs = ['♡', '✦', '♡', '✧', '♡', '✦'];   // ♡·✦ 위주로 우히 무드 유지
        for (var i = 0; i < 16; i++) {
          var p = document.createElement('span');
          p.className = 'fx-p';
          p.textContent = glyphs[(Math.random() * glyphs.length) | 0];
          var dur = 13 + Math.random() * 11;            // 13~24초 (느릿느릿)
          p.style.left = (Math.random() * 100).toFixed(2) + 'vw';
          p.style.fontSize = (9 + Math.random() * 7).toFixed(1) + 'px';
          p.style.animationDuration = dur.toFixed(1) + 's';
          p.style.animationDelay = (-Math.random() * dur).toFixed(1) + 's'; // 처음부터 흩뿌려진 상태로
          p.style.setProperty('--drift', (Math.random() * 60 - 30).toFixed(0) + 'px');
          fx.appendChild(p);
        }
      }
    }

    // 카드 입체 기울기 (데스크톱 마우스에서만)
    if (mqFine && !mqReduce) {
      document.querySelectorAll('.card').forEach(function (card) {
        if (card.dataset.fxTilt) return;
        card.dataset.fxTilt = '1';
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          var rx = (0.5 - (e.clientY - r.top) / r.height) * 5;  // 최대 ±5도
          var ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
          card.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
          card.classList.add('tilting');
        });
        card.addEventListener('mouseleave', function () {
          card.style.transform = '';
          card.classList.remove('tilting');
        });
      });
    }
  }

  /* ---------- 하트 뿌리기 (전역 공용) ---------- */
  window.fxHearts = function (x, y, n) {
    if (mqReduce) return;
    for (var i = 0; i < n; i++) {
      var h = document.createElement('span');
      h.className = 'fx-heart';
      h.textContent = '♡';
      h.style.left = x + 'px';
      h.style.top = y + 'px';
      h.style.fontSize = (12 + Math.random() * 8).toFixed(0) + 'px';
      h.style.setProperty('--hx', (Math.random() * 64 - 32).toFixed(0) + 'px');
      h.style.animationDelay = (Math.random() * 0.12).toFixed(2) + 's';
      document.body.appendChild(h);
      (function (el) { setTimeout(function () { el.remove(); }, 1200); })(h);
    }
  };

  // 클릭하면 하트 (입력창·버튼·링크·프사 위에선 생략)
  document.addEventListener('click', function (e) {
    if (e.target.closest('input, textarea, button, a, .iq-modal, .avatar-wrap')) return;
    window.fxHearts(e.clientX, e.clientY, 4);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
