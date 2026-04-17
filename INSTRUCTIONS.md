# INSTRUCTIONS.md

## 1) Context cot loi

### Muc tieu project
Flower Booth MERN: website thiet ke bo hoa/tui qua, cho phep nguoi dung upload anh hoa/la/tui, nhap so luong, chon mau + dang tui, sau do backend render anh compositing (Sharp) va luu metadata vao MongoDB.

Use case chinh:
- Frontend booth page (`/booth`) de tao anh preview.
- Backend API tao anh va luu lich su generation.
- Cac trang legacy tu Figma duoc giu de dieu huong noi dung website.

### Tech Stack
Backend:
- Node.js (ESM)
- Express
- MongoDB + Mongoose
- Sharp (image composition)
- uuid
- cors, dotenv

Frontend:
- React 18 + Vite
- React Router DOM
- Tailwind CSS

### Naming Conventions
Tong quat:
- JavaScript theo camelCase cho bien/ham: `connectDb`, `composeBoothImage`, `buildPayload`.
- Component/Model theo PascalCase: `BoothPage`, `Header`, `Footer`, `Generation`.
- File route/service/config backend theo camelCase: `generationRoutes.js`, `imageComposer.js`, `db.js`.
- Legacy page file front-end giu naming kebab-case theo Figma: `custom-flowers.jsx`, `payment-success.jsx`.

Frontend:
- React component function: PascalCase.
- State hooks: camelCase, co tien to ro nghia (`flowers`, `leaves`, `loading`, `result`).
- Route path: kebab-case (`/custom-flowers`, `/payment-success`).

Backend:
- API prefix: `/api/...`
- Response loi dung key `message`.
- Schema field dung tieng Anh, lowercase camelCase (`outputImagePath`, `bagColor`).

## 2) Tai lieu ky thuat va API

### Base URL
- Local backend: `http://localhost:5000`
- Local frontend: `http://localhost:5173`

### Endpoints chinh

#### 2.1 Health check
- Method: `GET`
- URL: `/api/health`
- Response 200 sample:

```json
{
  "ok": true
}
```

#### 2.2 Tao anh generation
- Method: `POST`
- URL: `/api/generate`
- Content-Type: `application/json`

Request sample:

```json
{
  "flowers": [
    {
      "label": "Hong do",
      "quantity": 3,
      "image": "data:image/png;base64,iVBORw0KGgo..."
    }
  ],
  "leaves": [
    {
      "label": "La bach dan",
      "quantity": 2,
      "image": "data:image/png;base64,iVBORw0KGgo..."
    }
  ],
  "bag": {
    "label": "Tui qua",
    "shape": "classic",
    "color": "#c58f64",
    "image": "data:image/png;base64,iVBORw0KGgo..."
  }
}
```

Response 201 sample:

```json
{
  "_id": "661e...",
  "flowers": [
    { "label": "Hong do", "quantity": 3 }
  ],
  "leaves": [
    { "label": "La bach dan", "quantity": 2 }
  ],
  "bagColor": "#c58f64",
  "bagShape": "classic",
  "outputImagePath": "/uploads/generated/6c1c...-....png",
  "createdAt": "2026-04-16T10:00:00.000Z",
  "updatedAt": "2026-04-16T10:00:00.000Z"
}
```

Error 500 sample:

```json
{
  "message": "Cannot generate image"
}
```

#### 2.3 Lay lich su generation
- Method: `GET`
- URL: `/api/generate`
- Mo ta: lay 20 ban ghi moi nhat, sap xep `createdAt` giam dan.

Response 200 sample:

```json
[
  {
    "_id": "661e...",
    "flowers": [{ "label": "Hong do", "quantity": 3 }],
    "leaves": [{ "label": "La bach dan", "quantity": 2 }],
    "bagColor": "#c58f64",
    "bagShape": "classic",
    "outputImagePath": "/uploads/generated/6c1c...png",
    "createdAt": "2026-04-16T10:00:00.000Z",
    "updatedAt": "2026-04-16T10:00:00.000Z"
  }
]
```

