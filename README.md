# Train-Titan

## Project Overview
This project focuses on developing a state-of-the-art Fitness Tracker platform using the MERN stack (MongoDB, Express.js, React.js, Node.js). This platform will empower users to track their fitness progress, set personalized goals, and connect with a dynamic fitness community.

---

## Live Demo 🌐
[Live Demo Link](https://fitness-tracker49.web.app)

---

## Purpose
The purpose of this project is to create an innovative fitness tracker platform that helps users monitor their health, set goals, and stay motivated, while fostering a supportive and interactive fitness community. The platform aims to empower individuals to lead healthier, more active lives through technology-driven solutions.

**This project serves as a learning platform to implement various full-stack development techniques including database interaction, form handling, and role based user authentication.**

---

## Key Features
---

**Admin Features**

The **Admin** has full control over user management, financials, and class creation:

### 1. **Newsletter Subscribers**
   - View all newsletter subscribers in a table.

### 2. **All Trainers**
   - View and manage trainers.
   - **Delete Trainer:** Revert a trainer to a regular member.
   
### 3. **Applied Trainers**
   - View trainer applications.
   - **Confirm:** Approve and convert an applicant to a trainer.
   - **Reject:** Remove an applicant from the list.

### 4. **Balance Overview**
   - View **Total Balance** and the last six booking transactions.
   - Visualize **Total Subscribers vs Paid Members** with charts.

### 5. **Add New Class**
   - Add new classes with a form that includes class name, image, details, and more.

---
**Trainer Features**

The **Trainer** has access to manage slots and forums, and view their schedule:

### 1. **Manage Slots**
   - View all available slots in a table.
   - If a slot is booked, see details about the booking and who reserved the slot.
   - **Delete Slot:** Delete a slot with a confirmation prompt.
   
### 2. **Add New Slot**
   - Fill out a form to add new slots with:
     - **Slot Name** (e.g., morning slot)
     - **Slot Time** (e.g., 1 hour)
     - **Classes** (Select from classes added by the Admin)
     
   

### 3. **Add New Forum**
   - Trainers can add new forums to the **Community/Forums** page.
   - Admin and Trainer have the same permissions for adding and viewing forums.

---

**Member Features**

The **Member** has access to their personal details, application status, and trainer bookings:

### 1. **Activity Log**
   - View the status of trainer applications (e.g., **Pending**, **Rejected**).
   - **Eye Icon:** Click to view rejection feedback in a modal.
   - Once approved, the member’s role will change to **Trainer**, and they will no longer have access to this page.

### 2. **Profile Page**
   - Manage account details, including:
     - **Name**
     - **Profile Picture**
     - **Email** (cannot be edited)
     - **Last Login Status**
   - Edit other personal information.

### 3. **Booked Trainer**
   - View details about the trainer and their classes:
     - **Trainer Info**
     - **Classes Info**
     - **Slot Info**
   - **Review Button:** Provide feedback via a modal with:
     - **Textarea** for written feedback
     - **Star Rating** system
   - Submit reviews, which are stored and displayed in the **Testimonials** section.



---

## Technologies & Concepts Used

### Frontend Concepts
- **React.js**: Component-based UI development.
- **React Router**: For dynamic routing and private route protection.
- **Responsive Design**: Ensuring cross-device compatibility.
- **React Toastify and Others npm packages**: User-friendly notifications and apply many npm packages.
- **Environment Variables**: Secure Firebase & authentication keys.
- **CSS Frameworks**: Tailwind CSS for consistent styling.

### Backend Concepts
- **Node.js**: Server-side runtime environment.
- **Express.js**: Backend framework for routing and middleware.
- **MongoDB**: Database for storing user data.
- **JWT Authentication**: Secure token-based route protection.
- **Environment Variables**: Secure MongoDB credentials.

### Additional Concepts
- Real-time updates with MongoDB's `$inc` operator and many more operators.
- Modular code structure with meaningful commits.
- Deployment to production-grade environments.

---

## Here are some common npm packages that have been utilized in the project.
- **react-router-dom**: Routing in React.
- **react-toastify**: Toast notifications.
- **react-rating-stars-component**: Review rating functionality.
- **dotenv**: Secure environment variable management.
- **jsonwebtoken**: Token-based authentication.
- **express**: Backend framework.
- **mongoose**: MongoDB object modeling.
- **cors**: Handling cross-origin requests.

---

## ⚙️ Installation and Setup

To get started with the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/NajibHossain49/Train-Titan.git

   cd Train-Titan
   
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---



## Challenging Tasks 🎁

### 🚀 **Search Functionality (All Classes Page)**
   - Implement a **case-insensitive** search for classes by name, handled from the **backend**.

### 🚀 **Community/Forums Page - Admin/Trainer Badge**
   - Display a **badge** for admin/trainer posts, using an icon or custom design.

### 🚀 **Admin Reject Trainer Action**
   - On rejection, show a **modal** with the applicant’s info and editable feedback. Remove the applicant from the "Applied Trainer" list after submission.

### 🚀 **Private Routes Authorization 🔐**
   - Implement **JWT authentication** for private routes, store the token in **localStorage**, and handle **401** and **403** errors for unauthorized access.


---

## 🧑‍💻 Author

Developed with ❤️ by **Najib Hossain**  
[GitHub](https://github.com/NajibHossain49) | [LinkedIn](https://www.linkedin.com/in/md-najib-hossain)

## 🌟 Show Your Support

If you like this project, please ⭐ the repository and share it with others!

