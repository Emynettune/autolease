# AutoLease ER Diagram

```mermaid
erDiagram
    USER ||--o| WALLET : has
    USER ||--o{ VEHICLE : owns
    USER ||--o{ BOOKING : makes
    USER ||--o{ REVIEW : writes
    USER ||--o{ BANK_ACCOUNT : has
    USER ||--o{ WITHDRAWAL : requests
    USER ||--o{ REFRESH_TOKEN : has

    WALLET ||--o{ WALLET_TRANSACTION : contains

    VEHICLE ||--o{ VEHICLE_IMAGE : has
    VEHICLE ||--o{ BOOKING : receives
    VEHICLE ||--o{ REVIEW : receives

    BOOKING ||--|| PAYMENT : has
    BOOKING ||--o| REVIEW : may_have

    WITHDRAWAL }o--|| BANK_ACCOUNT : uses

    USER {
        uuid id PK
        string firstName
        string lastName
        string email UK
        string password
        string googleId
        enum role
        enum status
        boolean isEmailVerified
        boolean isOwnerVerified
    }

    WALLET {
        uuid id PK
        uuid userId FK UK
        decimal availableBalance
        decimal pendingBalance
    }

    WALLET_TRANSACTION {
        uuid id PK
        uuid walletId FK
        enum type
        decimal amount
        decimal balanceAfter
        string reference
    }

    VEHICLE {
        uuid id PK
        uuid ownerId FK
        string brand
        string model
        int year
        string vin UK
        enum engineType
        enum fuelType
        enum transmission
        decimal dailyPrice
        enum status
        boolean isAvailable
        decimal averageRating
    }

    VEHICLE_IMAGE {
        uuid id PK
        uuid vehicleId FK
        string url
        string publicId
        boolean isPrimary
    }

    BOOKING {
        uuid id PK
        uuid customerId FK
        uuid vehicleId FK
        date startDate
        date endDate
        int totalDays
        decimal totalAmount
        enum status
    }

    PAYMENT {
        uuid id PK
        uuid bookingId FK UK
        decimal amount
        enum status
        string paystackReference
    }

    BANK_ACCOUNT {
        uuid id PK
        uuid userId FK
        string bankName
        string accountNumber
        string accountName
        boolean isVerified
    }

    WITHDRAWAL {
        uuid id PK
        uuid userId FK
        uuid bankAccountId FK
        decimal amount
        enum status
    }

    REVIEW {
        uuid id PK
        uuid customerId FK
        uuid vehicleId FK
        uuid bookingId FK UK
        int rating
        string comment
    }

    REFRESH_TOKEN {
        uuid id PK
        uuid userId FK
        string token UK
        timestamp expiresAt
        boolean isRevoked
    }

    AUDIT_LOG {
        uuid id PK
        uuid userId
        string action
        string entity
        jsonb metadata
    }
```

## Relationships Summary

| Type | Relationship |
|------|-------------|
| One-to-One | User ↔ Wallet, Booking ↔ Payment, Booking ↔ Review |
| One-to-Many | User → Vehicles, Bookings, Reviews, BankAccounts, Withdrawals |
| Many-to-One | Vehicle → Owner (User), Booking → Customer, Booking → Vehicle |
| Many-to-Many | N/A (reviews link customer-vehicle via booking) |

## Indexes

- `users.email` (unique)
- `vehicles.vin` (unique)
- `vehicles.ownerId`
- `bookings.customerId`, `bookings.vehicleId`
- `payments.paystackReference`
- `refresh_tokens.token` (unique)
