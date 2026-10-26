# Project Plan: Internship & Job Listing Portal

This document outlines the architecture, features, data structure, and flow for the **Internship & Job Listing Portal** project. It is written in simple terms for beginners.

---

## Tech Stack
- **Frontend:** React.js (user interface)
- **Backend:** Node.js + Express.js (server and API logic)
- **Database:** MongoDB (data storage)

---

## 1. List of Pages

### User Pages
1. **Opportunities Page (Home):** Where users can see all available internships and jobs, search, and filter by domain.
2. **Opportunity Details Page:** Shows full details of a specific job or internship with an option to apply.
3. **Application Form:** A simple form where users fill out their contact details and submit their application.
4. **Application Confirmation Page:** A confirmation screen showing that the application was successfully submitted.

### Admin Pages
1. **Admin Opportunities Dashboard:** A dashboard where the admin can see all listings, with options to add, edit, or delete them.
2. **Add / Edit Opportunity Page:** A form used by the admin to create a new opportunity or update an existing one.
3. **View Applications Page:** A page where the admin can view all submitted applications from candidates.

---

## 2. User Features

- **View Opportunities:** Browse through the list of all available internships and job openings.
- **Search Opportunities:** Search for specific job titles or keywords.
- **Filter by Domain:** Filter the list of listings based on field/domain (for example: Web Development, Design, Marketing).
- **View Opportunity Details:** Click on a listing to read full information such as job description, location, and requirements.
- **Submit Application:** Fill in the application form to apply for a chosen opportunity.
- **Display Application Confirmation:** Receive instant confirmation on screen after successfully submitting the application.

---

## 3. Admin Features

- **Add Opportunity:** Create and publish a new job or internship listing.
- **Edit Opportunity:** Update details of an existing listing (e.g., change description, update location).
- **Delete Opportunity:** Remove a listing that is no longer active.
- **View Applications:** View all applications submitted by applicants for different opportunities.

---

## 4. Opportunity Data Fields

Each opportunity stored in MongoDB has the following fields:

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `title` | String | Job/Internship title (e.g., "Frontend Developer Intern") |
| `companyName` | String | Name of the hiring company |
| `domain` | String | Field/Category (e.g., "Software Development", "Design") |
| `location` | String | Job location (e.g., "Remote", "Bangalore") |
| `experience` | String | Required experience level (e.g., "Fresher", "0-1 years") |
| `description` | String | Detailed information about roles and responsibilities |
| `applicationLink` | String | External link to company career page or relevant site |

---

## 5. Application Data Fields

Each candidate application stored in MongoDB has the following fields:

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `opportunityId` | String / ObjectId | ID of the opportunity the candidate is applying for |
| `applicantName` | String | Full name of the applicant |
| `email` | String | Email address of the applicant |
| `phone` | String | Contact phone number |
| `resumeLink` | String *(optional)* | Link to resume (Google Drive link, portfolio link, etc.) |
| `submittedAt` | Date | Date and time when the application was submitted |

---

## 6. REST API List

### Opportunities APIs
- `GET /api/opportunities`
  - **Purpose:** Fetch all opportunities (supports search and domain filtering).
- `POST /api/opportunities`
  - **Purpose:** Create a new opportunity (Admin).
- `GET /api/opportunities/:id`
  - **Purpose:** Fetch details of a single opportunity by its ID.
- `PUT /api/opportunities/:id`
  - **Purpose:** Update an existing opportunity by ID (Admin).
- `DELETE /api/opportunities/:id`
  - **Purpose:** Delete an opportunity by ID (Admin).

### Applications APIs
- `POST /api/applications`
  - **Purpose:** Submit a new candidate application.
- `GET /api/applications`
  - **Purpose:** Retrieve all submitted applications (Admin).

---

## 7. Application Flow Diagram

```
+-----------------------------------------------------------------------+
|                              USER FLOW                                |
+-----------------------------------------------------------------------+
                                  |
                                  v
                    [ Opportunities Page (Home) ]
                                  |
           +----------------------+----------------------+
           |                                             |
           v                                             v
 [ Search Opportunities ]                       [ Filter by Domain ]
           |                                             |
           +----------------------+----------------------+
                                  |
                                  v
                    [ Opportunity Details Page ]
                                  |
                                  v
                       [ Submit Application ]
                                  |
                                  v
                   [ Application Confirmation Page ]


+-----------------------------------------------------------------------+
|                             ADMIN FLOW                                |
+-----------------------------------------------------------------------+
                                  |
                                  v
                         [ Admin Dashboard ]
                                  |
      +---------------------------+---------------------------+
      |                           |                           |
      v                           v                           v
[ Add Opportunity ]     [ Edit/Delete Opportunity ]   [ View Applications ]
      |                           |                           |
      v                           v                           v
(Saved to Database)      (Updated/Deleted in DB)      (Fetched from DB)
```
