const axios = require("axios");
const https = require("https");

class MegaventoryAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = "https://api.megaventory.com/v2017a";
    this.axiosInstance = axios.create();
    this.httpsAgent = new https.Agent({ rejectUnauthorized: false });
  }

  async executeRequest(url, payload, successMessage, errorMessage) {
    try {
      const response = await this.axiosInstance.post(url, payload);
      console.log(successMessage, response.data);
    } catch (error) {
      console.error(errorMessage, error.response.data);
    }
  }

  async insertOrUpdateEntity(entityType, payload) {
    const url = `${this.baseURL}/${entityType}/${entityType}Update`;
    const successMessage = `New ${entityType} inserted/updated:`;
    const errorMessage = `Error inserting/updating ${entityType}:`;
    await this.executeRequest(url, payload, successMessage, errorMessage);
  }

  async deleteEntity(entityType, payload) {
    const url = `${this.baseURL}/${entityType}/${entityType}Delete`;
    const successMessage = `${entityType} deleted:`;
    const errorMessage = `Error deleting ${entityType}:`;
    await this.executeRequest(url, payload, successMessage, errorMessage);
  }

  async updateStockQuantity(productID) {
    const options = {
      hostname: "api.megaventory.com",
      path: `/v2017a/Product/ProductGet?APIKEY=${this.apiKey}&format=json`,
      method: "GET",
      agent: this.httpsAgent,
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
          (product) => product.ProductID === productID
        );
        if (targetProduct) {
          const updatePricingAndUnitCost = {
            APIKEY: this.apiKey,
            mvProduct: {
              ProductID: targetProduct.ProductID,
              ProductSKU: targetProduct.ProductSKU,
              ProductDescription: targetProduct.ProductDescription,
              ProductSellingPrice: "499.95",
              ProductPurchasePrice: "214.95",
            },
            mvRecordAction: "Update",
          };
          this.insertOrUpdateEntity("Product", updatePricingAndUnitCost);
          console.log("Successful");
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

class SupplierClient {
  constructor(apiKey, clientPayload) {
    this.apiKey = apiKey;
    this.payload = clientPayload;
  }

  async addOrUpdateClient() {
    const megaventoryAPI = new MegaventoryAPI(this.apiKey);
    await megaventoryAPI.insertOrUpdateEntity("SupplierClient", this.payload);
  }
}

class Product {
  constructor(apiKey, productPayload) {
    this.apiKey = apiKey;
    this.payload = productPayload;
  }

  async addOrUpdateProduct() {
    const megaventoryAPI = new MegaventoryAPI(this.apiKey);
    await megaventoryAPI.insertOrUpdateEntity("Product", this.payload);
  }
}

class InventoryLocation {
  constructor(apiKey, locationPayload) {
    this.apiKey = apiKey;
    this.payload = locationPayload;
  }

  async addOrUpdateLocation() {
    const megaventoryAPI = new MegaventoryAPI(this.apiKey);
    await megaventoryAPI.insertOrUpdateEntity(
      "InventoryLocation",
      this.payload
    );
  }
}

class ProductDeleter {
  constructor(apiKey, productIDToDelete) {
    this.apiKey = apiKey;
    this.payload = {
      APIKEY: apiKey,
      ProductIDToDelete: productIDToDelete,
    };
  }

  async deleteProduct() {
    const megaventoryAPI = new MegaventoryAPI(this.apiKey);
    await megaventoryAPI.deleteEntity("Product", this.payload);
  }
}

// Kullanım örneği:
const apiKey = "222e2a5e95b83ded@m140970";

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

const inventoryLocationPayload = {
  APIKEY: apiKey,
  mvInventoryLocation: {
    InventoryLocationName: "Test Project Location",
    InventoryLocationAbbreviation: "Test",
    InventoryLocationAddress: "Example 20, Athens",
  },
  mvRecordAction: "Insert",
};

const DeleteProductPayload = {
  APIKEY: apiKey,
  ProductIDToDelete: 0,
};

const clientBabis = new SupplierClient(apiKey, clientBabisPayload);
await clientBabis.addOrUpdateClient();

const supplierOdysseus = new SupplierClient(apiKey, supplierOdysseusPayload);
await supplierOdysseus.addOrUpdateClient();

const productNike = new Product(apiKey, productNikePayload);
await productNike.addOrUpdateProduct();

const productAdidas = new Product(apiKey, productAdidasPayload);
await productAdidas.addOrUpdateProduct();

const inventoryLocation = new InventoryLocation(apiKey, inventoryLocationPayload);
await inventoryLocation.addOrUpdateLocation();

const productDeleter = new ProductDeleter(apiKey, DeleteProductPayload.ProductIDToDelete);
await productDeleter.deleteProduct();

const megaventoryAPI = new MegaventoryAPI(apiKey);
await megaventoryAPI.updateStockQuantity(18);
await megaventoryAPI.updateStockQuantity(19);
await megaventoryAPI.updateStockQuantity(20);
await megaventoryAPI.updateStockQuantity(21);
await megaventoryAPI.updateStockQuantity(22);
