import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';

const addProductSchema = z.object({
  url: z.string().url(),
  name: z.string().min(1),
  initialPrice: z.number().positive(),
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

    const product = await prisma.product.create({
      data: {
        url: data.url,
        name: data.name,
        initialPrice: data.initialPrice,
        currentPrice: data.initialPrice,
      }
    });

    res.status(201).json(product);
  } catch (error) {
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
