# 서곱철 공식 팬페이지

## 배포 전 필수 체크

### 1. Supabase
1. New project 생성
2. Settings → API 에서 `프로젝트 ID` / `anon public 키` 복사
3. SQL Editor 에 `supabase_전체.sql` 전체 붙여넣고 Run

### 2. 값 채우기 ✅ 완료
`supabase.js` + `overlay/index.html` 모두 아래 값으로 채워져 있습니다.
- 프로젝트 ID: `evuszheracvnzjtbzxec`
- anon 키: 주입 완료

### 2-1. ⚠️ RLS (보안) — 배포 후 권장
anon 키 + 열린 RLS 조합이라 **누구나 쓰기 가능한 상태**입니다.
운영 시작 후 Supabase SQL Editor에서 쓰기 정책을 `authenticated` 로 좁히고,
Supabase 유저 1개를 만들어 admin 로그인에 붙이는 걸 권장합니다.

### 3. 관리자 비밀번호
`admin/index.html` 의 `const PASSWORD = '1234'` — **임시 비번입니다.**
소스에 그대로 노출되므로 **다른 곳에서 안 쓰는 버리는 비번**으로 바꾸세요.
찾는 법: `admin/index.html` 에서 `PASSWORD` 검색.

### 4. GitHub → Cloudflare Pages
- 이 폴더 전체를 repo 루트에 업로드 (`fx.js` 는 루트)
- Cloudflare Pages → Connect to Git → 빌드 설정 비움(Framework = None) → Deploy

### 5. GitHub Secrets (Supabase 자동 일시정지 방지)
Settings → Secrets → Actions 에 추가:
- `SUPABASE_URL` = `https://xxxx.supabase.co`
- `SUPABASE_ANON` = anon 키

### 6. SOOP 게시글 삽입
```html
<iframe height="2400" scrolling="no" src="배포주소" style="width:100%;border:0;display:block;"></iframe>
```

---

## 폴더 구조
```
index.html   style.css   supabase.js   fx.js
profile/     schedule/   notice/   work/   dress/
admin/       overlay/
supabase_전체.sql
.github/workflows/keep-alive.yml
```

## 색상
| 변수 | 라이트 | 다크 |
|---|---|---|
| `--main` | `#F4C2C2` | `#F4C2C2` |
| `--main-dark` | `#C4586E` | `#FFA9BC` |
| `--main-light` | `#FCE8E8` | `#3E2E33` |
| `--bg` | `#FBEAEA` | `#251D20` |
| `--card` | `#FFFFFF` | `#332A2C` |

색을 바꿀 땐 **`index.html` `:root`** 와 **`style.css` `:root`** 두 곳을 같이 수정하세요.

## 연출 (fx.js)
```js
var FX_FLOAT = ['🩷','✦','🩷','✧','🩷','✦'];
var FX_CLICK = '🩷';
var FX_COUNT = 14;
var FX_TILT  = true;
```

## 관리자 프로필 키 (§2-B.1 동기화됨)
`avatar, soop-id, info-name, info-catchphrase, info-debut, info-birth, info-fandom, info-agency, info-position, info-mbti, info-game, info-team, info-song, info-content, info-tags, quote, msg, now, tmi-food, tmi-song, tmi-book, days, link-soop, link-youtube, link-x, link-cafe`

죽은 필드 0개 확인 완료.
