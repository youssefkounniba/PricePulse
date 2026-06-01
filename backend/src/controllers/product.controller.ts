import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { fetchRainforestProductData } from '../services/rainforest.service';

const addProductSchema = z.object({
  url: z.string().url(),
});

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        history: {
          orderBy: { date: 'desc' },
          take: 10
        }
      }
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = addProductSchema.parse(req.body);
    
    const existingProduct = await prisma.product.findUnique({
      where: { url: data.url }
    });
    
    if (existingProduct) {
      return res.status(409).json({ message: 'Product already being tracked' });
    }

    // Fetch initial data from Rainforest API
    const { price, name } = await fetchRainforestProductData(data.url);

    const product = await prisma.product.create({
      data: {
        url: data.url,
        name: name,
        initialPrice: price,
        currentPrice: price,
      }
    });

    res.status(201).json(product);
  } catch (error: any) {
    if (error.message) {
      if (error.message.includes('RAINFOREST_API_KEY')) {
        return res.status(500).json({ message: 'Server is missing RAINFOREST_API_KEY' });
      }
      if (error.message.includes('API Error:')) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message.includes('Network error:')) {
        return res.status(503).json({ message: error.message });
      }
      if (error.message.includes('Rainforest API Error:')) {
         return res.status(400).json({ message: error.message });
      }
    }
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.product.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
