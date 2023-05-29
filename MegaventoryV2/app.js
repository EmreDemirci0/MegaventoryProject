const axios = require("axios");
const https= require("https");

class MegaventoryAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = "https://api.megaventory.com/v2017a";
  }
  //url : is the link to our API. payload: is the "Array" containing the data.SuccessMessage and Errormesage:results are our messages.
  async executeRequest(url, payload, successMessage, errorMessage) {
    try {
      const response = await axios.post(url, payload);
      console.log(successMessage, response.data);
    } catch (error) {
      console.error(errorMessage, error.response.data);
    }
  }
  //Gets one of the values ​​entityType:"Product","SupplierClient","InventoryLocation".Payload: is the "Array" containing the data
  async insertOrUpdateEntity(entityType, payload) {
    const url = `${this.baseURL}/${entityType}/${entityType}Update`;
    const successMessage = `New ${entityType} inserted/updated:`;
    const errorMessage = `Error inserting/updating ${entityType}:`;
    await this.executeRequest(url, payload, successMessage, errorMessage);
  }
  //Gets one of the values ​​entityType:"Product","SupplierClient","InventoryLocation".Payload: is the "Array" containing the data
  async deleteEntity(entityType, payload) {
    const url = `${this.baseURL}/${entityType}/${entityType}Delete`;
    const successMessage = `${entityType} deleted:`;
    const errorMessage = `Error deleting ${entityType}:`;
    await this.executeRequest(url, payload, successMessage, errorMessage);
  }
  //ProductID:changes the Stock of the specified object
  async updateStockQuantity(productID) {
    const options = {
      hostname: 'api.megaventory.com',
      path: `/v2017a/Product/ProductGet?APIKEY=${this.apiKey}&format=json`,
      method: 'GET'
    };
    
    const req = https.request(options, (res) => {
      let data = '';
    
      res.on('data', (chunk) => {
        data += chunk;
      });
    
      res.on('end', () => {
        const response = JSON.parse(data);
        const products = response.mvProducts;
        const targetProduct = products.find(product => product.ProductID === productID);
        if (targetProduct) {
          //
          const updatePricingAndUnitCost = {
            APIKEY: this.apiKey,
            mvProduct: {
              ProductID: targetProduct.ProductID,
              ProductSKU: targetProduct.ProductSKU,
              ProductDescription: targetProduct.ProductDescription,
              ProductSellingPrice: "499.95",//99.99*5=499.95
              ProductPurchasePrice: "214.95",//44.99*5=214.95
            },
            mvRecordAction: "Update",
          }
          // const productPurchasePrice = targetProduct.ProductSKU;
          // console.log('Product Purchase Price:', productPurchasePrice);
          this.insertOrUpdateEntity("Product", updatePricingAndUnitCost);
          console.log('Successful');
        } else {
          console.log('Product not found.');
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Error:', error);
    });
    
    req.end();
  }
}
//We get the API key from www.megaventory.com/ and assign it to the variable
const apiKey = "222e2a5e95b83ded@m140970";
const megaventoryAPI = new MegaventoryAPI(apiKey);

//Babis's Client Data
const clientBabisPayload = {
  APIKEY: apiKey,
  mvSupplierClient: {
    SupplierClientID: 6,
    SupplierClientType: "Client",
    SupplierClientName: "Babis",
    SupplierClientEmail: "babis@exampletest.com",
    SupplierClientShippingAddress1: "Example 8, Athens",
    SupplierClientPhone1: "1235698967",
  },
  mvRecordAction: "Insert",
};

//Odysseus's Supplier Data
const supplierOdysseusPayload = {
  APIKEY: apiKey,
  mvSupplierClient: {
    SupplierClientID: 7,
    SupplierClientType: "Supplier",
    SupplierClientName: "Odysseus",
    SupplierClientEmail: "odysseus@exampletest.com",
    SupplierClientShippingAddress1: "Example 10, Athens",
    SupplierClientPhone1: "1235698988",
  },
  mvRecordAction: "Insert",
};

//Nike Product Data's
const productNikePayload = {
  APIKEY: apiKey,
  mvProduct: {
    ProductSKU: "1112256",
    ProductDescription: "Nike shoes",
    ProductSellingPrice: "99.99",
    ProductPurchasePrice: "44.99",
    mvProductMainSupplier: clientBabisPayload.mvSupplierClient,
  },
  mvRecordAction: "Insert",
};

//Adidas Product Data's
const productAdidasPayload = {
  APIKEY: apiKey,
  mvProduct: {
    ProductSKU: "1112248",
    ProductDescription: "Adidas shoes",
    ProductSellingPrice: "99.99",
    ProductPurchasePrice: "44.99",
    mvProductMainSupplier: supplierOdysseusPayload.mvSupplierClient,
  },
  mvRecordAction: "Insert",
};

//Add data's to Inventory Location
const inventoryLocationPayload = {
  APIKEY: apiKey,
  mvInventoryLocation: {
    InventoryLocationName: "Test Project Location",
    InventoryLocationAbbreviation: "Test",
    InventoryLocationAddress: "Example 20, Athens",
  },
  mvRecordAction: "Insert",
};

//Delete With Product ID
const DeleteProductPayload={
  APIKEY: apiKey,
  ProductIDToDelete: 00,  
}



// megaventoryAPI.insertOrUpdateEntity("SupplierClient", clientBabisPayload);
// megaventoryAPI.insertOrUpdateEntity("SupplierClient", supplierOdysseusPayload);
// megaventoryAPI.insertOrUpdateEntity("Product", productNikePayload);
// megaventoryAPI.insertOrUpdateEntity("Product", productAdidasPayload);
// megaventoryAPI.insertOrUpdateEntity("InventoryLocation", inventoryLocationPayload);
// deleteEntity("Product",payloadDeleteProduct)
// megaventoryAPI.updateStockQuantity(18);
// megaventoryAPI.updateStockQuantity(19);
// megaventoryAPI.updateStockQuantity(20);
// megaventoryAPI.updateStockQuantity(21);
// megaventoryAPI.updateStockQuantity(22);
