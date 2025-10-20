# Final-Project-C4EJS160
# EduPress — Online Learning Platform
- Một website học trực tuyến hiện đại được xây dựng bằng HTML, CSS và JavaScript.
---
## 1. Giới thiệu dự án
**EduPress** là website học trực tuyến giúp người dùng:
- Đăng ký, đăng nhập & quên mật khẩu tài khoản học viên.
- Xem danh sách chi tiết từng khóa học và danh sách khóa học đã đăng ký.
- Thiết kế theo hướng responsive, hoạt động mượt mà trên desktop, tablet và mobile.
---
## 2. Cấu trúc thư mục dự án
Final-Project-C4EJS160/
│
├── HomePage/
│ └── style.css
│ └── index.js 
│ └── header
│ └── banner
│ └── topcat
│ └── featured
│ └── grow
│ └── footer
├── CourseListing/
│ ├── style.css
│ └── index.js
│
├── CourseSingle/
│ ├── style.css
│ └── index.js
│
├── CourseSingle2/
│ ├── coursesingle2.html
│ ├── style.css
│ └── index.js
│
├── LoginRegister/
│ ├── login.html
│ ├── style.css
│ └── index.js
├── index.html
├── courselisting.html
├── coursesingle.html
├── enrollments.js # Quản lý danh sách khóa học đã đăng ký
├── README.md # File mô tả dự án
---
## 3. Công nghệ sử dụng
Công nghệ Mô tả
**HTML** Xây dựng khung nội dung trang
**CSS** Thiết kế bố cục giao diện
**JavaScript** Xử lý logic giao diện và dữ liệu
**LocalStorage** Lưu thông tin người dùng và khóa học đã đăng ký
**Responsive Design** Tự động điều chỉnh giao diện trên mọi thiết bị
---
## 4. Các trang chính & chức năng
### Home Page (`/index.html`)
- Hiển thị banner giới thiệu.
- Danh mục các khóa học nổi bật.
- Thống kê và testimonials.
### Course Listing (`/courselisting.html`)
- Hiển thị toàn bộ danh sách khóa học.  
- Có thanh tìm kiếm và bộ lọc (category, rating, price, v.v).  
- Người dùng có thể chọn khóa học để xem chi tiết.
- Nút để đăng ký khóa học
### Course Single (`/coursesingle.html`)
- Trang chi tiết khóa học: mô tả, thời lượng, giảng viên, đánh giá.  
- Nút để vào học khóa học.
### Course Single 2 (`/CourseSingle2/coursesingle2.html`)
### Login / Register (`/LoginRegister/login.html`)
- Form đăng nhập và đăng ký học viên.  
- Dữ liệu lưu bằng LocalStorage.  
### Enrollments (`/enrollments.js`)
- Hiển thị danh sách các khóa học mà học viên đã đăng ký.  
- Dữ liệu được lấy từ LocalStorage.  
- Có thể mở khóa học đã đăng ký để xem lại nội dung.
---
## 5. Cách chạy dự án
1. Cài extension Live Server trên VS Code.
2. Mở file `Final-Project-C4EJS60/index.html` → chuột phải → chọn **Open with Live Server.

Đặng Tấn Thành
Email: dangtanthanh2202@gmail.com
GitHub: https://github.com/TanThanh222/Final-Project-C4EJS160.git
Dự án học tập trong khóa: C4EJS160 — MindX Class