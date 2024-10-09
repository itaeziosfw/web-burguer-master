import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import * as Yup from 'yup';

class UserController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean(),
    });
    

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { name, email, password, admin } = request.body;

    const userExists = await User.findOne({
      where: {
        email,
      },
    });




    if (userExists) {
      return response.status(400).json({ error: 'User already exists' });
    }


    const password_hash= await bcrypt.hash(password, 8);

    const user = await User.create({
      id: uuidv4(),
      name,
      email,
      password_hash,
      admin,
    });

    return response.status(201).json(user);
  }
}

export default new UserController();