### Logic nghiep vu dac thu

#### 1) Frontend build payload
- User upload file image -> chuyen sang Data URI Base64 (`toBase64`).
- Bo qua item khong co imageFile.
- Quantity duoc ep min = 1.
- Validate toi thieu 1 anh hoa truoc khi goi API.

#### 2) Backend compose image (Sharp)
- Canvas co dinh: `1024 x 1024`.
- Nen gradient + ve hinh tui bang SVG theo `bagShape`:
  - `classic`
  - `round`
  - `square`
- Co the overlay anh mat tui (`bag.image`) vao khu vuc trung tam tui.
- Expand danh sach hoa/la theo quantity:
  - Neu hoa quantity = 3 -> lap 3 item anh vao danh sach render.
- Resize va normalize tung asset:
  - Flower size ~160
  - Leaf size ~130
  - Co modulate brightness/saturation + sharpen
- Dat vi tri theo cong thuc deterministic (khong random):
  - Leaves: `left = 250 + ((i * 71) % 500)`, `top = 260 + floor(i/7) * 55`
  - Flowers: `left = 220 + ((i * 83) % 560)`, `top = 220 + floor(i/6) * 70`
- Them shadow ellipse cuoi cung va xuat PNG.

#### 3) Persist metadata
- Luu collection `generations` voi thong tin:
  - flowers/leaves (chi luu `label`, `quantity`)
  - bagColor, bagShape
  - outputImagePath
- Khong luu full Base64 image vao MongoDB.

### So do logic don gian (text)

| Step | Input | Xu ly | Output |
|---|---|---|---|
| 1 | File uploads tu UI | `toBase64()` + build payload | JSON POST `/api/generate` |
| 2 | Payload flowers/leaves/bag | `composeBoothImage()` bang Sharp | File PNG trong `uploads/generated` |
| 3 | Metadata generation | `Generation.create()` | Document MongoDB |
| 4 | Document vua tao | Tra ve HTTP 201 | Frontend nhan `outputImagePath` va render preview |

## 3) Cau truc thu muc & file

Cau truc thuc te (rut gon, giu phan quan trong):

```text
/
  context.md
  README.md
  INSTRUCTIONS.md
  backend/
    server.js
    package.json
    src/
      app.js
      config/
        db.js
      models/
        Generation.js
      routes/
        generationRoutes.js
      services/
        imageComposer.js
  frontend/
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
    public/
      images/
        AboutUS/
        CustomizeHoa/
        Customizela/
        customizethiep/
        customtui/
        FAQ/
        home/
        Login/
    src/
      api.js
      App.jsx
      main.jsx
      styles.css
      components/
        layout/
          Header.jsx
          Footer.jsx
      pages/
        BoothPage.jsx
        legacy/
          about-us.jsx
          blog-1.jsx
          blog-2.jsx
          blog-3.jsx
          cart.jsx
          custom-bags.jsx
          custom-cards.jsx
          custom-flowers.jsx
          custom-leaves.jsx
          faq.jsx
          home.jsx
          login.jsx
          payment-card.jsx
          payment-cod.jsx
          payment-qr.jsx
          payment-success.jsx
          payment.jsx
          story.jsx
```

## 4) Huong dan de AI coding dung ngu canh

Khi prompt AI trong repo nay, nen kem theo:
- Muc tieu task cu the (VD: them endpoint xoa generation, sua UI booth, toi uu compose).
- File can sua uu tien (VD: `backend/src/routes/generationRoutes.js`).
- Quy uoc khong duoc pha vo:
  - Giu ESM (`import/export`).
  - Giu style dat ten nhu tren.
  - Khong thay doi route cu trinh khi chua co migration plan.
- Neu task lien quan den image composition: yeu cau AI bao toan output `outputImagePath` va schema `Generation` hien tai.
