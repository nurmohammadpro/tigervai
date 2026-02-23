"use server"


const DEMO_DATA = {
  total: 2,
  items: [
    {
      id: "690d92a03256088f21a57773",
      name: "fafa",
      thumbnail: "http://localhost:9000/my-tiger-vai-bucket/f4408472-5727-4ed8-a5d8-4b84e0328512.jpeg",
      main: "lol",
      category: "lol",
      subMain: "lol",
      price: 4000,
      offerPrice: 445,
      hasOffer: true,
      isDigital: false,
      brandId: "690c81ae8c9dcc8983d76859",
      brandName: "Box test",
      slug: "fafa-4000-fafafaf-lol-tiger-vai-products",
      isAdminCreated: false,
      stock: 34,
      rating: 0,
      createdAt: "1762497184642",
    },
    {
      id: "690dbcdac4e21585d6287351",
      name: "this is laos test",
      thumbnail: "http://localhost:9000/my-tiger-vai-bucket/c648cdd5-89a7-4cad-9a2e-c3fd4c373849.png",
      main: "xd",
      category: "xd",
      subMain: "xd",
      price: 4500,
      offerPrice: 4250,
      hasOffer: true,
      isDigital: false,
      brandId: "",
      brandName: "this barnd",
      slug: "this-is-laos-test-4500-fafafaf-xd-tiger-vai-products",
      isAdminCreated: true,
      stock: 61,
      rating: 0,
      createdAt: "1762507994421",
    },
  ],
  facets: {
    brandName: { "Box test": 1, "this barnd": 1 },
    category: { lol: 1, xd: 1 },
    hasOffer: { true: 2 },
    main: { lol: 1, xd: 1 },
    rating: { "0": 2 },
  },
  pagination: {
    currentPage: 1,
    pageSize: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

export async function fetchProducts(params: any) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // In production: const response = await fetch(`/api/products?${toBackendParams(params)}`);
  return DEMO_DATA;
}
