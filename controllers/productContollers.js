const Products = require("../schemas/products");


const addProduct = async (req, res) => {
  try{
    const file = req.files
    console.log(file)
    if(!file || file.length == 0){
      res.status(400).send("Image files not uploaded!")
    }
    else{
      const {
        productName,
        productPrice,
        productSizes,
        productStockQuantity, 
        productOriginalPrice,  
        productBrandName,
      } = req.body;
      const imageArray = await file.map((file)=>{
        return "http://localhost:3001/images/"+file.filename
      })
      const newProduct = new Products({
        productName,
        productPrice,
        productSizes:JSON.parse(productSizes),
        productStockQuantity, 
        productOriginalPrice,  
        productBrandName,
        productImages:imageArray
      });
  
      const savedProduct = await newProduct.save();
      if(savedProduct){
        res.status(200).send(savedProduct);
      }
      else{
        res.status(400).send("Error adding product!")
      }
  
    }
  }
  catch(err){
    res.status(500).send(err)
  }

  
};

const fetchProducts= async(req,res)=>{

  try{
    const products = await Products.find().exec()
    if(products){
      const formattedProducts = products.map(product => ({
        _id:product._id,
        productName: product.productName,
        productPrice: product.productPrice,
        productImages: product.productImages,
        productSizes: product.productSizes,
        productStockQuantity: product.productStockQuantity,
        productOriginalPrice: product.productOriginalPrice,
        productBrandName: product.productBrandName,
        productReviews: product.productReviews,
        productCategory:product.productCategory
      }));

      res.status(200).json(formattedProducts);
    }
    else{
      res.status(400).send("Error fetching products!")
    }
  }
  catch(err){
    res.status(500).send(err)
  }

}

const fetchProductById = async(req,res)=>{

  try{
    const {productId} = req.query
    const productInformation= await Products.findById(productId).exec()
    if(productInformation){
      res.status(200).send(productInformation)
    }
    else{
      res.status(400).send("Error fetching product")
    }
  }
  catch(err){
    res.send(err)
  }

}

module.exports = { addProduct,fetchProducts,fetchProductById };
