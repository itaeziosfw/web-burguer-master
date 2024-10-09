/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const tableDescription = await queryInterface.describeTable('products');
    if (tableDescription.Category) {
      await queryInterface.removeColumn('products', 'Category');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'Category', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
