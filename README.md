# Banking Microservices System

Microservices-based banking system built with Spring Boot and Angular, implementing customer management, account operations, and transaction processing with event-driven architecture.

**Services:**
- **customer-service**: Customer management
- **account-service**: Accounts, transactions, and reporting
- **contracts**: Shared event definitions
- **frontend**: Angular UI for banking operations

## 🚀 Quick Start

### Prerequisites

- Docker Desktop 20.10+ or Docker Engine + Docker Compose
- (Optional) Java 21+ and Node.js 20+ for local development

### Start All Services

```bash
# Clone and navigate to project
git clone https://github.com/jonant7/banking-system

# Navigate to project
cd banking-system

# Start with Docker Compose
docker compose up --build -d

# Verify services are running
docker compose ps

# Check health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
```

**Access:**
- Frontend: http://localhost:4200
- Customer API: http://localhost:8081/api/v1
- Account API: http://localhost:8082/api/v1
- RabbitMQ Management: http://localhost:15672 (guest/guest)

## 🗂️ Project Structure

```
banking-system/
├── backend/
│   ├── contracts/              # Shared event contracts
│   ├── customer-service/       # Customer bounded context
│   └── account-service/        # Account bounded context
├── frontend/                   # Angular application
├── postman/                    # API test collection
└── compose.yaml                # Docker orchestration
```

### Testing with Postman

Import the collection from `postman/Banking-Microservices.postman_collection.json` for health check API testing.

## 🛠️ Development

### Backend

See [backend/README.md](backend/README.md) for:
- Hexagonal architecture details
- Local development setup
- Testing strategy
- Database migrations with Flyway

### Frontend

See [frontend/README.md](frontend/README.md) for:
- Angular standalone components architecture
- Development server setup
- Testing with Jest

## 🔧 Technology Stack

**Backend:**
- Java 21, Spring Boot 3.5.9
- PostgreSQL 17.6, Flyway migrations
- RabbitMQ 3.13 for event streaming
- Gradle composite build

**Frontend:**
- Angular 20 with standalone components
- TypeScript 5.9, RxJS 7.8
- Jest for unit testing
- Nginx for production deployment

## 🐳 Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Clean restart (removes volumes)
docker compose down -v
docker compose up --build -d

# Connect to database
docker compose exec customer-db psql -U postgres -d customer_db
docker compose exec account-db psql -U postgres -d account_db
```

## 🗄️ Database

Each service has its own PostgreSQL database with automated Flyway migrations:

- **customer_db** (Port 5432): Customer and person entities
- **account_db** (Port 5433): Account and transaction entities

Schema changes are version-controlled in `src/main/resources/db/migration/`.

---

**Built with ☕ Java 21 | 🅰️ Angular 20 | 🐘 PostgreSQL 17 | 🐰 RabbitMQ 3.13**