import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs'); 

async function Create(req: Request, res: Response) {
    const {username,password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 
    try{ 
            const result = await prisma.account.create({
                data: {
                    username,
                    password: hashedPassword
                },
            });
        return res.status(200).json(result);
    }
    catch(error){
        console.error('Error creating acciunt:', error);
        res.status(500).json({ message: 'Error creating account', error });
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
    const {username,password} = req.body.data;
    const hashedPassword = await bcrypt.hash(password, 10);
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
      const { username, password } = req.body.data;
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
        return res.status(200).json({ message: 'Login successful' }); 
      } else {
        return res.status(401).json({ error: 'Invalid password' });
      }
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

async function Test(req: Request, res: Response) {
    return res.json({ message: 'Hello sir uwu' });
  }
const AccountControl = {Create, Get, Test, Login, Delete, Update};

export default AccountControl;