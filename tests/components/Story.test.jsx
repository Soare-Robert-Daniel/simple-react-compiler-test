import { render, screen } from '@testing-library/react';
import Story from '../../src/components/Story';

describe('Story', () => {

    const data = {
        title: 'Hello, World!',
        url: 'https://example.com',
        score: 42,
        by: 'User',
        time: Date.now(),
        descendants: 7,
    };

    it('renders a story', () => {
        render(<Story story={data} />);
        const title = screen.getByText('Hello, World!');
        const score = screen.getByText('[42]');
        const author = screen.getByText('by User');
        const comments = screen.getByText('with 7 comments');
        const time = screen.getByText(/on/);
        const link = screen.getByRole('link', { name: 'Hello, World!' });

        expect(title).toBeInTheDocument();
        expect(score).toBeInTheDocument();
        expect(author).toBeInTheDocument();
        expect(comments).toBeInTheDocument();
        expect(time).toBeInTheDocument();
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'https://example.com');
    });
});