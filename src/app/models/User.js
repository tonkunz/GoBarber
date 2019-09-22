import Sequelize from 'sequelize'
import bcrypt from 'bcryptjs'

class User extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // Campo que nunca existirá no BD Físico
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN
      },
      {
        sequelize
      }
    )

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8)
      }
    })

    return this
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' })
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash)
  }
}

export default User
