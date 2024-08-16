// Assuming you have a MongoDB collection named 'products'
function buildQuery({ name, brands, categories, priceMin, priceMax }) {
  const query = {};

  // Product name search (case-insensitive)
  if (name !== "") {
    query.name = { $regex: name, $options: "i" }; // 'i' for case-insensitive search
  }

  // Brand name filter
  if (brands && brands.length > 0) {
    query.brand = { $in: brands };
  }

  // Category name filter
  if (categories && categories.length > 0) {
    query.category = { $in: categories };
  }

  // Price range filter
  if (priceMin !== "" && priceMax !== "") {
    query.price = { $gte: parseInt(priceMin), $lte: parseInt(priceMax) };
  } else if (priceMin !== "") {
    query.price = { $gte: parseInt(priceMin) };
  } else if (priceMax !== "") {
    query.price = { $lte: parseInt(priceMax) };
  }

  return query;
}

module.exports = buildQuery;
