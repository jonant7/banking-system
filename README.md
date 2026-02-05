# Banking Microservices System

Microservices-based banking system built with Spring Boot and Angular, implementing customer management, account operations, and transaction processing with event-driven architecture.

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  Frontend   │────►│   Customer   │────►│ PostgreSQL │
│  (Angular)  │     │   Service    │     │ (Port 5432)│
└─────────────┘     │  (Port 8081) │     └────────────┘
      │             └──────┬───────┘
      │                    │
      │               ┌────▼─────┐
      │               │ RabbitMQ │
      │               │  Events  │
      │               └────┬─────┘
      │                    │
      │             ┌──────▼───────┐     ┌────────────┐
      └────────────►│   Account    │────►│ PostgreSQL │
                    │   Service    │     │ (Port 5433)│
                    │  (Port 8082) │     └────────────┘
                    └──────────────┘
```

**Services:**

- **customer-service**: Customer management and authentication
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

## 🗄️ Database Management with Flyway

**No manual SQL execution required!** All database schemas, tables, and data structures are automatically managed by Flyway migrations.

### How It Works

Each service includes Flyway for automatic database versioning:

- **customer_db** (Port 5432): Customer and person entities
- **account_db** (Port 5433): Account and transaction entities

### Migration Process

When services start, Flyway automatically:
1. Creates the database schema if it doesn't exist
2. Runs all pending migration scripts in version order
3. Tracks executed migrations in `flyway_schema_history` table
4. Ensures database is always in sync with application code

### Migration Files Location

All migrations are version-controlled SQL scripts:
```
backend/customer-service/src/main/resources/db/migration/
backend/account-service/src/main/resources/db/migration/
```

### Key Benefits

✅ **Zero manual setup**: No need to run SQL scripts manually  
✅ **Version control**: Database changes tracked in Git  
✅ **Repeatable**: Same migrations across all environments  
✅ **Rollback safe**: Database state is consistent and traceable  
✅ **Team collaboration**: No conflicts with schema changes  

### Viewing Migration Status
```bash
# Check migration history in customer database
docker compose exec customer-db psql -U postgres -d customer_db \
  -c "SELECT version, description, installed_on FROM flyway_schema_history;"

# Check migration history in account database
docker compose exec account-db psql -U postgres -d account_db \
  -c "SELECT version, description, installed_on FROM flyway_schema_history;"
```

---

**Built with ☕ Java 21 | 🅰️ Angular 20 | 🐘 PostgreSQL 17 | 🐰 RabbitMQ 3.13**
