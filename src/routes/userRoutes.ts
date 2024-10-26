import {Router} from 'express';
import { Request, Response } from 'express';
import  {ObjectId} from 'mongodb';

const router = Router();

const users = [
   {username: 'user1', password: 'password1', role: 'user', _id: new ObjectId()},
   {username: 'user2', password: 'password2', role : 'user', _id: new ObjectId()},
   {username: 'admin', password: 'adminpass', role: 'admin', _id: new ObjectId()},
]

router.post('/login', (req: Request, res: Response) => {
   const {username, password} = req.body;
   const user = users.find(user => user.username === username && user.password === password);

   if (user) {
      res.status(200).json({message: 'Du er logget inn', user});
   } else {
      res.status(401).json({message: 'Feil brukernavn eller passord'});
   }
});

export default router;