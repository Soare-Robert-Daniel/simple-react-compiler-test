import { useState, useEffect } from "react";
import { HackerNewsHandler } from "./utils/hacker-news-api";
import Story from "./components/Story";
import "./index.scss";

const apiHandler = new HackerNewsHandler();

function App() {
	const [stories, setStories] = useState(
		/** @type {import('./utils/types').HackerNewsStory[]} */ ([]),
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		setIsLoading(true);
		apiHandler.fetchInitialStories().then((stories) => {
			setStories(stories);
			setIsLoading(false);
			if (apiHandler.hasError) {
				setError(apiHandler.errorMessage);
			}
		});
	}, []);

	const refreshStories = async () => {
		setError(null);
		setIsLoading(true);
		setStories(await apiHandler.refreshStories());
		setIsLoading(false);
		if (apiHandler.hasError) {
			setError(apiHandler.errorMessage);
		}
	};

	const loadMoreStories = async () => {
		setError(null);
		setIsLoading(true);
		setStories(await apiHandler.loadMoreStories());
		setIsLoading(false);
		if (apiHandler.hasError) {
			setError(apiHandler.errorMessage);
		}
	};

	return (
		<div className="app">
			<button type="button" onClick={refreshStories}>
				Refresh
			</button>
			<h1>Best Stories</h1>
			<div className="stories">
				{stories.map((story) => (
					<Story key={story.id} story={story} />
				))}
			</div>
			<button type="button" onClick={loadMoreStories} disabled={isLoading}>
				{isLoading ? "Loading..." : "Load more"}
			</button>
			{error && <p className="error">{error}</p>}
		</div>
	);
}

export default App;
