import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: DataTypes.STRING,
        admin: DataTypes.BOOLEAN,
      },
      {
        sequelize,
      },
    );
    this.addHook('beforeSave', async (users) => {
      if (users.password) {
        users.password_hash = await bcrypt.hash(users.password, 10);
      }
    });

    return this;
  }
    async checkPassword (password){
      return await bcrypt.compare(password, this.password_hash)
     }

}


export default User;
