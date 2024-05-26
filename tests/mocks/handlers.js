import { http, HttpResponse } from "msw";

const storiesIds = Array.from({ length: 30 }, (_, index) => index + 1);

const storiesItems = storiesIds
  .map((id) => ({
    id,
    title: `Story ${id}`,
    url: `https://example.com/${id}`,
    score: Math.floor(Math.random() * 100),
    by: `User ${id}`,
    time: Date.now(),
    descendants: Math.floor(Math.random() * 100),
  }))
  .reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

const bestStoriesIds = storiesIds.toSorted(
  (a, b) => storiesItems[b].score - storiesItems[a].score
);

export const handlers = [
  http.get("https://hacker-news.firebaseio.com/v0/beststories.json", () => {
    return HttpResponse.json(bestStoriesIds);
  }),

  http.get(
    "https://hacker-news.firebaseio.com/v0/item/:id.json",
    (req, res, ctx) => {
      const { id } = req.params;
      const story = storiesItems[id];
      return HttpResponse.json(story);
    }
  ),
];
