const Category = require("../models/category.model.js");
const asyncHandler = require('express-async-handler');

// CREAR UNA CATEGORIA
const create = asyncHandler(async (req, res) => {

  const category_data = {
    id_cat: req.body.id_cat || null,
    category_name: req.body.category_name || null,
    image: req.body.image || null,
    jobs: []
  };

  const category = await new Category(category_data);
  const new_category = await category.save();
  res.json(new_category);
});
const findCategoriesSelect = asyncHandler( async (req, res) => {

  const categories = await Category.find();

  if (!categories) {
    return res.status(401).json({
      message: "Category not found"
    })
  }
  
  return res.status(200).json({
    categories: await Promise.all(categories.map( async categories => {
        return await categories.toCategoryResponse()
    }))
  });
});
// ENCONTRAR TODAS LAS CATEGORIAS
const findAll = asyncHandler(async (req, res) => {
  const { offset = 0, limit = 4 } = req.query;

  const categories = await Category.find({}, {}, { skip: Number(offset), limit: Number(limit) });

  if (!categories) {
    return res.status(401).json({
      message: "Category not found"
    });
  }

  return res.status(200).json({
    categories: await Promise.all(categories.map(async category => {
      return await category.toCategoryResponse();
    }))
  });
});

// ENCONTRAR UNA CATEGORIA
const findOne = asyncHandler(async (req, res) => {

  const categories = await Category.findOne(req.params)

  if (!categories) {
    return res.status(401).json({
      message: "Category not found"
    })
  }
  return res.status(200).json({
    categories: await categories.toCategoryResponse()
  })
});

// ELIMINAR UNA CATEGORIA
const delete_category = asyncHandler(async (req, res) => {
  await Category.findOneAndDelete(req.params);
  res.send({ message: "Category was deleted successfully!" });
});

module.exports = {
  create,
  findAll,
  findOne,
  delete_category,
  findCategoriesSelect
}