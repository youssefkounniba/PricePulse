import cron from 'node-cron';
import { prisma } from '../utils/prisma';
import { fetchRainforestProductData } from './rainforest.service';

export const startPriceSimulator = () => {
  // Run every 10 minutes for MVP, as Rainforest API free tier is limited
  cron.schedule('*/10 * * * *', async () => {
    console.log('Running price tracking job via Rainforest API...');
    try {
      const products = await prisma.product.findMany();
      
      for (const product of products) {
        try {
          const { price: newPrice } = await fetchRainforestProductData(product.url);
          
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
            console.log(`Updated product ${product.name} to ${newPrice} from Rainforest API`);
          } else {
            console.log(`Price for ${product.name} has not changed (${newPrice})`);
          }
        } catch (apiError: any) {
          console.error(`Failed to fetch price for ${product.name}:`, apiError.message);
        }
      }
    } catch (error) {
      console.error('Error during price tracking job:', error);
    }
  });
};
