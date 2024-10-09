import * as Yup from 'yup';
import  Order from '../schemas/Order';
import Product from '../models/Products';
import Category from '../models/Category';
import User from '../models/User';


class OrderController {
  async store(request, response) {
    const schema = Yup.object({
      Products: Yup.array()
      .required()
      .of(
        Yup.object({
          id: Yup.number().required(),
          quantity: Yup.number().required(),
        }),
      ),
      
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }
  
    const { products} = request.body;


    const productsIds = products.map((product) =>product.id);

 const findProducts = await Product.findAll({
    where:{
        id: productsIds,
    },
    include:[{
        model: Category,
        as:'category',
        attributes:['name'],
     },],
    
    });

    const formattedProducts = findProducts.map((product) =>{
     const productIndex = product.findIndex((item) => item.id === product.id)
     
     
      const newProduct = {
        id: product.id,
        name: product.name,
        Category: product.Category,
        price: product.price,
        url:product.url,
        quantity: products[productIndex].quantity,
      
      };

      return newProduct;
    })

   const order = {
    user :{
        id:request.userId,
        name: request.userName
    },
    products:formattedProducts,
    status:'Pedido Realizado'
   };

   const createdOrder = await Order.create(order);

    return response.status(201).json({ createdOrder });
  }
async index (request,response){
  const orders = await Order.find();

  return response.json(orders);
}

async update (request,response) {
  const schema =Yup.object({
    status: Yup.string().required(),
  });
  try {
    schema.validateSync(request.body, { abortEarly: false });
  } catch (err) {
    return response.status(400).json({ error: err.errors });
  }

  const isAdmin = await User.findByPk(request.userId);

  if (!isAdmin.admin) {
    return response.status(401).json({ error: 'Only admin users can create categories' });
  }


  const {id} = request.parans;
  const {status} =request.body;



  await Order.updateOne({_id:id},{status});


  return response.status(200).json({message:'Status do Pedido Atualizado'});

}

}

   
  


export default new OrderController();








