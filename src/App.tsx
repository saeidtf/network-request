import { useState } from "react";
import "./App.css";
import useNetworkRequest from "./useNetworkRequest";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

function App() {
  const [count, setCount] = useState(0);

  const { data, error, loading, refetch } = useNetworkRequest<Post>(
    "https://jsonplaceholder.typicode.com/posts/1",
    "post-1"
  );

  if (error) return <div>{error}</div>;

  return (
    <>
      <h1>Network request custom hook</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <div className="card">
        <button onClick={refetch}>Refetch</button>
      </div>
      {loading && <div>Loading...</div>}
      {!loading && !data && <div>No data found</div>}
      {data && !loading && (
        <div style={{ textAlign: "left" }}>
          <h2>{data.title}</h2>
          <p>{data.body}</p>
        </div>
      )}
    </>
  );
}

export default App;
