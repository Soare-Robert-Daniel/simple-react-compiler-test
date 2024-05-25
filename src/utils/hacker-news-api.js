/**
 * A class to handle fetching and managing Hacker News stories.
 */
export class HackerNewsHandler {
  /**
   * Creates an instance of HackerNewsHandler.
   * @param {number} [loadMoreCount=10] - The number of stories to load each time.
   */
  constructor(loadMoreCount = 10) {
    this.stories = [];
    this.viewStories = [];
    this.currentViewIndex = 0;
    this.loadMoreCount = loadMoreCount;
    this.hasError = false;
    this.errorMessage = "";
  }

  /**
   * Fetches the top stories IDs from the Hacker News API.
   * @returns {Promise<number[]>} - A promise that resolves to an array of top story IDs.
   */
  async fetchBestStoriesId() {
    const response = await fetch(
      "https://hacker-news.firebaseio.com/v0/beststories.json"
    );

    if (!response.ok) {
      this.hasError = true;
      this.errorMessage = response.statusText;
      return [];
    }

    return response.json();
  }

  /**
   * Fetches a single story item from the Hacker News API.
   * @param {string} id - The ID of the story to fetch.
   * @returns {Promise<import("./types").HackerNewsItem>} - A promise that resolves to the story object.
   */
  async fetchItem(id) {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );

    if (!response.ok) {
      this.hasError = true;
      this.errorMessage = response.statusText;
      return { id };
    }

    return response.json();
  }

  /**
   * Fetches the initial set of stories and stores them in viewStories.
   * @returns {Promise<import("./types").HackerNewsStory[]>} - A promise that resolves to an array of initial story objects.
   */
  async fetchInitialStories() {
    this.removeOldError();

    const storyIds = await this.fetchBestStoriesId();
    this.stories = storyIds;
    const initialStoryData = await Promise.all(
      storyIds.slice(0, this.loadMoreCount).map((id) => this.fetchItem(id))
    );
    this.viewStories = initialStoryData;
    this.currentViewIndex = this.loadMoreCount;
    localStorage.setItem("bestStories", JSON.stringify(initialStoryData));
    return this.viewStories;
  }

  /**
   * Loads more stories and appends them to viewStories.
   * @returns {Promise<import("./types").HackerNewsStory[]>} - A promise that resolves to an array of updated story objects.
   */
  async loadMoreStories() {
    this.removeOldError();

    // Get the IDs of the additional stories to load.
    const additionalStoriesIds = this.stories.slice(
      this.currentViewIndex,
      this.currentViewIndex + this.loadMoreCount
    );

    // Fetch the additional stories.
    const additionalStoriesData = await Promise.all(
      additionalStoriesIds.map((id) => this.fetchItem(id))
    );

    // Combine the additional stories with the current view.
    this.viewStories = this.viewStories.concat(additionalStoriesData);

    this.currentViewIndex += this.loadMoreCount;
    return this.viewStories;
  }

  /**
   * Refreshes the stories, updating only those that have changed and belong to the view.
   * @returns {Promise<import("./types").HackerNewsStory[]>} - A promise that resolves to an array of refreshed story objects.
   */
  async refreshStories() {
    this.removeOldError();

    const newStoriesId = await this.fetchBestStoriesId();
    const currentStoriesIds = this.stories;

    // Find the stories that have changed
    const changedStoriesIds = newStoriesId.filter(
      (storyId, index) => storyId !== currentStoriesIds[index]
    );

    // Determine which of the changed stories belong to the view
    const viewChangedStoriesIds = changedStoriesIds.filter((id) => {
      const index = newStoriesId.indexOf(id);
      return index < this.currentViewIndex;
    });

    // Fetch the changed stories that belong to the view
    const viewChangedStoriesData = await Promise.all(
      viewChangedStoriesIds.map((id) => this.fetchItem(id))
    );

    // Update the stories array with the fetched data
    const updatedStories = newStoriesId.map((storyId) => {
      const oldStoryPosition = currentStoriesIds.indexOf(storyId);
      return oldStoryPosition === -1
        ? viewChangedStoriesData.shift()
        : this.stories[oldStoryPosition];
    });

    // Cache the updated stories.
    this.stories = updatedStories;
    localStorage.setItem("bestStories", JSON.stringify(this.stories));

    // Update the view if the current stories in view have changed
    this.viewStories = updatedStories
      .slice(0, this.currentViewIndex)
      .map((story, index) => {
        const newStory = updatedStories[index];
        return newStory || story;
      });

    return this.viewStories;
  }

  /**
   * Removes the old error message.
   */
  removeOldError() {
    this.hasError = false;
    this.errorMessage = "";
  }
}
