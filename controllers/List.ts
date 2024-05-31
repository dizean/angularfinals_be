import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

async function Create(req: Request, res: Response) {
  const { listName, userId } = req.body; 
  try {
    const result = await prisma.lists.create({
      data: {
        listName,
        userId
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error creating acciunt:", error);
    res.status(500).json({ message: "Error creating account", error });
  }
}
async function Delete(req:Request, res: Response) {
  const id = req.params.id;
  try{
  const result = await prisma.lists.delete({
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
  const {listName} = req.body.data;
  try {
    const result = await prisma.lists.update({
      where: {
        id,
      },
      data: {
      listName
      },
    });
    return res.json(result);
  } catch (error) {
    console.error('Error updating account:', error);
    return res.status(500).json({ message: 'Error updating account', error });
  }
}
async function getUserList(req: Request, res: Response) {
  const userId = req.params.id
  try {
    const data = await prisma.lists.findMany({
      where:{
        userId
      }
    });
    return res.json(data); 
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

const ListControl = { Create, Delete, Update };

export default ListControl;
