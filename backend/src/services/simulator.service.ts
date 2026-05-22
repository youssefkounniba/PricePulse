import cron from 'node-cron';
import { prisma } from '../utils/prisma';

export const startPriceSimulator = () => {
  // Run every 10 seconds for MVP demonstration purposes
  cron.schedule('*/10 * * * * *', async () => {
    console.log('Running price simulation...');
    try {
      const products = await prisma.product.findMany();
      
      for (const product of products) {
        // Randomly adjust price by -10% to +10%
        const changePercent = (Math.random() * 20 - 10) / 100;
        let newPrice = product.currentPrice * (1 + changePercent);
        
        // Prevent price from dropping below 1
        if (newPrice < 1) newPrice = 1;
        
        // Round to 2 decimal places
        newPrice = Math.round(newPrice * 100) / 100;

        if (newPrice !== product.currentPrice) {
          await prisma.$transaction([
            prisma.product.update({
              where: { id: product.id },
              data: { currentPrice: newPrice }
            }),
            prisma.historyRecord.create({
              data: {
                productId: product.id,
                price: newPrice
              }
            })
          ]);
          console.log(`Updated product ${product.name} to ${newPrice}`);
        }
      }
    } catch (error) {
      console.error('Error during price simulation:', error);
    }
  });
};
