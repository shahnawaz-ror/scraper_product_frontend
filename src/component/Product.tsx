import React, { useState, useEffect } from "react";
import { submitProductURL, fetchProducts, fetchCategories } from "./ProductURl";

const Product = () => {
  const [url, setUrl] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmittingURL, setIsSubmittingURL] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const getProducts = async (categoryId = "") => {
    try {
      const fetchedProducts = await fetchProducts();
      const filteredProducts = categoryId
        ? fetchedProducts.filter(
            (product) => product.category_id === Number(categoryId)
          )
        : fetchedProducts;

      setProducts(filteredProducts);
    } catch (error) {
      setError(error.message);
    }
  };
  const getCategories = async () => {
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      setError(error.message);
    }
  };
  const handleURLSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      setError("URL is required");
      return;
    }

    try {
      setIsSubmittingURL(true);
      setError(null);
      await submitProductURL(url);
      setSuccessMessage("Product submitted successfully!");
      setUrl("");
      getProducts();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmittingURL(false);
    }
  };
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    getProducts(categoryId);
  };

  useEffect(() => {
    getCategories();
    getProducts();
  }, []);
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncateDescription = (description, limit = 200) => {
    if (description.length > limit) {
      return description.slice(0, limit) + "...";
    }
    return description;
  };

  return (
    <div className="">
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-center ">{successMessage}</p>
      )}
      <div className=" lg:flex justify-between items-center mb-6 bg-[#2874F0]  px-2 lg:px-32 py-4 ">
        <form onSubmit={handleURLSubmit}>
          <div className="flex items-center gap-2 ">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter product URL"
              required
              className="border p-2 rounded-md flex-1"
            />
            <button
              type="submit"
              className={`bg-white text-[#2874F0] p-2 rounded-md ${
                isSubmittingURL ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmittingURL}
            >
              {isSubmittingURL ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        <div className="mb-2 mt-2 lg:mt-0">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border p-2 rounded-md w-full bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-4 lg:mx-12">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border-4 rounded-lg p-2">
              <h3 className="text-center text-lg lg:text-xl font-semibold my-2">
                {product.title}
              </h3>
              <p className="text-sm mb-2">
                {showFullDescription
                  ? product.description
                  : truncateDescription(product.description)}
                {product.description.length > 200 && (
                  <button
                    onClick={toggleDescription}
                    className="text-blue-500 ml-2 underline"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </button>
                )}
              </p>
              <div className="flex justify-end ">
                <p className="bg-red-500 text-white rounded-sm p-2">
                  Price: Rs{product.price}
                </p>
              </div>
              {product.size && product.size.trim() && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="pt-2">Size:</span>
                  {product.size.split(",").map((size, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-[#2874F0] hover:text-white"
                    >
                      {size.trim()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default Product;
