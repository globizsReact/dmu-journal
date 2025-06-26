import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const faqSections = [
  {
    title: "For Authors",
    items: [
      {
        question: "How Do I Submit A Manuscript?",
        answer: "To submit a manuscript, please navigate to the 'Submit Manuscript' section in your author dashboard. Follow the instructions provided, upload your manuscript file, and fill in the required metadata. Ensure your manuscript adheres to our formatting guidelines.",
      },
      {
        question: "How Do I Check Status Of A Manuscript?",
        answer: "You can check the status of your submitted manuscript by logging into your author dashboard and visiting the 'My Manuscripts' section. The current status (e.g., Under Review, Revisions Required, Accepted) will be displayed next to each submission.",
      },
      {
        question: "How To Send A Message To The Editorial Office?",
        answer: "You can send a message to the editorial office through the contact form available on the journal's specific page or via the contact details provided in the 'Contact Us' section of our website.",
      },
      {
        question: "How Do I Send A Message To Help Desk?",
        answer: "For technical support or help desk inquiries, please visit our 'Support Center' page where you can find contact options or a form to submit your query.",
      },
      {
        question: "How Do I Change My Password Or Update My Profile?",
        answer: "To change your password or update your profile information, log in to your author dashboard and look for the 'View/Edit Profile' section. You will find options to update your personal details and change your password there.",
      },
      {
        question: "How Do I Make Payment?",
        answer: "On the left side menu on the Author's page, click the 'Make Payment' button. A list of payments due would be loaded. Please note, this only displays if you have outstanding payments.",
      }
    ],
  },
  {
    title: "For Editors",
    items: [
      {
        question: "How Do I Become An Editor?",
        answer: "If you are interested in becoming an editor for one of our journals, please visit the 'Editorial Board' section on the respective journal's page for information on how to apply or express your interest. Typically, this involves submitting your CV and a cover letter.",
      },
      {
        question: "How Do I Change My Password Or Update My Profile?",
        answer: "Visit this page to access the login page for editors. Once logged in, you should find options to manage your profile and password settings within your editor dashboard.",
      },
      {
        question: "How Do I Download Original Manuscript, Revised Manuscript, And Reviewers Comments?",
        answer: "As an editor, you can download manuscripts and reviewer comments from the editorial management system. After logging in, navigate to the assigned manuscript to find download links for all relevant files.",
      },
      {
        question: "How Do I Make A Decision On A Manuscript?",
        answer: "After reviewing the manuscript and the comments from reviewers, you can submit your editorial decision (e.g., Accept, Reject, Revisions Required) through the editorial management system. Clear instructions are usually provided within the system.",
      },
    ],
  },
  {
    title: "For Reviewers",
    items: [
      {
        question: "How Do I Join The Editorial Board?",
        answer: "To join the editorial board or become a reviewer, please check the 'Join Us' or 'Reviewer Guidelines' section on our website. You may need to submit an application or register your areas of expertise.",
      },
      {
        question: "How Can I Send A Message To The Editorial Office?",
        answer: "Click here to view a list of mail addresses for all editorial offices. Alternatively, use the contact forms available on the journal websites.",
      },
      {
        question: "How Do I Submit My Evaluation Of A Manuscript?",
        answer: "When you are invited to review a manuscript, you will receive instructions and a link to our peer review system. You can submit your evaluation, comments, and recommendation through this system.",
      },
      {
        question: "I Have Been Invited To Review A Manuscript, How Do I Login Into The System?",
        answer: "The invitation email you received should contain a link and credentials to log into the peer review system. If you have trouble logging in, please contact the editorial office for assistance.",
      },
    ],
  },
];

// Helper to convert plain text to Tiptap JSON format
function textToJson(text: string) {
    return {
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text: text,
                    },
                ],
            },
        ],
    };
}


async function main() {
  console.log('Start seeding FAQs...');

  // Using a transaction to ensure atomicity
  await prisma.$transaction(async (tx) => {
    // Check if seeding is necessary
    const categoryCount = await tx.faqCategory.count();
    if (categoryCount > 0) {
      console.log('FAQ categories already exist. Skipping seed.');
      return;
    }

    console.log('No existing FAQ data found. Seeding...');

    for (const [categoryIndex, section] of faqSections.entries()) {
      const category = await tx.faqCategory.create({
        data: {
          title: section.title,
          order: categoryIndex,
        },
      });
      console.log(`Created category: ${category.title}`);

      for (const [itemIndex, item] of section.items.entries()) {
        await tx.faqItem.create({
          data: {
            question: item.question,
            answer: textToJson(item.answer),
            order: itemIndex,
            categoryId: category.id,
          },
        });
      }
      console.log(`- Created ${section.items.length} items for ${category.title}`);
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
