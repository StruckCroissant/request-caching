import { http, HttpResponse, delay } from "msw";

class Book {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }
}

const range = (i) => [...Array(i).keys()];

export const handlers = [
  http.get("https://test.com/books", async ({ request }) => {
    console.log(request.headers);
    const url = new URL(request.url);
    const books = [
      ...range(10).map((i) => new Book(i, `Charlie ${i}`)),
      ...range(10).map((i) => new Book(i + 10, `Brooke ${i}`)),
    ];

    const filteredBooks = books.filter((book) =>
      book.title.includes(url.searchParams.get("search"))
    );

    await delay(2000);

    return HttpResponse.json(filteredBooks, {
      headers: { "cache-control": "max-age=30, public" },
    });
  }),
];
