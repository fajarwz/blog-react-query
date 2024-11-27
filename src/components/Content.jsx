import Pagination from "./Pagination"
import { useState } from "react";
import { getPosts } from "../api/posts";
import { useQuery } from "@tanstack/react-query";

export default function Content() {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    const initialPage = pageParam ? parseInt(pageParam, 10) - 1 : 0;
    const [currentPage, setCurrentPage] = useState(initialPage);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['blogs', currentPage], // Unique key for this query
        queryFn: () => getPosts(currentPage),
        staleTime: 20000, // the length of time you want to keep the data in the cache in milliseconds.
    });

    const handlePageChange = ({ selected }) => {
        const nextPage = selected;

        // Update the URL with the new page value
        const params = new URLSearchParams(window.location.search);
        params.set('page', nextPage + 1);

        // Replace the current URL without reloading the page
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);

        setCurrentPage(nextPage);
    };

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error.message}</p>;

    if (data.posts?.length > 0) {
        const limit = 10;
        const pageCount = Math.ceil(data.total / limit)
        return <>
            {data.posts.map((post) => (
                <div key={post.id}>{`${post.id} : ${post.title}`}</div>
            ))}

            <Pagination initialPage={initialPage} pageCount={pageCount} onPageChange={handlePageChange} />
        </>
    }

    return <div>No posts found.</div>
}
