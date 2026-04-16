# Project Diagrams

This file contains editable Mermaid diagrams for the Rent-A-Ride platform.

You can use these directly in:

- GitHub Markdown
- Documentation pages
- Presentation exports
- Mermaid Live Editor

## 1. System Architecture Diagram

```mermaid
flowchart LR
    A["User / Vendor / Admin"] --> B["React + Vite Frontend"]
    B --> C["Redux Toolkit Store"]
    B --> D["Express.js Backend API"]
    D --> E["MongoDB"]
    D --> F["Cloudinary"]
    D --> G["Firebase Auth"]
    D --> H["Razorpay"]
    D --> I["Nodemailer"]
```

## 2. Overall System Flowchart

```mermaid
flowchart TD
    A["Open Website"] --> B{"Select Role / Action"}
    B --> C["User Flow"]
    B --> D["Vendor Flow"]
    B --> E["Admin Flow"]

    C --> F["Browse Vehicles"]
    F --> G["Search / Filter / Sort"]
    G --> H["View Vehicle Details"]
    H --> I["Book Ride"]
    I --> J["Checkout / Payment"]
    J --> K["Booking Created"]
    K --> L["Orders Updated"]

    D --> M["Vendor Dashboard"]
    M --> N["Add / Edit / Delete Vehicle"]
    N --> O["Vehicle Visible After Approval"]
    M --> P["View Bookings"]
    P --> Q["Update Booking Status"]

    E --> R["Admin Dashboard"]
    R --> S["Manage Vehicles"]
    R --> T["Manage Users / Vendors"]
    R --> U["Review Vendor Requests"]
    R --> V["Manage Bookings"]
```

## 3. User Module Workflow

```mermaid
flowchart TD
    A["User Signup / Signin"] --> B["Home Page"]
    B --> C["Vehicle Listing"]
    C --> D["Apply Search / Filter / Sort"]
    D --> E["Open Vehicle Details"]
    E --> F["Book Ride"]
    F --> G["Checkout Page"]
    G --> H["Payment Page"]
    H --> I["Booking Saved in Database"]
    I --> J["Orders Page Updated"]
    J --> K["Profile / Orders Tracking"]
```

## 4. Database ER Diagram

```mermaid
erDiagram
    USER ||--o{ BOOKING : places
    VEHICLE ||--o{ BOOKING : assigned_to
    USER ||--o{ VEHICLE : adds
    MASTERDATA ||--o{ VEHICLE : supports

    USER {
        string username
        string email
        string password
        string phoneNumber
        string adress
        string profilePicture
        boolean isUser
        boolean isVendor
        boolean isAdmin
        string refreshToken
    }

    VEHICLE {
        string registeration_number
        string company
        string name
        string model
        number year_made
        string fuel_type
        number seats
        string transmition
        array image
        number price
        string base_package
        string car_type
        string district
        string location
        boolean isBooked
        boolean isAdminApproved
        boolean isAdminAdded
        string addedBy
        string isDeleted
    }

    BOOKING {
        objectId vehicleId
        objectId userId
        date pickupDate
        date dropOffDate
        string pickUpLocation
        string dropOffLocation
        number totalPrice
        string razorpayOrderId
        string razorpayPaymentId
        string status
        date createdAt
    }

    MASTERDATA {
        string id
        string district
        string location
        string type
        string model
        string variant
        string brand
    }
```

## 5. Login and Authentication Flow

```mermaid
flowchart TD
    A["User submits login form"] --> B["Frontend sends credentials to API"]
    B --> C["Backend verifies user in MongoDB"]
    C --> D{"Valid credentials?"}
    D -- No --> E["Return auth error"]
    D -- Yes --> F["Generate access token"]
    F --> G["Generate refresh token"]
    G --> H["Store refresh token in DB"]
    H --> I["Return user payload + tokens"]
    I --> J["Redux stores current user"]
    J --> K{"Role check"}
    K -- User --> L["Redirect to user pages"]
    K -- Vendor --> M["Redirect to vendor dashboard"]
    K -- Admin --> N["Redirect to admin dashboard"]
```

## 6. CRM Dashboard Overview

```mermaid
flowchart LR
    A["Admin Dashboard"] --> B["Users"]
    A --> C["Vendors"]
    A --> D["Vehicles"]
    A --> E["Bookings"]
    A --> F["Vendor Requests"]
    A --> G["Revenue / Summary Stats"]

    B --> B1["View all users"]
    C --> C1["View all vendors"]
    D --> D1["Add / Edit / Delete vehicles"]
    E --> E1["Change booking status"]
    F --> F1["Approve / Reject requests"]
    G --> G1["Live overview cards"]
```

## 7. Deployment Architecture (Vercel + Render)

```mermaid
flowchart LR
    U["Browser"] --> V["Vercel Frontend"]
    V --> R["Render Backend API"]
    R --> M["MongoDB Atlas"]
    R --> C["Cloudinary"]
    R --> F["Firebase"]
    R --> P["Razorpay"]
    R --> N["Nodemailer / SMTP"]
```

## Usage Notes

- These diagrams are editable and version-friendly.
- If you need presentation-ready exported PNGs, paste them into [Mermaid Live Editor](https://mermaid.live/) and export as image.
- If you want, these same diagrams can also be embedded into the main [README.md](../README.md).
