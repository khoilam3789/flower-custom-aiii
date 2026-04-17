# Flower Booth MERN

Project da duoc tach thanh 2 phan:

- `frontend`: React (Vite), su dung cac trang trong thu muc `Figma` qua routes + trang moi `/booth` de generate anh.
- `backend`: Node.js + Express + MongoDB + Sharp de tao anh bo hoa theo style 3D/lighting thong nhat.

## 1) Run backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API mac dinh: `http://localhost:5000`

## 2) Run frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend mac dinh: `http://localhost:5173`

## Routes

- `/booth`: Booth generator (upload hoa/la/tui, so luong, generate 1 nut)
- Cac trang Figma da duoc dua vao frontend: `/`, `/about`, `/custom-flowers`, `/custom-leaves`, `/custom-bags`, ...

## Generate flow

1. User them slot hoa/la va upload anh cho tung slot.
2. User nhap so luong cho tung slot.
3. User chon mau + shape tui, co the upload anh tui.
4. Bam `Generate`.
5. Backend dung Sharp de compose anh va luu vao `backend/uploads/generated`.
6. Backend luu metadata vao MongoDB (`generations` collection).

## Notes

- De render thanh cong cac class tu Figma, frontend dang giu nguyen JSX layout goc.
- Generator hien dang theo huong deterministic layout + dong nhat lighting, phu hop de giu style nhat quan.

## 3) Tài khoản Mẫu (Sample Accounts)

Dưới đây là một số tài khoản dùng thử nghiệm cho việc Đăng Nhập / Giỏ Hàng:

| Vai Trò | Email | Mật Khẩu |
| :--- | :--- | :--- |
| **Admin** | admin@flowerbooth.com | admin123 |
| **Khách Nhập** | khach@gmail.com | khach123 |

*(Lưu ý: Bạn có thể vào link `/register` để tự tạo thêm các tài khoản Khách hàng khác vô tư).*
