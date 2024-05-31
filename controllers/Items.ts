import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

async function Create(req: Request, res: Response) {
  const { itemName, date, listId } = req.body;
  // const { itemName, date } = req.body.data.items.create;

  try {
    const result = await prisma.items.create({
      data: {
        itemName,
        date,
        listId
      }
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Error creating item", error });
  }
}
async function Delete(req:Request, res: Response) {
  const id = req.params.id;
  try{
  const result = await prisma.items.delete({
      where:{
        id
      }
    });
    return res.json(result);
  }
  catch (error) {
      console.error('Error deleting owner:', error);
      res.status(500).json({ message: 'Error deleting owner', error });
  }
} 
async function Update(req: Request, res: Response) {
  const id = req.params.id;
  const {itemName,date} = req.body.data;
  try {
    const result = await prisma.items.update({
      where: {
        id,
      },
      data: {
      itemName,
      date
      },
    });
    return res.json(result);
  } catch (error) {
    console.error('Error updating account:', error);
    return res.status(500).json({ message: 'Error updating account', error });
  }
}
async function getListItems(req: Request, res: Response) {
    const listId = req.params.id
    try {
      const data = await prisma.items.findMany({
        where:{
          listId
        }
      });
      return res.json(data); 
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

const ItemControl = { Create, getListItems, Delete, Update };

export default ItemControl;
