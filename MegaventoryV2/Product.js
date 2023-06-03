class Product {
    constructor(apiKey, payload) {
      this.apiKey = apiKey;
      this.payload = payload;
    }
  
    async addOrUpdateProduct() {
      const url = `${this.baseURL}/Product/ProductUpdate`;
      const successMessage = `New product inserted/updated:`;
      const errorMessage = `Error inserting/updating product:`;
      await this.executeRequest(url, this.payload, successMessage, errorMessage);
    }
  }
  
  module.exports = Product;
  