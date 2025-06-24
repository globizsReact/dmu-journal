# Dhanamanjuri University (DMU) Journals Portal

This is a comprehensive, multi-tenant journal management platform built with Next.js in Firebase Studio. It provides distinct portals for Authors, Reviewers, and Administrators to manage the entire lifecycle of academic publications.

## Key Features

### Public-Facing Portal
- **Homepage**: An engaging landing page showcasing journal categories and key announcements.
- **Dynamic Category Pages**: Browse published articles within specific journal categories (e.g., Sciences, Humanities).
- **Article View**: Read published articles with details like abstracts, authors, and keywords.
- **Global Search**: Instantly find articles by title, author, or content.
- **Static Content Pages**: Informative sections for About Us, FAQ, Publication & Ethics Policies.

### Author Dashboard
- **Secure Author Login/Signup**: A dedicated portal for authors to manage their work.
- **Multi-Step Manuscript Submission**: An intuitive, step-by-step process for submitting new manuscripts, including file uploads.
- **Track Submissions**: Authors can view a list of their submitted manuscripts and monitor their current status (e.g., Submitted, In Review, Accepted).
- **Profile Management**: Authors can update their personal information and change their account password.

### Reviewer Dashboard
- **Secure Reviewer Login/Signup**: Reviewers can sign up, with accounts pending admin approval.
- **Manuscript Review Panel**: A central dashboard for reviewers to view and manage assigned manuscripts.
- **Update Status**: Reviewers can update the status of a manuscript through the review process.

### Admin Panel
- **Secure Admin Login**: A separate, protected login for administrators.
- **Dashboard Overview**: A central hub with key statistics like total users, pending manuscripts, and total journals.
- **User Management**:
    - View, add, edit, and delete user accounts across all roles.
    - Approve or deny pending reviewer registrations.
- **Journal Category Management**:
    - Create, update, and delete journal categories.
    - Upload thumbnail images for each category directly to Amazon S3.
    - Reorder categories to control their display on the homepage.
- **Manuscript Management**:
    - View all manuscripts submitted to the platform with pagination.
    - Access detailed manuscript information.
    - Update the status of any manuscript (e.g., Accept, Suspend, Publish).

### Technical Stack
- **Framework**: Next.js (App Router)
- **UI**: ShadCN UI & Tailwind CSS
- **Database**: Prisma ORM
- **Authentication**: JWT-based with role-based access control (RBAC)
- **File Storage**: Amazon S3 for image and manuscript uploads

---

## S3 Bucket Configuration

To enable image uploads to your Amazon S3 bucket, you need to configure two settings in your AWS Management Console.

### 1. CORS Configuration

Your website needs permission to upload files to your S3 bucket from the browser.

1.  Navigate to your S3 bucket in the AWS Console.
2.  Go to the **Permissions** tab.
3.  Scroll down to the **Cross-origin resource sharing (CORS)** section and click **Edit**.
4.  Copy the entire content of the `S3_CORS_CONFIGURATION.json` file from this project's root directory and paste it into the editor.
5.  Save the changes.

### 2. Bucket Policy for Public Access

For the images to be viewable in your application after being uploaded, they need to be publicly accessible.

1.  In the same **Permissions** tab for your S3 bucket, scroll to the **Bucket policy** section and click **Edit**.
2.  **Important:** In the "Block public access (bucket settings)" section above the policy editor, make sure "Block all public access" is turned **OFF**. AWS will show a warning, which is expected.
3.  Copy the entire content of the `S3_BUCKET_POLICY.json` file from this project's root directory and paste it into the policy editor.
4.  Save the changes.
