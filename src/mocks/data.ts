export const mockUsers = {
  id: "1",
  username: "john_doe@example.com",
  password: "password123",
  role: "ADMIN",
  dateOfBirth: "1990-01-01",
  createdBy: "system",
};

export const mockProducts = [
  {
    id: 1,
    uuid: "123e",
    name: "Product 1",
    imageUrl: "https://example.com/product1.jpg",
    price: 19.99,
    description: "This is a sample product.",
    stock: 100,
    category: {
      id: 1,
      name: "Category 1",
    },
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    uuid: "456e",
    name: "Product 2",
    imageUrl: "https://example.com/product2.jpg",
    price: 29.99,
    description: "This is another sample product.",
    stock: 50,
    category: {
      id: 2,
      name: "Category 2",
    },
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    uuid: "789e",
    name: "Product 3",
    imageUrl: "https://example.com/product3.jpg",
    price: 39.99,
    description: "This is a third sample product.",
    stock: 25,
    category: {
      id: 3,
      name: "Category 3",
    },
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];
