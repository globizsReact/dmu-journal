
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

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
