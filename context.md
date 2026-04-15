# Project Context - Flower Booth MERN

## Muc tieu san pham
Xay dung app MERN cho phep tao anh bo hoa bang 1 booth:
- Upload anh hoa, la, tui
- Them/xoa slot cho hoa va la
- Dieu chinh so luong tung loai
- Chon mau + hinh dang tui
- Bam 1 nut Generate de tao anh ket qua
- Anh ket qua giu style nhat quan (3D feel + lighting dong nhat)

## Cau truc thu muc
- frontend: React + Vite
- backend: Node.js + Express + MongoDB + Sharp
- Figma: bo file JSX thiet ke goc

## Trang frontend
- Trang booth moi: /booth
- Cac trang Figma da convert thanh React pages va dat ten tieng Anh trong frontend/src/pages/legacy:
  - about-us.jsx
  - blog-1.jsx
  - blog-2.jsx
  - blog-3.jsx
  - cart.jsx
  - custom-flowers.jsx
  - custom-leaves.jsx
  - custom-cards.jsx
  - custom-bags.jsx
  - faq.jsx
  - home.jsx
  - login.jsx
  - payment.jsx
  - payment-card.jsx
  - payment-cod.jsx
  - payment-qr.jsx
  - payment-success.jsx
  - story.jsx

## Routing hien tai
Dinh nghia tai frontend/src/App.jsx:
- /
- /about
- /blog-1
- /blog-2
- /blog-3
- /cart
- /custom-flowers
- /custom-leaves
- /custom-cards
- /custom-bags
- /faq
- /login
- /payment
- /payment-card
- /payment-cod
- /payment-qr
- /payment-success
- /story
- /booth

## Backend API
Dinh nghia tai backend/src/routes/generationRoutes.js:
- POST /api/generate
  - Input JSON:
    - flowers: [{ label, quantity, image }]
    - leaves: [{ label, quantity, image }]
    - bag: { label, shape, color, image }
  - image la base64 data URL
  - Ket qua:
    - Tao file anh trong backend/uploads/generated
    - Luu metadata vao MongoDB collection generations
    - Tra ve object generation co outputImagePath

- GET /api/generate
  - Lay 20 ban ghi generate moi nhat

- GET /api/health
  - Kiem tra backend song

## Engine generate anh
File backend/src/services/imageComposer.js:
- Dung Sharp de compose background + tui + la + hoa
- Tui:
  - Ho tro shape: classic, round, square
  - Ho tro mau tui tu color picker
  - Neu co upload anh tui, anh duoc blend vao vung tui
- La va hoa:
  - Moi item duoc expand theo quantity
  - Dat vi tri theo pattern deterministic
  - Co resize, sharpen, modulate de giu style dong nhat

## Du lieu va DB
Model tai backend/src/models/Generation.js:
- flowers: [{ label, quantity }]
- leaves: [{ label, quantity }]
- bagColor
- bagShape
- outputImagePath
- timestamps

## Bien moi truong
Backend:
- PORT
- MONGO_URI
- CLIENT_ORIGIN

Frontend:
- VITE_API_URL

## Cach chay nhanh
Backend:
1. cd backend
2. npm install
3. tao file .env (neu chua co)
4. npm run dev

Frontend:
1. cd frontend
2. npm install
3. tao file .env (neu chua co)
4. npm run dev

## Trang thai hien tai
- Frontend build thanh cong
- Backend syntax check thanh cong
- Da doi ten file legacy sang tieng Anh

## Luu y cho lan chat tiep theo
Neu can tiep tuc cong viec, co the tham chieu file nay de giam token:
- Neu sua UI booth: vao frontend/src/pages/BoothPage.jsx + frontend/src/styles.css
- Neu sua API/generate: vao backend/src/routes/generationRoutes.js
- Neu sua logic compose anh: vao backend/src/services/imageComposer.js
- Neu sua route page: vao frontend/src/App.jsx
