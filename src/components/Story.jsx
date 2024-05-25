import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Story = ({ story }) => {
	const relativeTime = dayjs((story?.time ?? 0) * 1000).fromNow();

	return (
		<div className="story">
			<div className="row">
				<a className="title" href={story?.url} target="_blank" rel="noreferrer">
					<h3>{story?.title}</h3>{" "}
				</a>
			</div>
			<p>
				<span className="score">[{story?.score}]</span>
				<span className="author"> by {story?.by}</span>
				<span className="time"> on {relativeTime}</span>
				<span className="comments"> with {story?.descendants} comments</span>
			</p>
		</div>
	);
};

export default Story;
