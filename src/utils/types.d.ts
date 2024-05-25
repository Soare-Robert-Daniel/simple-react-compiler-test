export interface HackerNewsItem {
	id: number;
	title: string;
	url: string;
	score: number;
	by: string;
	time: number;
	descendants: number;
}

export interface HackerNewsUser {
	id: string;
	delay: number;
	created: number;
	karma: number;
	about: string;
	submitted: number[];
}

export interface HackerNewsComment {
	id: number;
	by: string;
	parent: number;
	text: string;
	time: number;
	type: string;
	kids: number[];
}

export type HackerNewsStory = HackerNewsItem & {
	kids: number[];
};

export type HackerNewsJob = HackerNewsItem & {
	company: string;
	companyUrl: string;
	location: string;
	title: string;
	url: string;
};
