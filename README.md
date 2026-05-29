# Navigate to your backend folder
cd C:/Users/THINKPAD/Downloads/appointment

# Create README file
cat > README.md << 'EOF'
# 📅 Appointment Booking System

A full-stack appointment booking system built with **Spring Boot** and **Angular**.

## ✨ Features

- 🔐 JWT Authentication & Authorization
- 👥 Role-based access (Patient, Provider, Admin)
- 📅 Book, confirm, and cancel appointments
- 📊 Dashboard with real-time statistics
- 🎨 Modern responsive UI with Angular Material

## 🛠️ Tech Stack

**Backend:**
- Spring Boot 3.x
- Spring Security with JWT
- MySQL Database
- Maven

**Frontend:**
- Angular 20
- Angular Material
- RxJS

## 📂 Repository Structure

| Branch | Content |
|--------|---------|
| `main` | Spring Boot Backend |
| `frontend` | Angular Frontend |

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

### Backend Setup
```bash
# Clone backend
git clone -b main https://github.com/farahtebbane7-hash/appointment-booking-system.git
cd appointment-booking-system

# Configure MySQL in application.properties
# Then run
mvn spring-boot:run
