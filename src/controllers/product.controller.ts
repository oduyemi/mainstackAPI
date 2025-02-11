import { Request, Response } from "express";
import Product, { IProduct } from "../models/product.model";


// Get All Products with optional filters
export const getAllProducts = async (req: Request, res: Response) => {
    try {
      const { category, price_min, price_max } = req.query;
  
      const filters: any = { isActive: true };
      if (category) filters.category = category;
      if (price_min || price_max) {
        filters.price = {};
        if (price_min) filters.price.$gte = Number(price_min);
        if (price_max) filters.price.$lte = Number(price_max);
      }
  
      const products = await Product.find(filters);
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching products", error });
    }
};
  

// Get All Products (only active ones)
export const getActiveProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isActive: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};


// Get Inactive Products
export const getInactiveProducts = async (req: Request, res: Response) => {
    try {
      const products = await Product.find({ isActive: false });
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching products", error });
    }
};


// Get Product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const product: IProduct | null = await Product.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found!" });
            return;
        }
        res.status(200).json({message: "Product successfully retrived", product});
    } catch (error:any) {
        res.status(500).json({ message: "Error retrieving Product", error: error.message });
    }
};


// New Product
export const newProduct = [
    async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, desc, img, price, category, quantity, createdBy } = req.body;
  
      const existingProduct = await Product.findOne({ name });
      if (existingProduct) {
        res.status(409).json({ message: "Product with this name already exists" });
      }
  
      const product = new Product({ name, desc, img, price, category, quantity, createdBy });
      await product.save();
  
      res.status(201).json(product);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ message: "Error creating product", error });
    }
}
];


// Update Product
export const updateProduct = [
    async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = req.params.id;  
        const updatedProductData: Partial<IProduct> = req.body;
        const requiredFields = ["name", "desc", "img", "price", "category", "quantity"];
        const missingFields = requiredFields.filter(
            field => field in updatedProductData && !updatedProductData[field as keyof IProduct]
        );

        if (missingFields.length > 0) {
            res.status(400).json({ message: `Missing values for: ${missingFields.join(", ")}` });
        }

        const updatedProduct: IProduct | null = await Product.findByIdAndUpdate(
            productId,
            { $set: updatedProductData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            res.status(404).json({ message: "Product not found!" });
        }

        res.status(200).json({ data: updatedProduct });
    } catch (error: any) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
];


// Soft Delete/Deactivate Product
export const deleteProduct = [
    async (req: Request, res: Response): Promise<void> => {
    try {
      const product: IProduct | null = await Product.findByIdAndUpdate(
        req.params.id,
        { isActive: false }, 
        { new: true }
      );
  
      if (!product)
        res.status(404).json({ message: "Product not found!" });
  
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Error deleting product", error });
    }
}
];
