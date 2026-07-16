export type Book = {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  publishedAt?: string;
};

export type CreateBookInput = {
  title: string;
  author: string;
  description: string;
  category: string;
};

export type LoginResponse = {
  token: string;
  expiresIn: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
};
