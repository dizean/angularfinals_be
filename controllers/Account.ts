import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs'); 

async function Create(req: Request, res: Response) {
  const prisma = new PrismaClient(); 
  const { username, password } = req.body;
  try {
    const userExist = await prisma.account.findFirst({
      where: { username }
    });
    if (userExist) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await prisma.account.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ message: 'Error creating account' });
  }
}
async function Get(req: Request, res: Response) {
  const accountId = req.params.id;
    try {
      const result = await prisma.account.findUnique({
        where:{
          id: accountId,
          lists : {
          some:{
            userId: accountId,
          }
         }
        },
        include: {
          lists: {
            select:{
              id: true,
              listName: true,
              items: {
                select: {
                  id:true,
                  itemName: true,
                  date: true,
                  listId: true
                }
              }
            }
            }
          }
      });
      return res.json(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

async function Delete(req:Request, res: Response) {
    const id = req.params.id;
    try{
    const result = await prisma.account.delete({
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
    const {username,password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(username,password)
    try {
      const result = await prisma.account.update({
        where: {
          id,
        },
        data: {
          username,
          password: hashedPassword
        },
      });
      return res.json(result);
    } catch (error) {
      console.error('Error updating account:', error);
      return res.status(500).json({ message: 'Error updating account', error });
    }
  }

  async function Login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const result = await prisma.account.findFirst({
        where: {
          username,
        },
        
      });
      if (!result) {
        return res.status(401).json({ message: 'Account not found' });
      }
      const match = await bcrypt.compare(password, result.password);
      if (match) {
        return res.status(200).json({ message: 'Login successful', id: result.id, username }); 
      } else {
        return res.status(401).json({ error: 'Invalid password' });
      }
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function CountLists(req: Request, res: Response) {
    const id = req.params.id; 
    try {
      const result = await prisma.account.findUnique({
        where: { id },
        select: {
          _count: {
            select: { lists: true },
          },
        },
      });
      if (!result){
        return res.status(404).json({ message: 'Wala unod men' });
      }
      return res.json({ listCount: result._count?.lists || 0 }); 
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' }); 
    }
  }
  
  async function CountItems(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const account = await prisma.account.findUnique({
        where: { id },
        select: {
          lists: {
            select: {
              _count: { 
                select: { items: true },
              },
            },
          },
        },
      });
  
      if (!account) {
        return res.status(404).json({ message: 'Wala unod men (Account not found)' });
      }
      const allItem = account.lists.reduce((acc, list) => acc + list._count.items, 0);
      return res.json({ allItem });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
async function Test(req: Request, res: Response) {
    return res.json({ message: 'Hello Test uwu' });
  }
const AccountControl = {Create, Get, Test, Login, Delete, Update, CountLists, CountItems};

export default AccountControl;