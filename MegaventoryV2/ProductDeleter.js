class ProductDeleter {
    constructor(apiKey, productID) {
      this.apiKey = apiKey;
      this.productID = productID;
    }
  
    async deleteProduct() {
      const options = {
        hostname: "api.megaventory.com",
        path: `/v2017a/Product/ProductGet?APIKEY=${this.apiKey}&format=json`,
        method: "GET",
      };
  
      const req = https.request(options, (res) => {
        let data = "";
  
        res.on("data", (chunk) => {
          data += chunk;
        });
  
        res.on("end", () => {
          const response = JSON.parse(data);
          const products = response.mvProducts;
          const targetProduct = products.find(
            (product) => product.ProductID === this.productID
          );
          if (targetProduct) {
            // ...
          } else {
            console.log("Product not found.");
          }
        });
      });
  
      req.on("error", (error) => {
        console.error("Error:", error);
      });
  
      req.end();
    }
  }
  
  module.exports = ProductDeleter;
  