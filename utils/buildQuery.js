// Assuming you have a MongoDB collection named 'products'
function buildQuery({ name, brands, categories, priceMin, priceMax }) {
  const query = {};

  // Product name search (case-insensitive)
  if (name && name !== "") {
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
  if (priceMin !== undefined && priceMax !== undefined) {
    query.price = { $gte: priceMin, $lte: priceMax };
  } else if (priceMin !== undefined) {
    query.price = { $gte: priceMin };
  } else if (priceMax !== undefined) {
    query.price = { $lte: priceMax };
  }

  return query;
}

module.exports = buildQuery;
