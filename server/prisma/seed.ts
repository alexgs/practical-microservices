/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const video0 = await prisma.video.create({
    data: {
      title: 'Getting Started with Diffendoofer',
      description: 'Diffendoofer is the new hotness in devops. Now it\'s easier than ever to kwigger your snuvs and lerkims. Learn how to make Diffendoofer work for you!',
    }
  });
  const video1 = await prisma.video.create({
    data: {
      title: 'Make a Thneed from Your Own Truffula Tree',
      description: 'Everyone needs a thneed! Learn how to make your own in this easy-to-follow video tutorial.',
    }
  })
  const video2 = await prisma.video.create({
    data: {
      title: 'Building Sneetches with Oobleck',
      description: 'Oobleck is the perfect language for beginners. Start your career as an Oobleck developer by learning how to build Sneetches like you use every day.'
    }
  });
  console.log([video0, video1, video2]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
